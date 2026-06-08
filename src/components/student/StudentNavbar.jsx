import { useState } from "react";
import { Link } from "react-router-dom";

export default function StudentNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0d2149f5] backdrop-blur-md border-b border-gold/25">
      <div className="flex items-center justify-between h-16 px-6 md:px-10">
        {/* Logo */}
        <div className="flex items-center">
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gold text-lg shrink-0 shadow-[0_0_0_3px_rgba(201,168,76,0.25)] mr-3 md:mr-4">
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
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1.5 ml-auto">
          <Link
            to="/"
            className="text-white/65 text-[13px] font-medium px-3.5 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition-colors"
          >
            About
          </Link>
          <Link
            to="/pagecomingsoon"
            className="text-white/65 text-[13px] font-medium px-3.5 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition-colors"
          >
            Programmes
          </Link>
          <Link
            to="/pagecomingsoon"
            className="text-white/65 text-[13px] font-medium px-3.5 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition-colors"
          >
            Faculties
          </Link>
          <Link
            to="/chat"
            className="bg-gold text-navy font-semibold px-4.5 py-1.5 rounded-full hover:bg-gold-lt hover:-translate-y-[1px] transition-all ml-2"
          >
            Start Chatting →
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white p-2 focus:outline-none"
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
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            ></path>
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-[#0d2149] border-b border-gold/25 p-5 flex flex-col gap-4 shadow-2xl animate-in slide-in-from-top-2">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="text-white/80 text-[14px] font-medium px-2 py-1 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
          >
            About
          </Link>
          <Link
            to="/pagecomingsoon"
            onClick={() => setIsOpen(false)}
            className="text-white/80 text-[14px] font-medium px-2 py-1 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
          >
            Programmes
          </Link>
          <Link
            to="/pagecomingsoon"
            onClick={() => setIsOpen(false)}
            className="text-white/80 text-[14px] font-medium px-2 py-1 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
          >
            Faculties
          </Link>
          <Link
            to="/chat"
            onClick={() => setIsOpen(false)}
            className="bg-gold text-navy font-semibold text-center mt-2 px-4 py-3 rounded-xl hover:bg-gold-lt transition-colors"
          >
            Start Chatting →
          </Link>
        </div>
      )}
    </nav>
  );
}
