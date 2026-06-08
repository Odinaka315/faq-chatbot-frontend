export default function AdminTopbar({ toggleSidebar }) {
  return (
    <div className="sticky top-0 z-30 flex h-[64px] w-full items-center justify-between border-b border-border bg-surface px-5 lg:px-8">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-1.5 -ml-2 text-muted hover:text-white rounded-md hover:bg-white/5 transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
      </div>

      <div className="flex items-center gap-3 lg:gap-4 ml-auto">
        <div className="hidden md:flex items-center gap-2 rounded-lg border border-border bg-surface2 px-3 py-1.5">
          <span className="text-muted text-xs">🔍</span>
          <input
            type="text"
            placeholder="Search system..."
            className="w-[160px] bg-transparent text-[13px] text-text outline-none placeholder:text-muted"
          />
        </div>

        {/* Notification Bell - Hidden on small screens */}
        <div className="hidden md:flex relative h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface2 text-muted cursor-pointer hover:bg-dim hover:text-white transition-colors">
          🔔
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-red-500"></span>
        </div>

        <div className=" sm:flex rounded-md border border-border bg-surface2 px-3 py-1.5 font-mono text-[11px] text-muted">
          {new Date()
            .toLocaleDateString("en-GB", {
              weekday: "short",
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
            .replace(/,/g, "")}
        </div>
      </div>
    </div>
  );
}
