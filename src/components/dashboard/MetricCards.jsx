import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";

const TrendBadge = ({ value }) => {
  if (!value || value === 0) return null;

  const isPositive = value > 0;
  const colorClass = isPositive
    ? "bg-green-500/10 text-green-500"
    : "bg-red-500/10 text-red-500";
  const arrow = isPositive ? "↑" : "↓";

  return (
    <span
      className={`flex items-center gap-1 rounded-full px-2 py-1 text-[10.5px] font-semibold ${colorClass}`}
    >
      {arrow} {Math.abs(value)}%
    </span>
  );
};

export default function MetricCards() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["dashboard-metrics"],
    queryFn: async () => {
      const response = await api.get("/analytics/metrics");
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="h-32 rounded-xl border border-border bg-surface2 animate-pulse mb-6"></div>
    );
  }

  // Fallback state if no data
  const m = metrics || {};

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {/* Total Queries */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-surface p-5 transition-colors hover:border-gold">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gold"></div>
        <div className="mb-3 flex items-start justify-between">
          <span className="text-xl">💬</span>
          <TrendBadge value={m.queries_change} />
        </div>
        <div className="mb-1 font-display text-3xl font-extrabold text-white leading-none">
          {m.total_queries?.toLocaleString() || 0}
        </div>
        <div className="text-xs text-muted">Total Queries This Month</div>
      </div>

      {/* Accuracy Rate */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-surface p-5 transition-colors hover:border-green-500">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-green-500"></div>
        <div className="mb-3 flex items-start justify-between">
          <span className="text-xl">✅</span>
          <TrendBadge value={m.accuracy_change} />
        </div>
        <div className="mb-1 font-display text-3xl font-extrabold text-white leading-none">
          {m.top_1_accuracy_estimate || 0}%
        </div>
        <div className="text-xs text-muted">Top-1 Accuracy Rate</div>
      </div>

      {/* FAQ Entries */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-surface p-5 transition-colors hover:border-blue-500">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-blue-500"></div>
        <div className="mb-3 flex items-start justify-between">
          <span className="text-xl">📋</span>
          <TrendBadge value={m.faqs_change} />
        </div>
        <div className="mb-1 font-display text-3xl font-extrabold text-white leading-none">
          {m.total_faqs?.toLocaleString() || 0}
        </div>
        <div className="text-xs text-muted">FAQ Entries in Database</div>
      </div>

      {/* SUS Score */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-surface p-5 transition-colors hover:border-amber-500">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-amber-500"></div>
        <div className="mb-3 flex items-start justify-between">
          <span className="text-xl">😊</span>
          <TrendBadge value={m.sus_change} />
        </div>
        <div className="mb-1 font-display text-3xl font-extrabold text-white leading-none">
          {m.mean_sus_score || 0}
        </div>
        <div className="text-xs text-muted">Mean SUS Score</div>
      </div>
    </div>
  );
}
