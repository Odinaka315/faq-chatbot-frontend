import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";

export default function TopQueries() {
  const { data: topQueries, isLoading } = useQuery({
    queryKey: ["dashboard-top-queries"],
    queryFn: async () => {
      const response = await api.get("/analytics/top-queries");
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="h-64 rounded-xl border border-border bg-surface p-5 animate-pulse"></div>
    );
  }

  const queries = topQueries || [];

  const maxCount = queries[0]?.count || 1;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface flex flex-col h-full">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <div className="font-display text-[13px] font-bold text-white">
            Top Queries
          </div>
          <div className="mt-[1px] text-[11px] text-muted">
            Most asked this month
          </div>
        </div>
        <button className="text-xs font-medium text-gold transition-colors hover:text-white">
          View all
        </button>
      </div>

      <div className="py-1 flex-1 overflow-y-auto">
        {queries.length === 0 ? (
          <div className="px-5 py-4 text-xs text-muted">
            No queries recorded yet.
          </div>
        ) : (
          queries.map((q, idx) => {
            const widthPct = Math.round((q.count / maxCount) * 100);
            const isTopTwo = idx < 2;

            return (
              <div
                key={idx}
                className="flex cursor-pointer items-center gap-3 border-b border-border px-5 py-[11px] transition-colors hover:bg-white/5 last:border-none"
              >
                <div
                  className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-md font-mono text-[10px] font-bold ${isTopTwo ? "bg-gold-dim text-gold" : "bg-surface2 text-muted"}`}
                >
                  {idx + 1}
                </div>
                <div className="min-w-0 flex-1 truncate text-[12.5px] text-text">
                  {q.query_text}
                </div>
                <div className="h-[3px] w-[50px] shrink-0 overflow-hidden rounded-full bg-dim">
                  <div
                    className="h-full rounded-full bg-gold"
                    style={{ width: `${widthPct}%` }}
                  ></div>
                </div>
                <div className="shrink-0 font-mono text-[11.5px] text-muted">
                  {q.count}×
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
