// src/components/Sidebar.jsx
export default function Sidebar() {
  return (
    <aside className="fixed top-0 left-0 bottom-0 z-10 flex flex-col w-[240px] min-h-screen border-r bg-surface border-border shrink-0">
      {/* Logo Area */}
      <div className="p-6 pb-5 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center shrink-0 w-8 h-8 text-base rounded-lg bg-gold">
            🎓
          </div>
          <div className="font-display text-[13px] font-bold leading-tight text-white">
            UI Advisor
            <span className="block font-sans text-[10px] font-normal mt-[1px] text-muted">
              Admin Dashboard
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="px-3 pt-5 pb-2">
        <div className="px-2 mb-1.5 text-[9.5px] font-semibold tracking-[1.8px] uppercase text-muted">
          Main
        </div>

        {/* Active Item Example */}
        <a
          href="#"
          className="relative flex items-center gap-2.5 px-3 py-2 mb-0.5 text-[13px] font-medium transition-all duration-150 rounded-lg no-underline bg-gold-dim text-gold"
        >
          <div className="absolute left-0 top-[20%] bottom-[20%] w-[3px] rounded-sm bg-gold"></div>
          <span className="w-5 text-[15px] text-center">📊</span> Overview
        </a>

        <a
          href="#"
          className="flex items-center gap-2.5 px-3 py-2 mb-0.5 text-[13px] font-medium transition-all duration-150 rounded-lg no-underline text-muted hover:bg-dim hover:text-text"
        >
          <span className="w-5 text-[15px] text-center">💬</span> Query Logs
          <span className="px-1.5 py-[1px] ml-auto text-[10px] font-semibold text-white bg-red-500 rounded-full">
            12
          </span>
        </a>

        <a
          href="#"
          className="flex items-center gap-2.5 px-3 py-2 mb-0.5 text-[13px] font-medium transition-all duration-150 rounded-lg no-underline text-muted hover:bg-dim hover:text-text"
        >
          <span className="w-5 text-[15px] text-center">🔍</span> Analytics
        </a>
      </div>

      {/* Knowledge Base Navigation */}
      <div className="px-3 pt-5 pb-2">
        <div className="px-2 mb-1.5 text-[9.5px] font-semibold tracking-[1.8px] uppercase text-muted">
          Knowledge Base
        </div>
        <a
          href="#"
          className="flex items-center gap-2.5 px-3 py-2 mb-0.5 text-[13px] font-medium transition-all duration-150 rounded-lg no-underline text-muted hover:bg-dim hover:text-text"
        >
          <span className="w-5 text-[15px] text-center">📋</span> FAQ Manager
        </a>
        <a
          href="#"
          className="flex items-center gap-2.5 px-3 py-2 mb-0.5 text-[13px] font-medium transition-all duration-150 rounded-lg no-underline text-muted hover:bg-dim hover:text-text"
        >
          <span className="w-5 text-[15px] text-center">➕</span> Add FAQ Entry
        </a>
      </div>

      <div className="flex-1"></div>

      {/* User Area */}
      <div className="flex items-center gap-2.5 p-4 pb-5 border-t border-border">
        <div className="flex items-center justify-center shrink-0 w-8 h-8 text-sm border-2 rounded-full bg-surface2 border-gold-dim">
          👤
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold truncate text-text">
            Admin User
          </div>
          <div className="mt-[1px] text-[10.5px] text-muted">
            Admission Unit
          </div>
        </div>
        <div className="text-sm cursor-pointer text-muted hover:text-text transition-colors">
          ↗
        </div>
      </div>
    </aside>
  );
}
