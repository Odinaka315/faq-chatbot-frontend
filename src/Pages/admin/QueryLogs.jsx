import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";

export default function QueryLogs() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRow, setExpandedRow] = useState(null);

  // 🌟 TanStack Query Fetcher
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["queryLogs", activeFilter, activeCategory, currentPage],
    queryFn: async () => {
      const res = await api.get("/analytics/query-logs", {
        params: {
          filter: activeFilter,
          category: activeCategory,
          page: currentPage,
          limit: 15,
        },
      });
      return res.data;
    },
    keepPreviousData: true, // Keeps current data on screen while fetching the next page
  });

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const getScoreColor = (score) => {
    if (score >= 0.75) return "bg-green-500/10 text-green-500";
    if (score >= 0.4) return "bg-amber-500/10 text-amber-500";
    return "bg-red-500/10 text-red-500";
  };

  const getStatusDisplay = (status) => {
    if (status === "Answered")
      return (
        <>
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block mr-1.5"></span>
          <span className="text-green-500">Answered</span>
        </>
      );
    return (
      <>
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block mr-1.5"></span>
        <span className="text-red-500">No Match</span>
      </>
    );
  };

  // Helper to build pagination buttons safely
  const renderPagination = () => {
    if (!data) return null;
    const { total_pages, current_page } = data.pagination;
    const pages = [];

    // Simple pagination logic (shows up to 5 buttons max)
    let startPage = Math.max(1, current_page - 2);
    let endPage = Math.min(total_pages, current_page + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`w-7 h-7 rounded-md border flex items-center justify-center text-[12px] transition-all ${
            current_page === i
              ? "bg-[#C9A84C]/15 border-[#C9A84C] text-[#C9A84C] font-semibold"
              : "bg-[#1a2235] border-white/5 text-white/40 hover:bg-white/10 hover:text-white/90"
          }`}
        >
          {i}
        </button>,
      );
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white/90 font-sans text-[14px] flex flex-col">
      <div className="h-[60px] bg-[#111827] border-b border-white/5 flex items-center px-7 gap-4 shrink-0 sticky top-0 z-10">
        <div>
          <span className="font-serif text-[16px] font-bold text-white tracking-wide">
            Query Logs
          </span>
          <span className="text-[12px] text-white/40 ml-2">
            / Browse & filter
          </span>
        </div>
      </div>

      <div className="flex-1 p-7 pb-10 overflow-y-auto">
        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-2.5 mb-5">
          <button
            onClick={() => {
              setActiveFilter("all");
              setCurrentPage(1);
            }}
            className={`text-[12px] font-medium px-3.5 py-1.5 rounded-full border transition-all ${activeFilter === "all" ? "bg-[#C9A84C]/15 border-[#C9A84C]/30 text-[#C9A84C]" : "border-white/5 bg-[#1a2235] text-white/40 hover:bg-white/10"}`}
          >
            All ({data?.counts?.all || 0})
          </button>
          <button
            onClick={() => {
              setActiveFilter("answered");
              setCurrentPage(1);
            }}
            className={`text-[12px] font-medium px-3.5 py-1.5 rounded-full border transition-all ${activeFilter === "answered" ? "bg-[#C9A84C]/15 border-[#C9A84C]/30 text-[#C9A84C]" : "border-white/5 bg-[#1a2235] text-white/40 hover:bg-white/10"}`}
          >
            ✅ Answered ({data?.counts?.answered || 0})
          </button>
          <button
            onClick={() => {
              setActiveFilter("no_match");
              setCurrentPage(1);
            }}
            className={`text-[12px] font-medium px-3.5 py-1.5 rounded-full border transition-all ${activeFilter === "no_match" ? "bg-[#C9A84C]/15 border-[#C9A84C]/30 text-[#C9A84C]" : "border-white/5 bg-[#1a2235] text-white/40 hover:bg-white/10"}`}
          >
            ❌ No Match ({data?.counts?.no_match || 0})
          </button>
          <button
            onClick={() => {
              setActiveFilter("low_confidence");
              setCurrentPage(1);
            }}
            className={`text-[12px] font-medium px-3.5 py-1.5 rounded-full border transition-all ${activeFilter === "low_confidence" ? "bg-[#C9A84C]/15 border-[#C9A84C]/30 text-[#C9A84C]" : "border-white/5 bg-[#1a2235] text-white/40 hover:bg-white/10"}`}
          >
            ⚠ Low Confidence ({data?.counts?.low_confidence || 0})
          </button>

          <div className="flex-1"></div>

          <select
            value={activeCategory}
            onChange={(e) => {
              setActiveCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-[#1a2235] border border-white/5 rounded-lg py-1.5 px-3 text-white/90 text-[12px] outline-none focus:border-[#C9A84C] transition-colors w-auto"
          >
            <option value="All Categories">All Categories</option>
            <option value="cut_off_marks">cut_off_marks</option>
            <option value="jamb_subjects">jamb_subjects</option>
            <option value="application_process">application_process</option>
            <option value="career_pathways">career_pathways</option>
            <option value="post_utme">post_utme</option>
          </select>
        </div>

        {/* Data Panel */}
        <div className="bg-[#111827] border border-white/5 rounded-[14px] overflow-hidden shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-white/5">
            <div>
              <div className="font-serif text-[13px] font-bold text-white flex items-center gap-2">
                Query Log
                {isFetching && (
                  <span className="w-3 h-3 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin"></span>
                )}
              </div>
              <div className="text-[11px] text-white/40 mt-0.5">
                Showing {data?.logs?.length || 0} of{" "}
                {data?.pagination?.total_items || 0} total queries · sorted by
                newest
              </div>
            </div>
            <button
              onClick={() => refetch()}
              className="text-[12px] text-[#C9A84C] font-medium py-1 px-3 border border-[#C9A84C]/20 rounded-md hover:bg-[#C9A84C]/15 transition-colors"
            >
              Refresh ↻
            </button>
          </div>

          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="py-3 px-4 text-left text-[10.5px] font-semibold tracking-[1px] uppercase text-white/40">
                    Time
                  </th>
                  <th className="py-3 px-4 text-left text-[10.5px] font-semibold tracking-[1px] uppercase text-white/40">
                    Student Query
                  </th>
                  <th className="py-3 px-4 text-left text-[10.5px] font-semibold tracking-[1px] uppercase text-white/40">
                    Matched FAQ
                  </th>
                  <th className="py-3 px-4 text-left text-[10.5px] font-semibold tracking-[1px] uppercase text-white/40">
                    Category
                  </th>
                  <th className="py-3 px-4 text-left text-[10.5px] font-semibold tracking-[1px] uppercase text-white/40">
                    Score
                  </th>
                  <th className="py-3 px-4 text-left text-[10.5px] font-semibold tracking-[1px] uppercase text-white/40">
                    Status
                  </th>
                  <th className="py-3 px-4 text-left text-[10.5px] font-semibold tracking-[1px] uppercase text-white/40"></th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="py-10 text-center text-white/40 text-[12px]"
                    >
                      Loading logs from database...
                    </td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="py-10 text-center text-red-500/70 text-[12px]"
                    >
                      Failed to fetch logs. Please try again.
                    </td>
                  </tr>
                ) : data?.logs?.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="py-10 text-center text-white/40 text-[12px]"
                    >
                      No queries found matching these filters.
                    </td>
                  </tr>
                ) : (
                  data?.logs.map((log) => (
                    <React.Fragment key={log.id}>
                      <tr
                        onClick={() => toggleRow(log.id)}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group"
                      >
                        <td className="py-3.5 px-4 font-mono text-[11px] text-white/40 w-[80px]">
                          {log.time}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="max-w-[230px] whitespace-nowrap overflow-hidden text-ellipsis font-mono text-[11.5px] text-white/60 group-hover:text-white/90 transition-colors">
                            "{log.query}"
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="max-w-[200px] whitespace-nowrap overflow-hidden text-ellipsis text-[12px] text-white/90">
                            {log.matched_faq}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-[10.5px] font-medium px-2.5 py-1 rounded-md bg-[#1a2235] text-white/40 border border-white/5">
                            {log.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center text-[11px] font-bold px-2.5 py-0.5 rounded-full font-mono ${getScoreColor(log.score)}`}
                          >
                            {log.score.toFixed(3)}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-[12px]">
                          {getStatusDisplay(log.status)}
                        </td>
                        <td className="py-3.5 px-4 text-right w-[80px]">
                          <button className="bg-[#1a2235] border border-white/5 text-white/50 rounded-md py-1 px-2.5 text-[11px] hover:text-white hover:border-white/20 transition-all">
                            {expandedRow === log.id ? "View ▴" : "View ▾"}
                          </button>
                        </td>
                      </tr>

                      {expandedRow === log.id && (
                        <tr className="bg-[#1a2235] border-l-[3px] border-[#C9A84C] animate-in fade-in zoom-in-95 duration-200">
                          <td colSpan="7" className="p-5">
                            <div className="text-[#C9A84C] text-[11px] font-bold tracking-[1px] uppercase mb-2.5">
                              Full Answer Returned
                            </div>
                            <div className="text-[12.5px] text-white/90 leading-[1.7] max-w-4xl mb-4">
                              {log.answer}
                            </div>
                            <div className="text-[11px] text-white/40 font-mono">
                              Similarity Score: {log.score.toFixed(3)} ·
                              Category: {log.category} · FAQ ID: {log.faq_id} ·
                              Timestamp: {log.time}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between py-3.5 px-5 border-t border-white/5 bg-[#111827]">
            <span className="text-[12px] text-white/40">
              Page {data?.pagination?.current_page || 1} of{" "}
              {data?.pagination?.total_pages || 1}
            </span>
            <div className="flex gap-1.5">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="w-7 h-7 rounded-md border bg-[#1a2235] border-white/5 text-white/40 hover:bg-white/10 disabled:opacity-50 flex items-center justify-center"
              >
                ‹
              </button>

              {renderPagination()}

              <button
                onClick={() =>
                  setCurrentPage(
                    Math.min(
                      data?.pagination?.total_pages || 1,
                      currentPage + 1,
                    ),
                  )
                }
                disabled={currentPage === data?.pagination?.total_pages}
                className="w-7 h-7 rounded-md border bg-[#1a2235] border-white/5 text-white/40 hover:bg-white/10 disabled:opacity-50 flex items-center justify-center"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
