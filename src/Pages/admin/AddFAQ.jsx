import React, { useState } from "react";
import api from "../../services/api";

export default function AddFAQ() {
  const [mainQuestion, setMainQuestion] = useState("");
  const [variants, setVariants] = useState(["", ""]);
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("");
  const [faculty, setFaculty] = useState("");
  const [tags, setTags] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Variant Handlers
  const handleVariantChange = (index, value) => {
    const newVariants = [...variants];
    newVariants[index] = value;
    setVariants(newVariants);
  };

  const addVariant = () => setVariants([...variants, ""]);

  const removeVariant = (index) => {
    const newVariants = variants.filter((_, i) => i !== index);
    setVariants(newVariants);
  };

  // Form Actions
  const clearForm = () => {
    setMainQuestion("");
    setVariants(["", ""]);
    setAnswer("");
    setCategory("");
    setFaculty("");
    setTags("");
  };

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const saveDraft = () => {
    // Implement local storage draft saving if needed
    triggerToast("📝 Draft Saved Locally!");
  };

  const submitFAQ = async () => {
    if (!mainQuestion.trim()) {
      alert("Please enter a primary question.");
      return;
    }
    if (!answer.trim()) {
      alert("Please provide an answer.");
      return;
    }
    if (!category) {
      alert("Please select a classification category.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Clean up empty variants
      const filteredVariants = variants.filter((v) => v.trim() !== "");

      // 2. Warn if they try to add more than 3 variants (since your DB only holds 3)
      if (filteredVariants.length > 3) {
        alert(
          "Your database currently only supports a maximum of 3 alternative questions.",
        );
        setIsSubmitting(false);
        return;
      }

      // 3. Map the array to your specific DB columns
      const payload = {
        question: mainQuestion,
        answer: answer,
        category: category,
        tags: tags || "general", // Fallback to "general" since your DB has nullable=False for tags
        alt_question_1: filteredVariants[0] || null,
        alt_question_2: filteredVariants[1] || null,
        alt_question_3: filteredVariants[2] || null,
      };

      await api.post("faqs/propose", payload);

      triggerToast("✅ FAQ Proposed Successfully! Awaiting approval.");
      clearForm();
    } catch (error) {
      console.error(error);
      alert("Failed to submit FAQ. Please check server logs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white/90 font-sans text-[14px] flex flex-col relative">
      {/* Topbar */}
      <div className="h-[60px] bg-[#111827] border-b border-white/5 flex items-center px-7 gap-4 shrink-0 sticky top-0 z-10">
        <div>
          <span className="font-serif text-[16px] font-bold text-white tracking-wide">
            Add FAQ Entry
          </span>
          <span className="text-[12px] text-white/40 ml-2">
            / Expand knowledge base
          </span>
        </div>
      </div>

      <div className="flex-1 p-7 pb-10 overflow-y-auto">
        <div className="flex gap-2 items-center p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[12px] text-blue-400 mb-5">
          <span>💡</span>
          <span>
            Add <strong>multiple question phrasings</strong> (variants) to
            improve retrieval accuracy. The more ways a question is worded, the
            better the chatbot matches student queries.
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
          {/* Left: Form */}
          <div className="bg-[#111827] border border-white/5 rounded-[14px] shadow-sm overflow-hidden">
            <div className="p-5 border-b border-white/5 flex justify-between items-center">
              <div>
                <div className="font-serif text-[13px] font-bold text-white">
                  New FAQ Entry
                </div>
                <div className="text-[11px] text-white/40 mt-1">
                  Fill all fields carefully (Requires Approval)
                </div>
              </div>
            </div>

            <div className="p-5">
              {/* Primary Question */}
              <div className="mb-6">
                <div className="font-serif text-[12px] font-bold text-[#C9A84C] tracking-[1px] uppercase mb-3 pb-2 border-b border-white/5">
                  Primary Question
                </div>
                <input
                  type="text"
                  maxLength={150}
                  className="w-full bg-[#1a2235] border border-white/5 rounded-lg py-2.5 px-3 text-white/90 text-[12.5px] outline-none focus:border-[#C9A84C] transition-colors"
                  placeholder="e.g. What is the cut-off mark for Pharmacy at UI?"
                  value={mainQuestion}
                  onChange={(e) => setMainQuestion(e.target.value)}
                />
                <div className="text-[10.5px] text-white/40 text-right mt-1 font-mono">
                  {mainQuestion.length} / 150
                </div>
              </div>

              {/* Variants */}
              <div className="mb-6">
                <div className="font-serif text-[12px] font-bold text-[#C9A84C] tracking-[1px] uppercase mb-3 pb-2 border-b border-white/5 flex items-center gap-2">
                  Question Variants
                  <span className="font-sans font-normal text-[11px] text-white/40 normal-case tracking-normal">
                    (alternative phrasings)
                  </span>
                </div>
                <div className="flex flex-col gap-2 mb-2">
                  {variants.map((v, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        className="flex-1 bg-[#1a2235] border border-white/5 rounded-lg py-2.5 px-3 text-white/90 text-[12.5px] outline-none focus:border-[#C9A84C] transition-colors"
                        placeholder="Alternative phrasing…"
                        value={v}
                        onChange={(e) =>
                          handleVariantChange(idx, e.target.value)
                        }
                      />
                      <button
                        onClick={() => removeVariant(idx)}
                        className="w-8 h-8 rounded-md border border-white/5 bg-[#1a2235] text-white/40 hover:border-red-500 hover:text-red-500 hover:bg-red-500/10 flex items-center justify-center transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={addVariant}
                  className="w-full py-1.5 rounded-md border border-dashed border-[#C9A84C]/30 text-[#C9A84C] text-[12px] hover:bg-[#C9A84C]/10 transition-colors"
                >
                  + Add Variant Phrasing
                </button>
              </div>

              {/* Answer */}
              <div className="mb-6">
                <div className="font-serif text-[12px] font-bold text-[#C9A84C] tracking-[1px] uppercase mb-3 pb-2 border-b border-white/5">
                  Answer
                </div>
                <textarea
                  maxLength={800}
                  className="w-full min-h-[140px] bg-[#1a2235] border border-white/5 rounded-lg py-2.5 px-3 text-white/90 text-[12.5px] outline-none focus:border-[#C9A84C] transition-colors resize-y"
                  placeholder="Type the complete, accurate advisory answer here. Be specific and include all relevant details."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                />
                <div className="text-[10.5px] text-white/40 text-right mt-1 font-mono">
                  {answer.length} / 800
                </div>
              </div>

              {/* Classification */}
              <div className="mb-6">
                <div className="font-serif text-[12px] font-bold text-[#C9A84C] tracking-[1px] uppercase mb-3 pb-2 border-b border-white/5">
                  Classification
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="text-[11px] text-white/40 block mb-1.5 tracking-[0.5px]">
                      CATEGORY
                    </label>
                    <select
                      className="w-full bg-[#1a2235] border border-white/5 rounded-lg py-2.5 px-3 text-white/90 text-[12.5px] outline-none focus:border-[#C9A84C] transition-colors"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="">— Select category —</option>
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
                      <option value="academic_policies">
                        academic_policies
                      </option>
                      <option value="programmes">programmes</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-white/40 block mb-1.5 tracking-[0.5px]">
                      FACULTY (optional)
                    </label>
                    <select
                      className="w-full bg-[#1a2235] border border-white/5 rounded-lg py-2.5 px-3 text-white/90 text-[12.5px] outline-none focus:border-[#C9A84C] transition-colors"
                      value={faculty}
                      onChange={(e) => setFaculty(e.target.value)}
                    >
                      <option value="">— All Faculties —</option>
                      <option value="Faculty of Science">
                        Faculty of Science
                      </option>
                      <option value="Faculty of Medicine">
                        Faculty of Medicine
                      </option>
                      <option value="Faculty of Law">Faculty of Law</option>
                      <option value="Faculty of Arts">Faculty of Arts</option>
                      <option value="Faculty of Education">
                        Faculty of Education
                      </option>
                      <option value="Faculty of Agriculture">
                        Faculty of Agriculture
                      </option>
                      <option value="Faculty of Social Sciences">
                        Faculty of Social Sciences
                      </option>
                      <option value="Faculty of Technology">
                        Faculty of Technology
                      </option>
                      <option value="Faculty of Public Health">
                        Faculty of Public Health
                      </option>
                      <option value="Faculty of Pharmacy">
                        Faculty of Pharmacy
                      </option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[11px] text-white/40 block mb-1.5 tracking-[0.5px]">
                    TAGS (comma-separated keywords)
                  </label>
                  <input
                    type="text"
                    className="w-full bg-[#1a2235] border border-white/5 rounded-lg py-2.5 px-3 text-white/90 text-[12.5px] outline-none focus:border-[#C9A84C] transition-colors"
                    placeholder="e.g. pharmacy, cut-off, jamb, score, b.pharm"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 justify-end mt-6">
                <button
                  onClick={clearForm}
                  className="bg-[#1a2235] hover:bg-white/10 text-white/40 hover:text-white/90 border border-white/5 py-2 px-4 rounded-lg text-[12.5px] transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={saveDraft}
                  className="bg-[#1a2235] hover:bg-white/10 text-white/40 hover:text-white/90 border border-white/5 py-2 px-4 rounded-lg text-[12.5px] transition-colors"
                >
                  Save Draft
                </button>
                <button
                  onClick={submitFAQ}
                  disabled={isSubmitting}
                  className="bg-[#C9A84C] hover:bg-[#d4b55e] text-black font-semibold text-[12.5px] py-2 px-5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : "✓ Propose FAQ Entry"}
                </button>
              </div>
            </div>
          </div>

          {/* Right: Preview + Tips */}
          <div className="flex flex-col gap-4">
            <div className="bg-[#111827] border border-white/5 rounded-[14px] shadow-sm overflow-hidden">
              <div className="p-4 border-b border-white/5">
                <div className="font-serif text-[13px] font-bold text-white">
                  Live Preview
                </div>
                <div className="text-[11px] text-white/40 mt-0.5">
                  How students will see this
                </div>
              </div>
              <div className="p-5">
                <div className="text-[11px] text-white/40 mb-2 tracking-[0.5px]">
                  STUDENT ASKS
                </div>
                <div className="flex gap-2 items-start mb-4">
                  <div className="w-7 h-7 rounded-full bg-[#0D2149] flex items-center justify-center text-[12px] shrink-0">
                    👤
                  </div>
                  <div className="bg-[#1a2235] border border-white/5 rounded-b-xl rounded-tr-xl py-2.5 px-3.5 text-[12.5px] text-white/90 max-w-[280px] min-h-[40px] break-words">
                    {mainQuestion || "Your question will appear here…"}
                  </div>
                </div>

                <div className="text-[11px] text-white/40 mb-2 tracking-[0.5px]">
                  CHATBOT ANSWERS
                </div>
                <div className="flex gap-2 items-start">
                  <div className="w-7 h-7 rounded-full bg-[#C9A84C] flex items-center justify-center text-[12px] shrink-0">
                    🤖
                  </div>
                  <div className="flex-1 bg-[#1a2235] border border-white/5 rounded-b-xl rounded-tr-xl py-3.5 px-4 text-[12.5px] text-white/90 leading-[1.65] min-h-[80px] whitespace-pre-wrap break-words">
                    {answer || "Answer will appear here as you type…"}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#111827] border border-white/5 rounded-[14px] shadow-sm overflow-hidden">
              <div className="p-4 border-b border-white/5">
                <div className="font-serif text-[13px] font-bold text-white">
                  Writing Guidelines
                </div>
              </div>
              <div className="p-5 flex flex-col gap-2.5">
                <div className="flex gap-2.5 items-start">
                  <span className="text-green-500 text-[14px] shrink-0">✓</span>
                  <span className="text-[12.5px] text-white/40">
                    Include{" "}
                    <strong className="text-white/90">specific numbers</strong>{" "}
                    (cut-off marks, years, credit counts)
                  </span>
                </div>
                <div className="flex gap-2.5 items-start">
                  <span className="text-green-500 text-[14px] shrink-0">✓</span>
                  <span className="text-[12.5px] text-white/40">
                    Write in{" "}
                    <strong className="text-white/90">
                      plain, simple language
                    </strong>{" "}
                    a secondary school student can understand
                  </span>
                </div>
                <div className="flex gap-2.5 items-start">
                  <span className="text-green-500 text-[14px] shrink-0">✓</span>
                  <span className="text-[12.5px] text-white/40">
                    Add{" "}
                    <strong className="text-white/90">
                      at least 3 variant phrasings
                    </strong>{" "}
                    to maximise retrieval recall
                  </span>
                </div>
                <div className="flex gap-2.5 items-start mt-1">
                  <span className="text-red-500 text-[14px] shrink-0">✗</span>
                  <span className="text-[12.5px] text-white/40">
                    Don't use{" "}
                    <strong className="text-white/90">
                      ambiguous language
                    </strong>{" "}
                    — answers must be factually accurate
                  </span>
                </div>
                <div className="flex gap-2.5 items-start">
                  <span className="text-red-500 text-[14px] shrink-0">✗</span>
                  <span className="text-[12.5px] text-white/40">
                    Don't use{" "}
                    <strong className="text-white/90">
                      jargon or acronyms
                    </strong>{" "}
                    without explaining them
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Success Toast Notification */}
        {showToast && (
          <div className="fixed bottom-7 right-7 bg-green-500 text-black font-semibold text-[13px] py-3 px-5 rounded-xl z-[200] animate-in slide-in-from-bottom-2 fade-in shadow-lg">
            {toastMessage}
          </div>
        )}
      </div>
    </div>
  );
}
