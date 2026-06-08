import { Link } from "react-router-dom";

export default function Admin404() {
  return (
    <div className="flex h-[80vh] flex-col items-center justify-center text-center">
      <div className="font-display text-[80px] font-extrabold text-white/5 tracking-tighter mb-2 select-none">
        4<span className="text-gold/20">0</span>4
      </div>

      <h1 className="font-display text-xl font-bold text-white mb-3 relative z-10 -mt-10">
        Route Not Found
      </h1>

      <p className="text-[13px] text-muted max-w-[300px] leading-relaxed mb-8 relative z-10">
        The dashboard panel you are looking for doesn't exist, has been moved,
        or you lack the required permissions.
      </p>

      <Link
        to="/dashboard"
        className="relative z-10 flex items-center gap-2 rounded-lg bg-surface2 border border-border px-6 py-2.5 text-[13px] font-medium text-text transition-colors hover:border-gold/50 hover:bg-gold/10 hover:text-gold"
      >
        <span>←</span> Back to Safety
      </Link>
    </div>
  );
}
