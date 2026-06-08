export default function StudentHome() {
  return (
    <>
      <section className="grid grid-cols-1 lg:grid-cols-2 min-h-screen pt-16 relative overflow-hidden">
        <div className="bg-navy px-14 py-20 flex flex-col justify-center relative overflow-hidden">
          {/* Decorative gradients/circles */}
          <div className="absolute -bottom-[120px] -left-[120px] w-[420px] h-[420px] rounded-full bg-[radial-gradient(circle,rgba(201,168,76,0.18)_0%,transparent_70%)] pointer-events-none"></div>
          <div className="absolute top-[60px] -right-[60px] w-[220px] h-[220px] rounded-full border border-gold/15 pointer-events-none"></div>

          <p className="flex items-center gap-2 text-[11px] font-semibold tracking-[2px] uppercase text-gold mb-6 z-10">
            <span className="block w-7 h-[2px] bg-gold rounded-full"></span>
            Admission Advisory System
          </p>

          <h1 className="font-playfair text-[clamp(36px,4vw,52px)] font-bold text-white leading-[1.15] mb-2.5 z-10">
            Your Guide to
            <br />
            <em className="text-gold not-italic">University of Ibadan</em>
            <br />
            Begins Here
          </h1>

          <p className="text-[15px] font-light text-white/60 leading-[1.7] max-w-[380px] mb-12 z-10">
            Get instant, accurate answers on UI programmes, JAMB requirements,
            cut-off marks, and career pathways — available 24/7, completely
            free.
          </p>

          <div className="flex gap-8 mb-12 z-10">
            <div className="border-l-2 border-gold pl-3.5">
              <div className="font-playfair text-[28px] font-bold text-white leading-none">
                80+
              </div>
              <div className="text-[11px] text-white/45 mt-1 tracking-wide">
                Programmes Covered
              </div>
            </div>
            <div className="border-l-2 border-gold pl-3.5">
              <div className="font-playfair text-[28px] font-bold text-white leading-none">
                10
              </div>
              <div className="text-[11px] text-white/45 mt-1 tracking-wide">
                Faculties
              </div>
            </div>
            <div className="border-l-2 border-gold pl-3.5">
              <div className="font-playfair text-[28px] font-bold text-white leading-none">
                24/7
              </div>
              <div className="text-[11px] text-white/45 mt-1 tracking-wide">
                Always Available
              </div>
            </div>
          </div>

          <div className="flex gap-3 items-center z-10">
            <button className="bg-gold text-navy font-dm text-[14px] font-semibold px-7 py-3.5 rounded-full shadow-[0_4px_18px_rgba(201,168,76,0.35)] hover:bg-gold-lt hover:-translate-y-[2px] hover:shadow-[0_8px_28px_rgba(201,168,76,0.4)] transition-all flex items-center gap-2 cursor-pointer">
              💬 Start Advising Session
            </button>
            <a
              href="#how"
              className="text-white/70 text-[13px] font-medium flex items-center gap-1.5 hover:text-white transition-colors px-3"
            >
              Learn how it works ↓
            </a>
          </div>
        </div>

        {/* Right chat preview */}
        <div className="bg-cream flex items-center justify-center p-12 relative">
          <div className="absolute left-0 top-[12%] bottom-[12%] w-[3px] bg-gradient-to-b from-transparent via-gold to-transparent"></div>

          {/* Floating Badge */}
          <div className="absolute top-[100px] right-[52px] bg-white border border-mist rounded-xl px-4 py-2.5 flex items-center gap-2 shadow-[0_4px_20px_rgba(0,0,0,0.08)] animate-float z-20">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_6px_#22c55e] animate-pulse-dot"></div>
            <div>
              <div className="text-[12px] font-semibold text-navy">
                Advisor Online
              </div>
              <div className="text-[10px] text-slate">Responds instantly</div>
            </div>
          </div>

          {/* Chat Card */}
          <div className="w-full max-w-[440px] bg-white rounded-[24px] overflow-hidden shadow-[0_20px_60px_rgba(13,33,73,0.12),0_2px_8px_rgba(13,33,73,0.06)] border border-navy/5 animate-slide-up relative z-10">
            <div className="bg-navy px-5 py-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gold flex items-center justify-center text-base shrink-0">
                🤖
              </div>
              <div>
                <h3 className="text-[13px] font-semibold text-white">
                  UI Admission Advisor
                </h3>
                <p className="text-[11px] text-white/50 mt-0.5">
                  Career & Admission Guidance
                </p>
              </div>
              <div className="ml-auto flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ff5f57]"></span>
                <span className="w-2 h-2 rounded-full bg-[#ffbd2e]"></span>
                <span className="w-2 h-2 rounded-full bg-[#28c840]"></span>
              </div>
            </div>

            <div className="p-5 flex flex-col gap-3 bg-[#f8fafd]">
              {/* Bot Msg 1 */}
              <div
                className="flex gap-2 self-start animate-fade-msg"
                style={{ animationDelay: "0.3s" }}
              >
                <div className="w-7 h-7 rounded-full shrink-0 bg-navy flex items-center justify-center text-xs">
                  🤖
                </div>
                <div>
                  <div className="max-w-[260px] text-[13px] leading-[1.55] px-3.5 py-2.5 rounded-[4px_16px_16px_16px] bg-white text-navy border border-[#e8edf5] shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
                    👋 Hello! I'm your UI Admission Advisor.
                    <br />
                    What would you like to know about studying at the{" "}
                    <strong>University of Ibadan</strong>?
                  </div>
                  <div className="text-[10px] text-[#94a3b8] mt-1">
                    just now
                  </div>
                </div>
              </div>

              {/* User Msg */}
              <div
                className="flex gap-2 self-end flex-row-reverse animate-fade-msg"
                style={{ animationDelay: "0.7s" }}
              >
                <div>
                  <div className="max-w-[260px] text-[13px] leading-[1.55] px-3.5 py-2.5 rounded-[16px_4px_16px_16px] bg-navy text-white">
                    What's the cut-off for Medicine?
                  </div>
                  <div className="text-[10px] text-[#94a3b8] mt-1 text-right">
                    just now
                  </div>
                </div>
              </div>

              {/* Bot Msg 2 */}
              <div
                className="flex gap-2 self-start animate-fade-msg"
                style={{ animationDelay: "1.1s" }}
              >
                <div className="w-7 h-7 rounded-full shrink-0 bg-navy flex items-center justify-center text-xs">
                  🤖
                </div>
                <div>
                  <div className="max-w-[260px] text-[13px] leading-[1.55] px-3.5 py-2.5 rounded-[4px_16px_16px_16px] bg-white text-navy border border-[#e8edf5] shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
                    For <strong>Medicine & Surgery (MBBS)</strong> at UI, the
                    typical JAMB cut-off is <strong>280+</strong>. You'll also
                    need 5 O'Level credits including English, Maths, Biology,
                    Chemistry & Physics. 🩺
                  </div>
                  <div className="text-[10px] text-[#94a3b8] mt-1">
                    just now
                  </div>
                </div>
              </div>
            </div>

            <div className="px-5 py-3 flex gap-1.5 flex-wrap border-t border-[#e8edf5] bg-white">
              <span className="text-[11px] font-medium px-3 py-1.5 rounded-full bg-[#eef2fa] text-navy cursor-pointer border border-[#dde4f0] hover:bg-navy hover:text-white hover:border-navy transition-all">
                Career paths 🎯
              </span>
              <span className="text-[11px] font-medium px-3 py-1.5 rounded-full bg-[#eef2fa] text-navy cursor-pointer border border-[#dde4f0] hover:bg-navy hover:text-white hover:border-navy transition-all">
                Post-UTME 📝
              </span>
              <span className="text-[11px] font-medium px-3 py-1.5 rounded-full bg-[#eef2fa] text-navy cursor-pointer border border-[#dde4f0] hover:bg-navy hover:text-white hover:border-navy transition-all">
                Direct Entry
              </span>
            </div>

            <div className="flex gap-2 p-3 px-4 border-t border-[#e8edf5] bg-white">
              <input
                type="text"
                placeholder="Ask about any UI programme..."
                readOnly
                className="flex-1 bg-[#f4f6fa] border border-[#e2e8f0] rounded-full px-4 py-2.5 text-[13px] text-navy font-dm outline-none"
              />
              <button className="w-9 h-9 rounded-full bg-navy text-white flex items-center justify-center text-sm hover:bg-gold hover:text-navy transition-colors shrink-0 cursor-pointer">
                ➤
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES STRIP ── */}
      <section className="bg-white px-14 py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-y border-mist">
        <div className="p-8 border-r border-mist hover:bg-cream transition-colors group">
          <span className="text-[28px] block mb-4 group-hover:scale-110 transition-transform">
            ⚡
          </span>
          <h3 className="font-playfair text-[17px] font-semibold text-navy mb-2">
            Instant Answers
          </h3>
          <p className="text-[13px] text-slate leading-[1.65]">
            No more waiting 48+ hours for admission queries. Get accurate
            answers in seconds, any time of day.
          </p>
        </div>
        <div className="p-8 border-r border-mist hover:bg-cream transition-colors group">
          <span className="text-[28px] block mb-4 group-hover:scale-110 transition-transform">
            🎯
          </span>
          <h3 className="font-playfair text-[17px] font-semibold text-navy mb-2">
            Career Guidance
          </h3>
          <p className="text-[13px] text-slate leading-[1.65]">
            Explore career pathways linked to every UI programme — from Medicine
            to Computer Science.
          </p>
        </div>
        <div className="p-8 border-r border-mist hover:bg-cream transition-colors group">
          <span className="text-[28px] block mb-4 group-hover:scale-110 transition-transform">
            📋
          </span>
          <h3 className="font-playfair text-[17px] font-semibold text-navy mb-2">
            Requirements Made Clear
          </h3>
          <p className="text-[13px] text-slate leading-[1.65]">
            JAMB subjects, O'Level requirements, cut-off marks, and direct entry
            criteria — all in plain language.
          </p>
        </div>
        <div className="p-8 hover:bg-cream transition-colors group">
          <span className="text-[28px] block mb-4 group-hover:scale-110 transition-transform">
            🌍
          </span>
          <h3 className="font-playfair text-[17px] font-semibold text-navy mb-2">
            Equal Access
          </h3>
          <p className="text-[13px] text-slate leading-[1.65]">
            Quality advisory support for every prospective student — regardless
            of location or background.
          </p>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section
        id="how"
        className="px-14 py-[100px] bg-cream grid grid-cols-1 lg:grid-cols-2 gap-20 items-center"
      >
        <div>
          <p className="flex items-center gap-2 text-[10px] font-bold tracking-[3px] uppercase text-gold mb-4">
            <span className="block w-5 h-[2px] bg-gold rounded-full"></span>
            How It Works
          </p>
          <h2 className="font-playfair text-[clamp(28px,3vw,38px)] font-bold text-navy leading-[1.2] mb-4">
            Three simple steps to your perfect programme
          </h2>
          <p className="text-[14px] text-slate leading-[1.8] max-w-[400px] mb-10">
            Our retrieval-based system matches your question to our curated
            database of University of Ibadan admission knowledge — no waiting,
            no guessing.
          </p>

          <div className="flex flex-col gap-6">
            <div className="flex gap-5 p-5 px-6 bg-white rounded-2xl border border-mist hover:border-gold hover:shadow-[0_4px_20px_rgba(201,168,76,0.12)] hover:translate-x-1 transition-all">
              <div className="w-9 h-9 rounded-full shrink-0 bg-navy text-gold font-playfair text-[15px] font-bold flex items-center justify-center">
                1
              </div>
              <div>
                <h4 className="text-[14px] font-semibold text-navy mb-1">
                  Type your question
                </h4>
                <p className="text-[12.5px] text-slate leading-[1.6]">
                  Ask in plain English — about programmes, requirements, JAMB
                  scores, careers, or anything admission-related.
                </p>
              </div>
            </div>
            <div className="flex gap-5 p-5 px-6 bg-white rounded-2xl border border-mist hover:border-gold hover:shadow-[0_4px_20px_rgba(201,168,76,0.12)] hover:translate-x-1 transition-all">
              <div className="w-9 h-9 rounded-full shrink-0 bg-navy text-gold font-playfair text-[15px] font-bold flex items-center justify-center">
                2
              </div>
              <div>
                <h4 className="text-[14px] font-semibold text-navy mb-1">
                  We find the best match
                </h4>
                <p className="text-[12.5px] text-slate leading-[1.6]">
                  Your question is compared against 300+ curated UI advisory
                  answers using similarity matching technology.
                </p>
              </div>
            </div>
            <div className="flex gap-5 p-5 px-6 bg-white rounded-2xl border border-mist hover:border-gold hover:shadow-[0_4px_20px_rgba(201,168,76,0.12)] hover:translate-x-1 transition-all">
              <div className="w-9 h-9 rounded-full shrink-0 bg-navy text-gold font-playfair text-[15px] font-bold flex items-center justify-center">
                3
              </div>
              <div>
                <h4 className="text-[14px] font-semibold text-navy mb-1">
                  You get a clear answer
                </h4>
                <p className="text-[12.5px] text-slate leading-[1.6]">
                  Receive an accurate, structured response instantly — and ask
                  follow-up questions freely.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pipeline Visual */}
        <div className="bg-navy rounded-[24px] p-10 pt-10 flex flex-col relative overflow-hidden">
          <div className="absolute -top-[80px] -right-[80px] w-[280px] h-[280px] rounded-full bg-[radial-gradient(circle,rgba(201,168,76,0.15)_0%,transparent_70%)]"></div>

          <div className="font-playfair text-[13px] font-semibold text-gold-lt tracking-[1px] uppercase mb-7 relative z-10">
            Under the Hood
          </div>

          <div className="flex flex-col relative z-10">
            <div className="flex gap-3.5 items-start py-4 border-b border-white/5">
              <div className="w-[34px] h-[34px] rounded-[10px] shrink-0 bg-gold/15 flex items-center justify-center text-[15px]">
                ⌨️
              </div>
              <div>
                <h5 className="text-[12px] font-semibold text-white mb-1">
                  Student Query Received
                </h5>
                <p className="text-[11.5px] text-white/45 leading-[1.55]">
                  "What JAMB score do I need for Law?"
                </p>
              </div>
            </div>
            <div className="text-center text-gold/40 text-[12px] py-0.5">↓</div>

            <div className="flex gap-3.5 items-start py-4 border-b border-white/5">
              <div className="w-[34px] h-[34px] rounded-[10px] shrink-0 bg-gold/15 flex items-center justify-center text-[15px]">
                🔤
              </div>
              <div>
                <h5 className="text-[12px] font-semibold text-white mb-1">
                  Text Pre-Processing
                </h5>
                <p className="text-[11.5px] text-white/45 leading-[1.55]">
                  Lowercase, remove stop words, tokenise
                </p>
              </div>
            </div>
            <div className="text-center text-gold/40 text-[12px] py-0.5">↓</div>

            <div className="flex gap-3.5 items-start py-4 border-b border-white/5">
              <div className="w-[34px] h-[34px] rounded-[10px] shrink-0 bg-gold/15 flex items-center justify-center text-[15px]">
                📐
              </div>
              <div>
                <h5 className="text-[12px] font-semibold text-white mb-1">
                  TF-IDF Vectorisation
                </h5>
                <p className="text-[11.5px] text-white/45 leading-[1.55]">
                  Query converted to numerical vector
                </p>
              </div>
            </div>
            <div className="text-center text-gold/40 text-[12px] py-0.5">↓</div>

            <div className="flex gap-3.5 items-start py-4 border-b border-white/5">
              <div className="w-[34px] h-[34px] rounded-[10px] shrink-0 bg-gold/15 flex items-center justify-center text-[15px]">
                🔍
              </div>
              <div>
                <h5 className="text-[12px] font-semibold text-white mb-1">
                  Cosine Similarity Search
                </h5>
                <p className="text-[11.5px] text-white/45 leading-[1.55]">
                  Best-matching FAQ entry identified
                </p>
              </div>
            </div>
            <div className="text-center text-gold/40 text-[12px] py-0.5">↓</div>

            <div className="flex gap-3.5 items-start py-4">
              <div className="w-[34px] h-[34px] rounded-[10px] shrink-0 bg-gold/15 flex items-center justify-center text-[15px]">
                ✅
              </div>
              <div>
                <h5 className="text-[12px] font-semibold text-white mb-1">
                  Answer Returned
                </h5>
                <p className="text-[11.5px] text-white/45 leading-[1.55]">
                  Accurate advisory response delivered instantly
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="bg-white px-14 py-20">
        <p className="flex items-center gap-2 text-[10px] font-bold tracking-[3px] uppercase text-gold mb-4">
          <span className="block w-5 h-[2px] bg-gold rounded-full"></span>
          What You Can Ask
        </p>
        <h2 className="font-playfair text-[clamp(28px,3vw,38px)] font-bold text-navy leading-[1.2]">
          Covering every part of your UI journey
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
          {/* Category Cards */}
          {[
            {
              icon: "📊",
              title: "JAMB & Cut-off Marks",
              desc: "Find the exact JAMB scores required for any UI programme, across all ten faculties.",
            },
            {
              icon: "📚",
              title: "O'Level Requirements",
              desc: "Discover which WAEC and NECO subjects and grades you need for your chosen course.",
            },
            {
              icon: "🎓",
              title: "JAMB Subject Combos",
              desc: "Get the correct UTME subject combination for any of UI's 80+ degree programmes.",
            },
            {
              icon: "🗺️",
              title: "Career Pathways",
              desc: "Explore the career opportunities linked to every degree UI offers — before you choose.",
            },
            {
              icon: "📝",
              title: "Post-UTME & Screening",
              desc: "Understand the Post-UTME format, scoring, registration, and screening dates.",
            },
            {
              icon: "🏛️",
              title: "Direct Entry (DE)",
              desc: "Find out DE requirements, A'Level subjects, and how to enter UI at 200 Level.",
            },
          ].map((cat, idx) => (
            <div
              key={idx}
              className="p-7 rounded-[20px] bg-cream border-[1.5px] border-transparent cursor-pointer transition-all hover:border-gold hover:bg-white hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(201,168,76,0.12)] relative overflow-hidden group"
            >
              <div className="absolute -bottom-7 -right-7 w-[100px] h-[100px] rounded-full bg-gold-pale opacity-0 transition-opacity group-hover:opacity-100"></div>
              <span className="text-[30px] block mb-3.5 relative z-10">
                {cat.icon}
              </span>
              <h3 className="text-[15px] font-semibold text-navy mb-1.5 relative z-10">
                {cat.title}
              </h3>
              <p className="text-[12.5px] text-slate leading-[1.6] relative z-10">
                {cat.desc}
              </p>
              <div className="mt-4 text-[11px] font-semibold text-gold flex items-center gap-1 opacity-0 -translate-x-1.5 transition-all group-hover:opacity-100 group-hover:translate-x-0 relative z-10">
                Explore →
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="bg-navy px-14 py-20 relative overflow-hidden">
        <div className="absolute -top-10 left-10 font-playfair text-[300px] font-bold text-gold/5 leading-none pointer-events-none select-none">
          "
        </div>

        <p className="flex items-center gap-2 text-[10px] font-bold tracking-[3px] uppercase text-gold mb-4 relative z-10">
          <span className="block w-5 h-[2px] bg-gold rounded-full"></span>
          Student Voices
        </p>
        <h2 className="font-playfair text-[clamp(28px,3vw,38px)] font-bold text-white leading-[1.2] relative z-10">
          What prospective students say
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-12 relative z-10">
          {[
            {
              quote:
                "I got my answer about the Medicine cut-off mark in literally 5 seconds. My older sister waited two days for an email reply from the admissions office.",
              name: "Amaka O.",
              role: "SS3 Student, Lagos",
              avatar: "👩🏾",
            },
            {
              quote:
                "I didn't know which JAMB subjects to pick for Computer Science. The chatbot explained everything clearly and even told me about career options.",
              name: "Femi A.",
              role: "Prospective Student, Ibadan",
              avatar: "👦🏿",
            },
            {
              quote:
                "I'm from Kano and finding reliable information about UI was really difficult. This advisor gave me everything I needed without any stress.",
              name: "Usman B.",
              role: "Prospective Student, Kano",
              avatar: "👦🏽",
            },
          ].map((test, idx) => (
            <div
              key={idx}
              className="bg-white/5 border border-white/5 rounded-[20px] p-7 transition-all hover:bg-white/10 hover:-translate-y-1"
            >
              <div className="text-gold text-[13px] tracking-[2px] mb-3.5">
                ★★★★★
              </div>
              <p className="text-[13.5px] text-white/70 leading-[1.7] italic mb-5">
                "{test.quote}"
              </p>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-navy-soft flex items-center justify-center text-[15px]">
                  {test.avatar}
                </div>
                <div>
                  <div className="text-[12px] font-semibold text-white">
                    {test.name}
                  </div>
                  <div className="text-[11px] text-white/40 mt-0.5">
                    {test.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="bg-gold px-14 py-[72px] flex flex-col md:flex-row items-center justify-between gap-10">
        <div>
          <h2 className="font-playfair text-[clamp(26px,3vw,38px)] font-bold text-navy leading-[1.2] max-w-[480px]">
            Ready to find your perfect programme at UI?
          </h2>
          <p className="text-[14px] text-navy/65 mt-2">
            Join thousands of prospective students getting instant, reliable
            admission guidance.
          </p>
        </div>
        <button className="bg-navy text-white text-[14px] font-semibold px-8 py-3.5 rounded-full shadow-[0_4px_18px_rgba(13,33,73,0.3)] hover:bg-navy-mid hover:-translate-y-0.5 transition-all whitespace-nowrap shrink-0 cursor-pointer">
          💬 Start Your Free Session →
        </button>
      </section>
    </>
  );
}
