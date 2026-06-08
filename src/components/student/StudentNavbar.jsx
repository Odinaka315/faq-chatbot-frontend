import { Link } from "react-router-dom";

export default function StudentNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center h-16 px-10 bg-[#0d2149f5] backdrop-blur-md border-b border-gold/25">
      <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gold text-lg shrink-0 shadow-[0_0_0_3px_rgba(201,168,76,0.25)] mr-4">
        🎓
      </div>
      <Link
        to="/"
        className="font-playfair text-[15px] font-semibold text-white tracking-wide leading-tight hover:opacity-80 transition-opacity"
      >
        UI Career Advisor
        <span className="block font-dm text-[10px] font-normal text-white/50 tracking-[1.5px] uppercase mt-0.5">
          University of Ibadan
        </span>
      </Link>
      <div className="flex items-center gap-1.5 ml-auto">
        <a
          href="#"
          className="text-white/65 text-[13px] font-medium px-3.5 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition-colors"
        >
          About
        </a>
        <a
          href="#"
          className="text-white/65 text-[13px] font-medium px-3.5 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition-colors"
        >
          Programmes
        </a>
        <a
          href="#"
          className="text-white/65 text-[13px] font-medium px-3.5 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition-colors"
        >
          Faculties
        </a>
        <a
          href="#"
          className="bg-gold text-navy font-semibold px-4.5 py-1.5 rounded-full hover:bg-gold-lt hover:-translate-y-[1px] transition-all ml-2"
        >
          Start Chatting →
        </a>
      </div>
    </nav>
  );
}
