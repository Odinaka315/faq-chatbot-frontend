import { Link } from "react-router-dom";

export default function StudentFooter() {
  return (
    <footer className="bg-[#0d2149] text-white py-12 px-6 md:px-10 border-t border-gold/25">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
        {/* Column 1: Brand - Spans full 2 columns on mobile, drops to 1 on desktop */}
        <div className="col-span-2 md:col-span-1 flex flex-col gap-3">
          <h2 className="font-playfair text-[17px] font-bold tracking-wide text-white">
            UI Career Advisor
          </h2>
          <p className="text-[12.5px] text-white/60 leading-relaxed max-w-sm">
            An AI-powered advisory system for prospective University of Ibadan
            students. Built to democratise access to quality admission guidance.
          </p>
        </div>

        {/* Column 2: Advisory Links - Takes 1 column on mobile */}
        <div className="col-span-1 flex flex-col gap-3.5">
          <span className="text-[10.5px] font-bold tracking-[2px] uppercase text-gold">
            Advisory
          </span>
          <div className="flex flex-col gap-2.5 text-[13px] text-white/70">
            <Link
              to="/requirements"
              className="hover:text-gold transition-colors"
            >
              JAMB Requirements
            </Link>
            <Link to="/cut-offs" className="hover:text-gold transition-colors">
              Cut-off Marks
            </Link>
            <Link to="/pathways" className="hover:text-gold transition-colors">
              Career Pathways
            </Link>
            <Link to="/post-utme" className="hover:text-gold transition-colors">
              Post-UTME
            </Link>
          </div>
        </div>

        {/* Column 3: Faculties Links - Takes 1 column on mobile */}
        <div className="col-span-1 flex flex-col gap-3.5">
          <span className="text-[10.5px] font-bold tracking-[2px] uppercase text-gold">
            Faculties
          </span>
          <div className="flex flex-col gap-2.5 text-[13px] text-white/70">
            <Link
              to="/faculty/science"
              className="hover:text-gold transition-colors"
            >
              Faculty of Science
            </Link>
            <Link
              to="/faculty/medicine"
              className="hover:text-gold transition-colors"
            >
              Faculty of Medicine
            </Link>
            <Link
              to="/faculty/law"
              className="hover:text-gold transition-colors"
            >
              Faculty of Law
            </Link>
            <Link
              to="/faculties"
              className="hover:text-gold text-xs font-semibold transition-colors"
            >
              All Faculties →
            </Link>
          </div>
        </div>

        {/* Column 4: Contact Info - Spans full 2 columns on mobile */}
        <div className="col-span-2 md:col-span-1 flex flex-col gap-3.5 pt-6 md:pt-0 border-t border-white/5 md:border-none">
          <span className="text-[10.5px] font-bold tracking-[2px] uppercase text-gold">
            Contact
          </span>
          <div className="flex flex-col gap-2.5 text-[13px] text-white/70 font-sans">
            <a
              href="mailto:admissions@ui.edu.ng"
              className="hover:text-gold transition-colors break-all"
            >
              admissions@ui.edu.ng
            </a>
            <a
              href="tel:+23428101100"
              className="hover:text-gold transition-colors"
            >
              +234 (0)2 810 1100
            </a>
            <span className="text-white/50">UI Campus, Ibadan</span>
          </div>
        </div>
      </div>

      {/* Bottom Copyright line */}
      <div className="max-w-6xl mx-auto mt-12 pt-6 border-t border-white/5 text-center text-[11px] text-white/40 tracking-wide">
        &copy; {new Date().getFullYear()} University of Ibadan Career Advisor.
        All rights reserved.
      </div>
    </footer>
  );
}
