import { Link } from "react-router-dom";

export default function Student404() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] text-center px-6">
      <div className="font-playfair text-[120px] font-bold text-mist leading-none mb-2 select-none pointer-events-none">
        404
      </div>

      <h1 className="font-playfair text-[clamp(24px,3vw,32px)] font-bold text-navy leading-[1.2] mb-4 -mt-8 relative z-10">
        Looks like you're lost
      </h1>

      <p className="text-[14px] text-slate leading-[1.8] max-w-[380px] mb-10 relative z-10">
        We couldn't find the page you were looking for. It might have been
        removed, renamed, or did not exist in the first place.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 relative z-10">
        <button
          onClick={() => window.history.back()}
          className="bg-white border border-mist text-navy text-[13.5px] font-semibold px-8 py-3.5 rounded-full hover:border-navy hover:shadow-sm transition-all"
        >
          Go Back
        </button>
        <Link
          to="/chat"
          className="bg-gold text-navy text-[13.5px] font-semibold px-8 py-3.5 rounded-full shadow-[0_4px_18px_rgba(201,168,76,0.3)] hover:bg-gold-lt hover:-translate-y-0.5 transition-all"
        >
          Talk to Advisor 💬
        </Link>
      </div>
    </div>
  );
}
