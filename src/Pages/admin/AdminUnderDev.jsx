import { Link } from "react-router-dom";

export default function AdminUnderDev() {
  return (
    <div className="flex h-[80vh] flex-col items-center justify-center text-center">
      <div className="relative mb-8 flex h-24 w-24 items-center justify-center rounded-2xl bg-surface border border-border shadow-2xl">
        <div className="absolute inset-0 rounded-2xl border border-gold/20 animate-ping opacity-20"></div>
        <span
          className="text-4xl animate-spin"
          style={{ animationDuration: "4s" }}
        >
          ⚙️
        </span>
      </div>

      <h1 className="font-display text-2xl font-bold text-white mb-3">
        Page Under Development
      </h1>

      <p className="text-[13.5px] text-muted max-w-[340px] leading-relaxed mb-8">
        We are currently building this feature. The engineering team is working
        hard to bring it to you soon.
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => window.history.back()}
          className="rounded-lg border border-border bg-surface2 px-5 py-2.5 text-[13px] font-medium text-muted transition-colors hover:bg-dim hover:text-text"
        >
          Go Back
        </button>
        <Link
          to="/dashboard"
          className="rounded-lg bg-gold px-5 py-2.5 text-[13px] font-bold text-black transition-all hover:bg-[#d4b55e] hover:-translate-y-0.5"
        >
          Return to Overview
        </Link>
      </div>
    </div>
  );
}
