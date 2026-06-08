import { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import api from "../../services/api";

export function RetrievalAccuracy({ metrics }) {
  const accuracy = metrics?.top_1_accuracy_estimate || 0;

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface">
      <div className="border-b border-border px-5 py-4">
        <div className="font-display text-[13px] font-bold text-white">
          Retrieval Accuracy
        </div>
        <div className="mt-[1px] text-[11px] text-muted">
          Test set of 50 queries
        </div>
      </div>
      <div className="flex flex-1 flex-col items-center p-6">
        {/* CSS Donut Chart */}
        <div
          className="relative mb-4 flex h-[120px] w-[120px] items-center justify-center rounded-full"
          style={{
            background: `conic-gradient(#22c55e 0% ${accuracy}%, rgba(239,68,68,.12) ${accuracy}% 100%)`,
          }}
        >
          <div className="absolute inset-4 rounded-full bg-surface"></div>
          <span className="relative z-10 font-display text-2xl font-extrabold text-white">
            {accuracy}%
          </span>
        </div>
        <div className="text-xs text-muted mb-4">Top-1 Accuracy</div>

        {/* Stats List */}
        <div className="w-full space-y-2.5 border-t border-border pt-4 text-xs">
          <div className="flex justify-between">
            <span className="text-muted">Top-1 Accuracy</span>
            <span className="font-mono font-bold text-green-500">
              {accuracy.toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Mean Similarity</span>
            <span className="font-mono font-bold text-text">
              {metrics?.average_confidence?.toFixed(3) || "0.000"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Mean SUS Score</span>
            <span className="font-mono font-bold text-green-500">
              {metrics?.mean_sus_score || 0} / 100
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function QueryCategories() {
  const { data: categories = [] } = useQuery({
    queryKey: ["dashboard-categories"],
    queryFn: async () => (await api.get("/analytics/categories")).data,
  });

  const maxCount = categories[0]?.count || 1;
  const colors = [
    "bg-gold",
    "bg-blue-500",
    "bg-green-500",
    "bg-amber-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-red-500",
  ];

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface">
      <div className="border-b border-border px-5 py-4 ">
        <div className="font-display text-[13px] font-bold text-white">
          Query Categories
        </div>
        <div className="mt-[1px] text-[11px] text-muted">
          Distribution this month
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5 overflow-y-auto max-h-[320px] no-scrollbar">
        {categories.map((cat, idx) => {
          const width = Math.round((cat.count / maxCount) * 100);
          return (
            <div key={idx} className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-text">
                  {cat.category.replace(/_/g, " ").toUpperCase()}
                </span>
                <span className="font-mono text-muted">{cat.count}</span>
              </div>
              <div className="h-1 w-full overflow-hidden rounded-full bg-dim">
                <div
                  className={`h-full rounded-full ${colors[idx % colors.length]}`}
                  style={{ width: `${width}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function QuickAddFAQ() {
  const queryClient = useQueryClient();

  // 1. Form State
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("cut_off_marks");
  const [tags, setTags] = useState("");

  // 2. Toast Notification State
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // 3. Auto-hide the toast after 3 seconds
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  // Helper function to trigger the toast
  const showToast = (message, type) => {
    setToast({ show: true, message, type });
  };

  // 4. The Mutation
  const addFaqMutation = useMutation({
    mutationFn: async (newFaqData) => {
      const response = await api.post("/faqs", newFaqData);
      return response.data;
    },
    onSuccess: () => {
      // Clear form
      setQuestion("");
      setAnswer("");
      setCategory("cut_off_marks");
      setTags("");

      // Trigger Success Toast
      showToast("FAQ successfully added to knowledge base!", "success");

      // Refresh Dashboard Data
      queryClient.invalidateQueries({ queryKey: ["dashboard-metrics"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-categories"] });
    },
    onError: (err) => {
      // Trigger Error Toast
      showToast(
        err.response?.data?.detail || "Failed to add FAQ. Please try again.",
        "error",
      );
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) {
      showToast("Question and Answer are required.", "error");
      return;
    }

    addFaqMutation.mutate({
      question,
      answer,
      category,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== ""),
    });
  };

  const handleClear = () => {
    setQuestion("");
    setAnswer("");
    setCategory("cut_off_marks");
    setTags("");
    setToast({ ...toast, show: false }); // Hide any active toasts on clear
  };

  return (
    <>
      <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface">
        <div className="border-b border-border px-5 py-4">
          <div className="font-display text-[13px] font-bold text-white">
            Add FAQ Entry
          </div>
          <div className="mt-[1px] text-[11px] text-muted">
            Expand the knowledge base
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col gap-3 p-5"
        >
          <div>
            <label className="mb-1 block text-[11px] tracking-wide text-muted uppercase">
              Question
            </label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface2 px-3 py-2 text-[12.5px] text-text outline-none transition-colors focus:border-gold placeholder:text-muted/40"
              placeholder="e.g. What is the cut-off for Pharmacy?"
            />
          </div>

          <div>
            <label className="mb-1 block text-[11px] tracking-wide text-muted uppercase">
              Answer
            </label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="min-h-[80px] w-full resize-y rounded-lg border border-border bg-surface2 px-3 py-2 text-[12.5px] text-text outline-none transition-colors focus:border-gold placeholder:text-muted/40"
              placeholder="Type the full advisory answer here..."
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-[11px] tracking-wide text-muted uppercase">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface2 px-3 py-2 text-[12.5px] text-text outline-none transition-colors focus:border-gold appearance-none"
              >
                <option value="cut_off_marks">Cut-Off Marks</option>
                <option value="application_process">Application Process</option>
                <option value="jamb_subjects">JAMB Subjects</option>
                <option value="career_pathways">Career Pathways</option>
                <option value="post_utme">Post-UTME</option>
                <option value="direct_entry">Direct Entry</option>
                <option value="fees">Fees & Accommodation</option>
                <option value="general_info">General Info</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[11px] tracking-wide text-muted uppercase">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface2 px-3 py-2 text-[12.5px] text-text outline-none transition-colors focus:border-gold placeholder:text-muted/40"
                placeholder="e.g. pharmacy, jamb, score"
              />
            </div>
          </div>

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={handleClear}
              disabled={addFaqMutation.isPending}
              className="rounded-lg border border-border bg-surface2 px-4 py-2 text-[12.5px] text-muted transition-colors hover:bg-dim hover:text-text disabled:opacity-50"
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={addFaqMutation.isPending}
              className="rounded-lg bg-gold px-5 py-2 text-[12.5px] font-bold text-black transition-colors hover:bg-[#d4b55e] disabled:opacity-50"
            >
              {addFaqMutation.isPending ? "Adding..." : "+ Add Entry"}
            </button>
          </div>
        </form>
      </div>

      {/* The Floating Toast Notification */}
      <div
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border bg-surface px-5 py-3.5 shadow-2xl transition-all duration-300 ease-in-out ${
          toast.show
            ? "translate-y-0 opacity-100"
            : "translate-y-8 opacity-0 pointer-events-none"
        } ${
          toast.type === "success" ? "border-green-500/20" : "border-red-500/20"
        }`}
      >
        <span className="text-[18px]">
          {toast.type === "success" ? "✅" : "⚠️"}
        </span>
        <span
          className={`text-[13px] font-medium ${
            toast.type === "success" ? "text-green-400" : "text-red-400"
          }`}
        >
          {toast.message}
        </span>
      </div>
    </>
  );
}
