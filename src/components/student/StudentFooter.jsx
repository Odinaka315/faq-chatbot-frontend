import { Link } from "react-router-dom";

export default function StudentFooter() {
  return (
    <footer className="bg-[#060f21] px-14 pt-12 pb-7 relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-start pb-8 border-b border-white/5 gap-10">
        <div>
          <h4 className="font-playfair text-[18px] text-white mb-2">
            UI Career Advisor
          </h4>
          <p className="text-[12px] text-white/30 leading-[1.7] max-w-[240px]">
            An AI-powered advisory system for prospective University of Ibadan
            students. Built to democratise access to quality admission guidance.
          </p>
        </div>

        <div className="flex flex-wrap gap-12">
          <div>
            <h5 className="text-[11px] font-semibold tracking-[2px] uppercase text-gold mb-4">
              Advisory
            </h5>
            <div className="flex flex-col gap-2">
              <a
                href="#"
                className="text-[12.5px] text-white/45 hover:text-white/85 transition-colors"
              >
                JAMB Requirements
              </a>
              <a
                href="#"
                className="text-[12.5px] text-white/45 hover:text-white/85 transition-colors"
              >
                Cut-off Marks
              </a>
              <a
                href="#"
                className="text-[12.5px] text-white/45 hover:text-white/85 transition-colors"
              >
                Career Pathways
              </a>
              <a
                href="#"
                className="text-[12.5px] text-white/45 hover:text-white/85 transition-colors"
              >
                Post-UTME
              </a>
            </div>
          </div>
          <div>
            <h5 className="text-[11px] font-semibold tracking-[2px] uppercase text-gold mb-4">
              Faculties
            </h5>
            <div className="flex flex-col gap-2">
              <a
                href="#"
                className="text-[12.5px] text-white/45 hover:text-white/85 transition-colors"
              >
                Faculty of Science
              </a>
              <a
                href="#"
                className="text-[12.5px] text-white/45 hover:text-white/85 transition-colors"
              >
                Faculty of Medicine
              </a>
              <a
                href="#"
                className="text-[12.5px] text-white/45 hover:text-white/85 transition-colors"
              >
                Faculty of Law
              </a>
              <a
                href="#"
                className="text-[12.5px] text-white/45 hover:text-white/85 transition-colors"
              >
                All Faculties →
              </a>
            </div>
          </div>
          <div>
            <h5 className="text-[11px] font-semibold tracking-[2px] uppercase text-gold mb-4">
              Contact
            </h5>
            <div className="flex flex-col gap-2">
              <span className="text-[12.5px] text-white/45">
                admissions@ui.edu.ng
              </span>
              <span className="text-[12.5px] text-white/45">
                +234 (0)2 810 1100
              </span>
              <span className="text-[12.5px] text-white/45">
                UI Campus, Ibadan
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center pt-5 text-[11px] text-white/20">
        <span>
          © {new Date().getFullYear()} University of Ibadan — Admission Unit
          Career Advisor
        </span>
        <span>Research Prototype · Computer Science Department</span>
      </div>
    </footer>
  );
}
