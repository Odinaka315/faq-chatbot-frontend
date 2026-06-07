import { useLocation, Link } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  // Helper function to check if a path is currently active
  const isActive = (path) => location.pathname === path;

  // Reusable NavItem component to keep the code clean
  const NavItem = ({ to, icon, label, badge, badgeColor = "red" }) => {
    const active = isActive(to);

    return (
      <Link
        to={to}
        className={`group relative flex items-center justify-between rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors ${
          active
            ? "bg-surface2 text-gold"
            : "text-muted hover:bg-white/5 hover:text-text"
        }`}
      >
        {/* Active Left Border */}
        {active && (
          <div className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-md bg-gold"></div>
        )}

        <div className="flex items-center gap-3">
          <span
            className={`text-base ${active ? "opacity-100" : "opacity-70 group-hover:opacity-100 transition-opacity"}`}
          >
            {icon}
          </span>
          <span>{label}</span>
        </div>

        {/* Dynamic Badge */}
        {badge && (
          <span
            className={`flex h-5 items-center justify-center rounded-full px-2 text-[10px] font-bold shadow-sm ${
              badgeColor === "red"
                ? "bg-red-500 text-white"
                : "bg-gold/10 text-gold"
            }`}
          >
            {badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <aside className="fixed inset-y-0 left-0 w-[240px] flex flex-col border-r border-border bg-surface z-50">
      {/* Top Logo Section */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-border/50">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold text-lg shadow-lg">
          🎓
        </div>
        <div>
          <div className="font-display text-[15px] font-bold text-white leading-tight">
            UI Advisor
          </div>
          <div className="text-[11px] text-muted mt-0.5">Admin Dashboard</div>
        </div>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-6 no-scrollbar">
        {/* MAIN GROUP */}
        <div>
          <div className="mb-2 px-2 text-[10px] font-bold tracking-[0.15em] text-muted uppercase">
            Main
          </div>
          <div className="space-y-1">
            <NavItem to="/dashboard" icon="📊" label="Overview" />
            <NavItem
              to="/dashboard/logs"
              icon="💬"
              label="Query Logs"
              badge="12"
              badgeColor="red"
            />
            <NavItem to="/dashboard/analytics" icon="🔍" label="Analytics" />
          </div>
        </div>

        {/* KNOWLEDGE BASE GROUP */}
        <div>
          <div className="mb-2 px-2 text-[10px] font-bold tracking-[0.15em] text-muted uppercase">
            Knowledge Base
          </div>
          <div className="space-y-1">
            <NavItem to="/dashboard/faqs" icon="📋" label="FAQ Manager" />
            <NavItem to="/dashboard/add-faq" icon="➕" label="Add FAQ Entry" />
            <NavItem
              to="/dashboard/categories"
              icon="🏷️"
              label="Categories"
              badge="20"
              badgeColor="gold"
            />
          </div>
        </div>

        {/* EVALUATION GROUP */}
        <div>
          <div className="mb-2 px-2 text-[10px] font-bold tracking-[0.15em] text-muted uppercase">
            Evaluation
          </div>
          <div className="space-y-1">
            <NavItem
              to="/dashboard/accuracy"
              icon="📈"
              label="Accuracy Report"
            />
            <NavItem
              to="/dashboard/test-suite"
              icon="🧪"
              label="Run Test Suite"
            />
            <NavItem to="/dashboard/export" icon="📥" label="Export Logs" />
          </div>
        </div>

        {/* SYSTEM GROUP */}
        <div>
          <div className="mb-2 px-2 text-[10px] font-bold tracking-[0.15em] text-muted uppercase">
            System
          </div>
          <div className="space-y-1">
            <NavItem to="/dashboard/settings" icon="⚙️" label="Settings" />
            <NavItem to="/" icon="🌐" label="View Live Site" />
          </div>
        </div>
      </nav>

      {/* Bottom User Profile Section */}
      <div className="border-t border-border p-4 bg-surface">
        <div className="flex cursor-pointer items-center justify-between rounded-xl p-2 transition-colors hover:bg-white/5 group">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface2 border border-border text-xs">
              👤
            </div>
            <div className="text-left">
              <div className="text-[12px] font-semibold text-white">
                Admin User
              </div>
              <div className="text-[10px] text-muted">Admission Unit</div>
            </div>
          </div>
          <span className="text-muted text-xs transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            ↗
          </span>
        </div>
      </div>
    </aside>
  );
}
