import { Link } from "react-router-dom";

export default function StudentComingSoon() {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
        <div className="w-20 h-20 rounded-full bg-gold-pale flex items-center justify-center text-3xl mb-8 relative">
          <div className="absolute inset-0 rounded-full bg-gold opacity-20 animate-ping"></div>
          🚀
        </div>

        <p className="flex items-center gap-2 text-[10px] font-bold tracking-[3px] uppercase text-gold mb-4">
          <span className="block w-5 h-[2px] bg-gold rounded-full"></span>
          In Progress
        </p>

        <h1 className="font-playfair text-[clamp(28px,4vw,36px)] font-bold text-navy leading-[1.2] mb-4">
          Something exciting is coming
        </h1>

        <p className="text-[14px] text-slate leading-[1.8] max-w-[420px] mb-10">
          We are currently putting the finishing touches on this section of the
          UI Career Advisor. Check back soon to explore new features.
        </p>

        <Link
          to="/"
          className="bg-navy text-white text-[13.5px] font-semibold px-8 py-3.5 rounded-full shadow-[0_4px_18px_rgba(13,33,73,0.15)] hover:bg-navy-mid hover:-translate-y-0.5 transition-all"
        >
          Return Home
        </Link>
      </div>
    </>
  );
}
