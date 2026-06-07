import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";

export default function RecentLogs() {
  const { data: logs = [], isLoading } = useQuery({
    queryKey: ["dashboard-recent-logs"],
    queryFn: async () => (await api.get("/analytics/recent")).data,
  });

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <div className="font-display text-[13px] font-bold text-white">
            Recent Query Log
          </div>
          <div className="mt-[1px] text-[11px] text-muted">
            Last 10 interactions — updated live
          </div>
        </div>
        <button className="rounded-md border border-gold-dim px-3 py-1 text-xs font-medium text-gold hover:bg-gold-dim">
          View full log ↗
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-surface/50">
              <th className="px-5 py-3 text-[10.5px] font-semibold tracking-wide text-muted uppercase">
                Time
              </th>
              <th className="px-5 py-3 text-[10.5px] font-semibold tracking-wide text-muted uppercase">
                Student Query
              </th>
              <th className="px-5 py-3 text-[10.5px] font-semibold tracking-wide text-muted uppercase">
                Score
              </th>
              <th className="px-5 py-3 text-[10.5px] font-semibold tracking-wide text-muted uppercase">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan="4"
                  className="px-5 py-4 text-center text-xs text-muted"
                >
                  Loading logs...
                </td>
              </tr>
            ) : (
              logs.map((log) => {
                const isHigh = log.confidence_score > 0.7;
                const isMedium = log.confidence_score > 0.4 && !isHigh;
                const scoreColor = isHigh
                  ? "bg-green-500/10 text-green-500"
                  : isMedium
                    ? "bg-amber-500/10 text-amber-500"
                    : "bg-red-500/10 text-red-500";

                return (
                  <tr
                    key={log.id}
                    className="border-b border-border/50 transition-colors hover:bg-white/5"
                  >
                    <td className="px-5 py-3 font-mono text-[11px] text-muted">
                      {new Date(log.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </td>
                    <td className="max-w-[220px] truncate px-5 py-3 font-mono text-[11.5px] text-muted">
                      "{log.user_query}"
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 font-mono text-[11px] font-bold ${scoreColor}`}
                      >
                        {log.confidence_score.toFixed(3)}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {isHigh || isMedium ? (
                        <span className="flex items-center gap-1.5 text-xs text-green-500">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>{" "}
                          Answered
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-xs text-red-500">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>{" "}
                          No Match
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
