import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api";

export default function ExportLogs() {
  const queryClient = useQueryClient();

  // Initialize with empty strings so it pulls ALL data by default unless the user specifies
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [isExporting, setIsExporting] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    isError: false,
  });

  const { data: historyLogs = [], isLoading: loadingHistory } = useQuery({
    queryKey: ["export-history"],
    queryFn: async () => (await api.get("/exports/history")).data,
  });

  const triggerToast = (message, isError = false) => {
    setToast({ show: true, message, isError });
    setTimeout(
      () => setToast({ show: false, message: "", isError: false }),
      3000,
    );
  };

  const handleApplyFilter = () => {
    if (!startDate && !endDate) {
      triggerToast("Please select at least one date.", true);
      return;
    }
    triggerToast("Date range applied to export metrics.");
  };

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    triggerToast("Date filters cleared.");
  };

  const handleDownload = async (endpoint, filename) => {
    setIsExporting(true);
    triggerToast(`Generating ${filename}...`);

    try {
      const response = await api.get(endpoint, {
        params: {
          start_date: startDate || undefined,
          end_date: endDate || undefined,
        },
        responseType: "blob",
      });

      const contentDisposition = response.headers["content-disposition"];
      let finalFilename = filename;
      if (contentDisposition && contentDisposition.includes("filename=")) {
        finalFilename = contentDisposition
          .split("filename=")[1]
          .replace(/"/g, "");
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", finalFilename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      queryClient.invalidateQueries({ queryKey: ["export-history"] });
      triggerToast("Export successful!");
    } catch (error) {
      triggerToast("Export failed. Please try again.", true);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 rounded-xl border border-blue-500/20 bg-blue-500/10 px-4 py-3 text-sm text-blue-500">
        <span className="text-lg">📥</span>
        <span className="flex-1">
          All exports are generated as downloadable files. Query logs older than
          90 days are automatically archived.
        </span>
      </div>

      <div>
        <div className="text-[11px] font-semibold uppercase tracking-wide text-muted mb-2.5">
          Date Range Filter
        </div>
        <div className="flex items-center gap-3">
          <label className="text-xs text-muted">From</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="rounded-lg border border-border bg-surface2 px-3 py-2 text-sm text-text outline-none focus:border-gold"
          />
          <span className="text-muted">→</span>
          <label className="text-xs text-muted">To</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="rounded-lg border border-border bg-surface2 px-3 py-2 text-sm text-text outline-none focus:border-gold"
          />
          <button
            onClick={handleApplyFilter}
            className="rounded-lg bg-gold px-4 py-2 text-xs font-semibold text-black transition-all hover:bg-[#d4b55e]"
          >
            Apply Filter
          </button>
          <button
            onClick={handleReset}
            className="rounded-lg border border-border bg-surface2 px-3 py-2 text-xs text-muted transition-colors hover:bg-dim hover:text-text"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-surface p-6 transition-colors hover:border-gold">
          <div className="mb-3 text-3xl">📋</div>
          <div className="font-display text-sm font-bold text-white mb-1">
            Query Log (CSV)
          </div>
          <div className="text-xs text-muted mb-4 leading-relaxed">
            Full log of all student queries including timestamp, matched FAQ,
            similarity score, and status.
          </div>
          <button
            onClick={() => handleDownload("/exports/queries", "query_log.csv")}
            disabled={isExporting}
            className="rounded-lg bg-gold px-4 py-2 text-xs font-semibold text-black transition-colors hover:bg-[#d4b55e] disabled:opacity-50"
          >
            ↓ Download CSV
          </button>
        </div>

        <div className="rounded-xl border border-border bg-surface p-6 transition-colors hover:border-gold">
          <div className="mb-3 text-3xl">📊</div>
          <div className="font-display text-sm font-bold text-white mb-1">
            Accuracy Report (PDF)
          </div>
          <div className="text-xs text-muted mb-4 leading-relaxed">
            Formatted evaluation report with Top-1/3 accuracy, similarity
            distributions, SUS score, and TAM findings.
          </div>
          <button
            onClick={() =>
              handleDownload("/exports/accuracy", "accuracy_report.pdf")
            }
            disabled={isExporting}
            className="rounded-lg bg-gold px-4 py-2 text-xs font-semibold text-black transition-colors hover:bg-[#d4b55e] disabled:opacity-50"
          >
            ↓ Download PDF
          </button>
        </div>

        <div className="rounded-xl border border-border bg-surface p-6 transition-colors hover:border-gold">
          <div className="mb-3 text-3xl">🗃️</div>
          <div className="font-display text-sm font-bold text-white mb-1">
            FAQ Database (JSON)
          </div>
          <div className="text-xs text-muted mb-4 leading-relaxed">
            Full export of the current FAQ knowledge base with all questions,
            answers, categories, and tags.
          </div>
          <button
            onClick={() => handleDownload("/exports/faqs", "faq_database.json")}
            disabled={isExporting}
            className="rounded-lg bg-gold px-4 py-2 text-xs font-semibold text-black transition-colors hover:bg-[#d4b55e] disabled:opacity-50"
          >
            ↓ Download JSON
          </button>
        </div>

        {/* FIXED: Now points to the dedicated /analytics endpoint */}
        <div className="rounded-xl border border-border bg-surface p-6 transition-colors hover:border-gold">
          <div className="mb-3 text-3xl">📉</div>
          <div className="font-display text-sm font-bold text-white mb-1">
            Analytics Summary (CSV)
          </div>
          <div className="text-xs text-muted mb-4 leading-relaxed">
            Aggregated analytics data including daily query counts, category
            breakdown, and answer rates.
          </div>
          <button
            onClick={() =>
              handleDownload("/exports/analytics", "analytics_summary.csv")
            }
            disabled={isExporting}
            className="rounded-lg bg-gold px-4 py-2 text-xs font-semibold text-black transition-colors hover:bg-[#d4b55e] disabled:opacity-50"
          >
            ↓ Download CSV
          </button>
        </div>

        <div className="rounded-xl border border-border bg-surface p-6 opacity-70">
          <div className="mb-3 text-3xl opacity-60">🧪</div>
          <div className="font-display text-sm font-bold text-white mb-1">
            Test Suite Results (JSON)
          </div>
          <div className="text-xs text-muted mb-4 leading-relaxed">
            Raw test suite output including per-query scores, pass/fail status,
            and aggregate metrics.
          </div>
          <button className="rounded-lg border border-border bg-surface2 px-4 py-2 text-xs font-semibold text-muted">
            Coming Soon
          </button>
        </div>

        <div className="rounded-xl border border-border bg-surface p-6 opacity-70">
          <div className="mb-3 text-3xl opacity-60">📦</div>
          <div className="font-display text-sm font-bold text-white mb-1">
            Full System Backup (ZIP)
          </div>
          <div className="text-xs text-muted mb-4 leading-relaxed">
            Complete backup package: FAQ database, query logs, test results, and
            config files.
          </div>
          <button className="rounded-lg border border-border bg-surface2 px-4 py-2 text-xs font-semibold text-muted">
            Coming Soon
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <div className="font-display text-[13px] font-bold text-white">
              Export History
            </div>
            <div className="mt-[1px] text-[11px] text-muted">
              Recent downloads
            </div>
          </div>
          <button className="text-xs font-medium text-gold hover:text-white transition-colors">
            Clear History
          </button>
        </div>

        <div className="divide-y divide-border/50">
          {loadingHistory ? (
            <div className="px-5 py-6 text-center text-xs text-muted">
              Loading history...
            </div>
          ) : historyLogs.length === 0 ? (
            <div className="px-5 py-6 text-center text-xs text-muted">
              No recent exports found.
            </div>
          ) : (
            historyLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center gap-4 px-5 py-3 transition-colors hover:bg-white/5"
              >
                <span className="text-base">
                  {log.file_type === "CSV"
                    ? "📋"
                    : log.file_type === "PDF"
                      ? "📊"
                      : "🗃️"}
                </span>
                <span className="flex-1 text-[12.5px] text-text">
                  {log.filename}
                </span>
                <span className="font-mono text-[11px] text-muted">
                  {new Date(log.created_at).toLocaleString([], {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </span>
                <span className="w-16 text-right text-[11px] text-muted">
                  {log.file_size}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <div
        className={`fixed bottom-6 right-6 z-50 rounded-xl border px-5 py-3.5 shadow-2xl transition-all duration-300 ease-in-out ${toast.show ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0 pointer-events-none"} ${toast.isError ? "border-red-500/20 bg-surface" : "border-green-500/20 bg-surface"}`}
      >
        <span
          className={`text-[13px] font-medium ${toast.isError ? "text-red-400" : "text-green-400"}`}
        >
          {toast.isError ? "⚠️" : "✅"} {toast.message}
        </span>
      </div>
    </div>
  );
}
