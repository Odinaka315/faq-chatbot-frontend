// src/components/Topbar.jsx
export default function Topbar() {
  const today = new Date();

  const formattedDate = [
    today.toLocaleDateString("en-GB", { weekday: "short" }),
    today.toLocaleDateString("en-GB", { day: "2-digit" }),
    today.toLocaleDateString("en-GB", { month: "short" }),
    today.getFullYear(),
  ].join(" ");
  return (
    <div className="sticky top-0 z-10 flex items-center h-[60px] px-7 gap-4 border-b shrink-0 bg-surface border-border">
      {/* Page Title */}
      <div>
        <span className="text-base font-bold text-white font-display">
          Overview
        </span>
        <span className="ml-1 text-xs text-muted">/ Dashboard</span>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-3 ml-auto">
        <div className="flex items-center gap-2 px-3.5 py-1.5 border rounded-lg bg-surface2 border-border">
          <span className="text-[13px] text-muted">🔍</span>
          <input
            type="text"
            placeholder="Search queries, FAQs…"
            className="w-[180px] text-[13px] text-text bg-transparent border-none outline-none placeholder:text-muted"
          />
        </div>

        <div className="relative flex items-center justify-center w-[34px] h-[34px] text-[15px] transition-all duration-200 border rounded-lg cursor-pointer bg-surface2 border-border text-muted hover:bg-dim hover:text-text">
          🔔
          <span className="absolute top-[6px] right-[6px] w-[7px] h-[7px] bg-red-500 border-[1.5px] border-surface rounded-full"></span>
        </div>

        <div className="flex items-center justify-center w-[34px] h-[34px] text-[15px] transition-all duration-200 border rounded-lg cursor-pointer bg-surface2 border-border text-muted hover:bg-dim hover:text-text">
          ⚙️
        </div>

        <div className="px-2.5 py-1 text-[11px] border rounded-md font-mono text-muted bg-surface2 border-border">
          {formattedDate}
        </div>
      </div>
    </div>
  );
}
