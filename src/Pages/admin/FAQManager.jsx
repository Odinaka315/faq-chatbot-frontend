import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api"; // Adjust this import based on your setup

export default function FAQManager() {
  const queryClient = useQueryClient();

  // State for Filters and Pagination
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);

  // State for Edit Modal and Notifications
  const [editingFaq, setEditingFaq] = useState(null);
  const [editForm, setEditForm] = useState({
    question: "",
    answer: "",
    category: "",
    tags: "",
  });
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // 🌟 FETCH FAQS (TanStack Query)
  const { data, isLoading, isError } = useQuery({
    queryKey: ["faqs", currentPage, search, category, statusFilter],
    queryFn: async () => {
      const res = await api.get("/faqs", {
        params: {
          search: search || undefined,
          category: category !== "All Categories" ? category : undefined,
          status:
            statusFilter !== "All Status"
              ? statusFilter === "Pending"
                ? "pending_create"
                : "approved"
              : undefined,
          page: currentPage,
          limit: 20,
        },
      });
      return res.data;
    },
    keepPreviousData: true,
  });

  // 🌟 MUTATIONS
  const approveMutation = useMutation({
    mutationFn: (id) => api.post(`/faqs/${id}/approve`),
    onSuccess: () => {
      showToast("✅ FAQ Approved successfully!", "success");
      queryClient.invalidateQueries(["faqs"]);
    },
    onError: (error) => {
      if (error.response?.status === 403 || error.response?.status === 401) {
        showToast("⚠️ Warning: Only Administrators can approve FAQs.", "error");
      } else {
        showToast("❌ Failed to approve FAQ.", "error");
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => api.put(`/faqs/${id}`, payload),
    onSuccess: () => {
      showToast("✅ Changes saved successfully!", "success");
      closeEdit();
      queryClient.invalidateQueries(["faqs"]);
    },
    onError: () => showToast("❌ Failed to save changes.", "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/faqs/${id}`),
    onSuccess: () => {
      showToast("🗑️ FAQ deleted successfully.", "success");
      closeEdit();
      queryClient.invalidateQueries(["faqs"]);
    },
    onError: () => showToast("❌ Failed to delete FAQ.", "error"),
  });

  // Helpers
  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "success" }),
      4000,
    );
  };

  const openEdit = (faq) => {
    setEditingFaq(faq);
    setEditForm({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      tags: faq.tags || "",
    });
  };

  const closeEdit = () => {
    setEditingFaq(null);
  };

  const handleSave = () => {
    updateMutation.mutate({ id: editingFaq.id, payload: editForm });
  };

  const handleDelete = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this FAQ? This action cannot be undone.",
      )
    ) {
      deleteMutation.mutate(editingFaq.id);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white/90 font-sans text-[14px] flex flex-col relative">
      {/* Topbar */}
      <div className="h-[60px] bg-[#111827] border-b border-white/5 flex items-center px-7 gap-4 shrink-0 sticky top-0 z-10">
        <div>
          <span className="font-serif text-[16px] font-bold text-white tracking-wide">
            FAQ Manager
          </span>
          <span className="text-[12px] text-white/40 ml-2">
            / Knowledge base entries
          </span>
        </div>
      </div>

      <div className="flex-1 p-7 pb-10 overflow-y-auto">
        {/* Search & Filter Bar */}
        <div className="flex flex-wrap gap-2.5 mb-5 items-center">
          <div className="flex items-center gap-2 bg-[#1a2235] border border-white/5 rounded-lg py-1.5 px-3 flex-1 max-w-[380px]">
            <span className="text-[13px]">🔍</span>
            <input
              type="text"
              placeholder="Search FAQ questions…"
              className="bg-transparent border-none outline-none text-white/90 text-[13px] w-full"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <select
            className="bg-[#1a2235] border border-white/5 rounded-lg py-2 px-3 text-white/90 text-[12.5px] outline-none focus:border-[#C9A84C] w-[150px]"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option>All Status</option>
            <option>Approved</option>
            <option>Pending</option>
          </select>

          <select
            className="bg-[#1a2235] border border-white/5 rounded-lg py-2 px-3 text-white/90 text-[12.5px] outline-none focus:border-[#C9A84C] w-[180px]"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option>All Categories</option>
            <option>cut_off_marks</option>
            <option>jamb_subjects</option>
            <option>Application Process</option>
            <option>career_pathways</option>
            <option>post_utme</option>
            <option>direct_entry</option>
            <option>olevel_requirements</option>
            <option>fees</option>
            <option>general_info</option>
            <option>campus_life</option>
          </select>

          <a
            href="/add-faq"
            className="bg-[#C9A84C] hover:bg-[#d4b55e] text-black font-semibold text-[12.5px] py-2 px-4 rounded-lg transition-all inline-flex items-center gap-1.5 no-underline"
          >
            ➕ Add FAQ Entry
          </a>

          <span className="text-[12px] text-white/40 ml-auto">
            Showing {data?.data?.length || 0} of{" "}
            {data?.pagination?.total_items || 0} entries
          </span>
        </div>

        {/* FAQ Table Panel */}
        <div className="bg-[#111827] border border-white/5 rounded-[14px] overflow-hidden shadow-sm">
          <div className="flex items-center justify-between p-4 px-5 border-b border-white/5">
            <div>
              <div className="font-serif text-[13px] font-bold text-white">
                FAQ Knowledge Base
              </div>
              <div className="text-[11px] text-white/40 mt-0.5">
                {data?.pagination?.total_items || 0} entries · sorted by query
                frequency
              </div>
            </div>
            <div className="flex gap-2">
              <button className="text-[12px] text-[#C9A84C] font-medium py-1 px-3 border border-[#C9A84C]/20 rounded-md hover:bg-[#C9A84C]/15 transition-colors">
                Import CSV
              </button>
              <button className="text-[12px] text-[#C9A84C] font-medium py-1 px-3 border border-[#C9A84C]/20 rounded-md hover:bg-[#C9A84C]/15 transition-colors">
                Export ↗
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 px-5 py-2.5 border-b border-white/5 bg-[#1a2235]">
            <span className="text-[10px] font-semibold tracking-[1px] uppercase text-white/40 w-[30px]">
              #
            </span>
            <span className="text-[10px] font-semibold tracking-[1px] uppercase text-white/40 flex-1">
              Question
            </span>
            <span className="text-[10px] font-semibold tracking-[1px] uppercase text-white/40 w-[120px]">
              Category
            </span>
            <span className="text-[10px] font-semibold tracking-[1px] uppercase text-white/40 w-[60px] text-center">
              Status
            </span>
            <span className="text-[10px] font-semibold tracking-[1px] uppercase text-white/40 w-[38px] text-right">
              Hits
            </span>
            <span className="text-[10px] font-semibold tracking-[1px] uppercase text-white/40 w-[150px] text-right pr-2">
              Actions
            </span>
          </div>

          <div className="min-h-[400px]">
            {isLoading ? (
              <div className="p-10 text-center text-white/40 text-[12px]">
                Loading knowledge base...
              </div>
            ) : isError ? (
              <div className="p-10 text-center text-red-500/70 text-[12px]">
                Failed to load FAQs.
              </div>
            ) : data?.data?.length === 0 ? (
              <div className="p-10 text-center text-white/40 text-[12px]">
                No FAQs found matching criteria.
              </div>
            ) : (
              data?.data?.map((faq) => {
                const isPending =
                  faq.status === "pending_create" || !faq.approved_by_id;

                return (
                  <div
                    key={faq.id}
                    className="flex items-center gap-3 px-5 py-3.5 border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <div className="text-[10px] font-semibold text-white/40 font-mono w-[30px] shrink-0">
                      #{faq.id}
                    </div>
                    <div className="flex-1 min-w-0 text-[12.5px] text-white/90 whitespace-nowrap overflow-hidden text-ellipsis">
                      {faq.question}
                    </div>
                    <div className="w-[120px] shrink-0">
                      <span className="text-[10.5px] font-medium px-2.5 py-1 rounded-md bg-[#1a2235] text-white/40 border border-white/5">
                        {faq.category}
                      </span>
                    </div>
                    <div className="w-[60px] shrink-0 text-center">
                      {isPending ? (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500">
                          Pending
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-500/10 text-green-500">
                          Live
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-white/40 font-mono w-[38px] text-right shrink-0">
                      {faq.hits || 0}×
                    </div>
                    <div className="flex gap-1.5 shrink-0 w-[150px] justify-end">
                      {isPending && (
                        <button
                          onClick={() => approveMutation.mutate(faq.id)}
                          disabled={approveMutation.isLoading}
                          className="text-[11px] px-2.5 py-1 rounded-md border border-amber-500/30 text-amber-500 hover:bg-amber-500/10 transition-colors"
                        >
                          ✓ Approve
                        </button>
                      )}
                      <button
                        onClick={() => openEdit(faq)}
                        className="text-[11px] px-2.5 py-1 rounded-md border border-white/5 bg-transparent text-white/40 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-500/10 transition-colors"
                      >
                        ✏ Edit
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 px-5 border-t border-white/5 bg-[#111827]">
            <span className="text-[12px] text-white/40">
              Page {data?.pagination?.current_page || 1} of{" "}
              {data?.pagination?.total_pages || 1} ·{" "}
              {data?.pagination?.total_items || 0} total entries
            </span>
            <div className="flex gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-7 h-7 rounded-md border bg-[#1a2235] border-white/5 text-white/40 hover:bg-white/10 flex items-center justify-center disabled:opacity-50"
              >
                ‹
              </button>
              <button className="w-7 h-7 rounded-md border bg-[#C9A84C]/15 border-[#C9A84C] text-[#C9A84C] font-semibold flex items-center justify-center">
                {currentPage}
              </button>
              <button
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.min(data?.pagination?.total_pages || 1, p + 1),
                  )
                }
                disabled={currentPage === (data?.pagination?.total_pages || 1)}
                className="w-7 h-7 rounded-md border bg-[#1a2235] border-white/5 text-white/40 hover:bg-white/10 flex items-center justify-center disabled:opacity-50"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 🌟 Edit Modal */}
      {editingFaq && (
        <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center animate-in fade-in duration-200">
          <div
            className="bg-[#111827] border border-white/5 rounded-2xl p-7 w-[560px] max-w-[92vw] max-h-[85vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()} // Prevent clicking inside modal from closing it
          >
            <div className="font-serif text-[15px] font-bold text-white mb-5">
              ✏️ Edit FAQ Entry —{" "}
              <span className="text-[#C9A84C] font-mono font-normal">
                #{editingFaq.id}
              </span>
            </div>

            <div className="flex flex-col gap-3.5">
              <div>
                <label className="text-[11px] text-white/40 block mb-1.5 tracking-[0.5px]">
                  QUESTION
                </label>
                <input
                  type="text"
                  value={editForm.question}
                  onChange={(e) =>
                    setEditForm({ ...editForm, question: e.target.value })
                  }
                  className="w-full bg-[#1a2235] border border-white/5 rounded-lg py-2.5 px-3 text-white/90 text-[12.5px] outline-none focus:border-[#C9A84C] transition-colors"
                />
              </div>

              <div>
                <label className="text-[11px] text-white/40 block mb-1.5 tracking-[0.5px]">
                  ANSWER
                </label>
                <textarea
                  value={editForm.answer}
                  onChange={(e) =>
                    setEditForm({ ...editForm, answer: e.target.value })
                  }
                  className="w-full bg-[#1a2235] border border-white/5 rounded-lg py-2.5 px-3 text-white/90 text-[12.5px] outline-none focus:border-[#C9A84C] transition-colors min-h-[120px] resize-y"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] text-white/40 block mb-1.5 tracking-[0.5px]">
                    CATEGORY
                  </label>
                  <select
                    value={editForm.category}
                    onChange={(e) =>
                      setEditForm({ ...editForm, category: e.target.value })
                    }
                    className="w-full bg-[#1a2235] border border-white/5 rounded-lg py-2.5 px-3 text-white/90 text-[12.5px] outline-none focus:border-[#C9A84C] transition-colors"
                  >
                    <option value="cut_off_marks">cut_off_marks</option>
                    <option value="jamb_subjects">jamb_subjects</option>
                    <option value="application_process">
                      application_process
                    </option>
                    <option value="career_pathways">career_pathways</option>
                    <option value="post_utme">post_utme</option>
                    <option value="direct_entry">direct_entry</option>
                    <option value="olevel_requirements">
                      olevel_requirements
                    </option>
                    <option value="fees">fees</option>
                    <option value="general_info">general_info</option>
                    <option value="campus_life">campus_life</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-white/40 block mb-1.5 tracking-[0.5px]">
                    TAGS
                  </label>
                  <input
                    type="text"
                    value={editForm.tags}
                    onChange={(e) =>
                      setEditForm({ ...editForm, tags: e.target.value })
                    }
                    className="w-full bg-[#1a2235] border border-white/5 rounded-lg py-2.5 px-3 text-white/90 text-[12.5px] outline-none focus:border-[#C9A84C] transition-colors"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  onClick={closeEdit}
                  className="bg-[#1a2235] hover:bg-white/10 text-white/40 hover:text-white/90 border border-white/5 py-2 px-4 rounded-lg text-[12.5px] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 py-2 px-4 rounded-lg text-[12.5px] font-semibold transition-colors"
                >
                  Delete Entry
                </button>
                <button
                  onClick={handleSave}
                  disabled={updateMutation.isLoading}
                  className="bg-[#C9A84C] hover:bg-[#d4b55e] text-black py-2 px-5 rounded-lg text-[12.5px] font-semibold transition-colors disabled:opacity-50"
                >
                  {updateMutation.isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Toast Notification */}
      {toast.show && (
        <div
          className={`fixed bottom-7 right-7 font-semibold text-[13px] py-3 px-5 rounded-xl z-[200] animate-in slide-in-from-bottom-2 fade-in shadow-lg ${toast.type === "error" ? "bg-red-500 text-white" : "bg-green-500 text-black"}`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
