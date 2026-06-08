import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";

export default function TrendChart() {
  const { data: trends, isLoading } = useQuery({
    queryKey: ["dashboard-trends"],
    queryFn: async () => {
      const response = await api.get("/analytics/trends");
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="h-64 rounded-xl border border-border bg-surface p-5 animate-pulse"></div>
    );
  }

  // Fallback data if backend is empty
  const chartData =
    trends?.length > 0
      ? trends
      : Array(14).fill({ timestamp: new Date().toISOString(), query_count: 0 });

  const maxVolume = Math.max(...chartData.map((d) => d.query_count), 1);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <div className="font-display text-[13px] font-bold text-white">
            Daily Query Volume
          </div>
          <div className="mt-[1px] text-[11px] text-muted">
            Continuous Timeline
          </div>
        </div>
        <button className="rounded-md border border-gold-dim px-3 py-1 text-xs font-medium text-gold transition-colors hover:bg-gold-dim">
          Export ↗
        </button>
      </div>

      <div className="px-5 py-5">
        <div className="flex h-[160px] items-end gap-2">
          {chartData.map((day, idx) => {
            const heightPct = Math.round((day.query_count / maxVolume) * 100);
            // Format the date to just show the day number (e.g., "04")
            const dateLabel = new Date(day.timestamp).toLocaleDateString(
              "en-US",
              { day: "2-digit" },
            );

            return (
              <div
                key={idx}
                className="flex h-full flex-1 flex-col items-center justify-end gap-1.5"
              >
                <div
                  className="group relative w-full cursor-pointer rounded-t-sm border border-gold/20 bg-gold-dim transition-colors hover:bg-gold-glow min-h-[4px]"
                  style={{ height: `${heightPct}%` }}
                >
                  <div className="absolute -top-6 left-1/2 hidden -translate-x-1/2 whitespace-nowrap font-mono text-[10px] font-semibold text-gold group-hover:block">
                    {day.query_count}
                  </div>
                </div>
                <div className="font-mono text-[10px] text-muted">
                  {dateLabel}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-4 border-t border-border px-5 py-3">
        <div className="flex items-center gap-1.5 text-[11px] text-muted">
          <span className="h-2 w-2 rounded-full bg-gold"></span> Answered
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-muted">
          <span className="h-2 w-2 rounded-full bg-red-500"></span> Unanswered
        </div>
      </div>
    </div>
  );
}
