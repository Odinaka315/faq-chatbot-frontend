import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import api from "../../services/api";

// ⚠️ PASTE YOUR GOOGLE FORM LINK HERE
const FEEDBACK_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSf2LqWpof_Re26fWh6AZ7llOWBOUHqmHyOnnPGOINCHGLMYlQ/viewform?usp=publish-editor";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [stats, setStats] = useState({
    count: 0,
    scoreTotal: 0,
    unanswered: 0,
  });

  // Mobile Responsiveness States
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);

  // Dynamic Session Tracking
  const [activeSessionId, setActiveSessionId] = useState("");
  const [recentSessions, setRecentSessions] = useState([]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Secure UUID fallback generator
  const generateUniqueId = () => {
    return window.crypto && crypto.randomUUID
      ? crypto.randomUUID()
      : `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  };

  // Fetch conversational history from the FastAPI backend logs
  const loadSessionHistory = async (sessionId) => {
    setActiveSessionId(sessionId);
    setIsTyping(true);
    setMessages([]);

    try {
      const res = await api.get(`/chat/history/${sessionId}`);
      const historyLogs = res.data.messages || [];

      if (historyLogs.length > 0) {
        // Map backend schemas to frontend layout nodes
        const mappedMessages = historyLogs.map((msg, index) => ({
          id: `hist_${index}_${Date.now()}`,
          type: msg.sender, // expects 'user' or 'bot'
          text: msg.text,
          meta: msg.meta || { score: 1.0, followups: [] },
        }));
        setMessages(mappedMessages);

        // Recalculate stats for the loaded session
        const botMsgs = mappedMessages.filter((m) => m.type === "bot");
        const unansweredCount = botMsgs.filter(
          (m) => (m.meta?.score || 0) < 0.3,
        ).length;
        const totalScore = botMsgs.reduce(
          (acc, curr) => acc + (curr.meta?.score || 0),
          0,
        );

        setStats({
          count: botMsgs.length,
          scoreTotal: totalScore,
          unanswered: unansweredCount,
        });
      }
    } catch (err) {
      console.error("Error retrieving historical session track logs:", err);
    } finally {
      setIsTyping(false);
    }
  };

  // Load recent sessions from localStorage on component mount
  useEffect(() => {
    const savedSessions =
      JSON.parse(localStorage.getItem("ui_recent_chats")) || [];
    setRecentSessions(savedSessions);

    if (savedSessions.length > 0) {
      // Automatically restore the latest active chat session
      loadSessionHistory(savedSessions[0].id);
    } else {
      // Fresh visitor initialization
      const freshId = generateUniqueId();
      setActiveSessionId(freshId);
    }
  }, []);

  // Update FIFO Bounded Queue tracking array
  const updateSessionQueue = (sessionId, queryText) => {
    let currentQueue =
      JSON.parse(localStorage.getItem("ui_recent_chats")) || [];

    // Check if this session is already in the queue
    const existingSession = currentQueue.find(
      (session) => session.id === sessionId,
    );

    // Eliminate duplication to cleanly bubble the active chat card to the top
    currentQueue = currentQueue.filter((session) => session.id !== sessionId);

    // If it exists, KEEP the original preview. If it's new, make a new preview.
    const previewText = existingSession
      ? existingSession.preview
      : queryText.length > 24
        ? queryText.substring(0, 22) + "..."
        : queryText;

    // Insert the session details at position zero (the very top)
    currentQueue.unshift({
      id: sessionId,
      preview: previewText,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });

    // Enforce the strict upper ceiling rule of 6 rows max (FIFO eviction step)
    if (currentQueue.length > 6) {
      currentQueue.pop();
    }

    localStorage.setItem("ui_recent_chats", JSON.stringify(currentQueue));
    setRecentSessions(currentQueue);
  };

  // Chat Mutation
  const chatMutation = useMutation({
    mutationFn: async (queryText) => {
      const res = await api.post("/chat", {
        message: queryText,
        session_id: activeSessionId,
      });
      return { data: res.data, queryText };
    },
    onSuccess: ({ data, queryText }) => {
      setIsTyping(false);

      setMessages((prev) => {
        const botCount = prev.filter((m) => m.type === "bot").length;

        const newMessages = [
          ...prev,
          {
            id: Date.now(),
            type: "bot",
            text: data.message,
            meta: { score: data.confidence_score, followups: data.followups },
          },
        ];

        // 🌟 THE TRIGGER: Exactly at the 5th exchange, push the feedback request
        if (botCount === 4) {
          newMessages.push({
            id: Date.now() + 1,
            type: "bot",
            text: `I hope I've been helpful! Since this is a research project, I'd greatly appreciate it if you could take 2 minutes to evaluate my usability here:<br/><br/><a href="${FEEDBACK_FORM_URL}" target="_blank" style="display: inline-block; background-color: #f1e5ac; color: #0d2149; padding: 8px 16px; border-radius: 8px; font-weight: bold; text-decoration: none; border: 1px solid #d4af37;">📝 Provide Feedback</a>`,
            meta: null, // Set to null so the confidence UI doesn't render for this specific message
          });
        }

        return newMessages;
      });

      // Update Stats
      setStats((prev) => ({
        count: prev.count + 1,
        scoreTotal: prev.scoreTotal + data.confidence_score,
        unanswered: prev.unanswered + (data.confidence_score < 0.3 ? 1 : 0),
      }));
    },
    onError: () => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "bot",
          text: "Sorry, I am having trouble connecting to the server. Please try again later.",
          meta: { score: 0 },
        },
      ]);
    },
  });

  const handleSend = (text) => {
    const query = text || input.trim();
    if (!query) return;

    // Trigger the queue update on EVERY message sent.
    updateSessionQueue(activeSessionId, query);

    // Add user message
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), type: "user", text: query },
    ]);
    setInput("");
    setIsTyping(true);

    if (inputRef.current) inputRef.current.style.height = "auto";

    // Call API
    chatMutation.mutate(query);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const autoResize = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  const startNewChat = () => {
    const freshId = generateUniqueId();
    setActiveSessionId(freshId);
    setMessages([]);
    setStats({ count: 0, scoreTotal: 0, unanswered: 0 });
    if (window.innerWidth < 1024) setIsLeftSidebarOpen(false);
  };

  const handleTopicClick = (topicText) => {
    setInput(`Tell me about ${topicText} `);
    if (inputRef.current) {
      inputRef.current.focus();
    }
    if (window.innerWidth < 1024) {
      setIsLeftSidebarOpen(false);
    }
  };

  const handleSessionCardClick = (sessionId) => {
    loadSessionHistory(sessionId);
    if (window.innerWidth < 1024) {
      setIsLeftSidebarOpen(false); // Close sidebar on mobile select
    }
  };

  const avgConf =
    stats.count > 0 ? Math.round((stats.scoreTotal / stats.count) * 100) : 0;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-cream font-dm">
      {/* ── TOPBAR ── */}
      <div className="h-[60px] bg-[#0d2149f7] backdrop-blur-md border-b border-gold/20 flex items-center px-4 md:px-6 shrink-0 z-50">
        <button
          onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
          className="lg:hidden mr-4 text-white p-1 hover:bg-white/10 rounded"
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
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>

        <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-sm shrink-0 mr-3">
          🎓
        </div>
        <div className="font-playfair text-[14px] font-semibold text-white leading-[1.2]">
          UI Career Advisor
          <span className="block text-[9.5px] font-normal text-white/45 tracking-[1.5px] uppercase mt-[1px] font-dm">
            University of Ibadan
          </span>
        </div>

        <div className="hidden md:flex flex-1 items-center justify-center gap-1.5 mx-4">
          <Link
            to="/"
            className="text-white/55 text-[12.5px] font-medium px-3 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition-colors"
          >
            Home
          </Link>
          <a
            href="/pagecomingsoon"
            className="text-white/55 text-[12.5px] font-medium px-3 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition-colors"
          >
            Programmes
          </a>
          <a
            href="/pagecomingsoon"
            className="text-white/55 text-[12.5px] font-medium px-3 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition-colors"
          >
            Contact
          </a>
        </div>

        <div className="ml-auto flex items-center gap-3">
          {/* 🌟 PERSISTENT FEEDBACK BUTTON */}
          <a
            href={FEEDBACK_FORM_URL}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-1.5 bg-gold/20 text-gold border border-gold/30 px-3 py-1.5 rounded-full text-[11.5px] font-semibold hover:bg-gold hover:text-navy transition-colors mr-2"
          >
            📝 Evaluate Advisor
          </a>

          <div className="hidden sm:flex items-center gap-1.5 text-[11.5px] text-white/60">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_6px_#22c55e] animate-pulse"></span>
            Advisor Online
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {isLeftSidebarOpen && (
          <div
            className="fixed inset-0 bg-navy/50 z-30 lg:hidden backdrop-blur-sm"
            onClick={() => setIsLeftSidebarOpen(false)}
          ></div>
        )}

        {/* ── LEFT SIDEBAR ── */}
        <div
          className={`fixed inset-y-0 left-0 pt-[60px] lg:pt-0 z-40 w-[280px] bg-white border-r border-mist flex flex-col shrink-0 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isLeftSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="p-4 border-b border-mist">
            <div className="text-[11px] font-bold tracking-[2px] uppercase text-slate-500 mb-3">
              Advisory Sessions
            </div>
            <button
              onClick={startNewChat}
              className="w-full py-2.5 rounded-lg bg-navy text-white text-[13px] font-semibold hover:bg-[#162d5e] transition-colors flex items-center justify-center gap-2"
            >
              ✏️ New Conversation
            </button>
          </div>

          <div className="p-4 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-6">
            <div>
              <div className="text-[10px] font-bold tracking-[1.5px] uppercase text-slate-400 mb-2 px-1">
                Browse by Topic
              </div>
              {[
                { icon: "📊", text: "Cut-Off Marks", count: 312 },
                { icon: "📝", text: "JAMB Subjects", count: 194 },
                { icon: "🗺️", text: "How to Apply", count: 248 },
                { icon: "💼", text: "Career Pathways", count: 172 },
                { icon: "📋", text: "Post-UTME", count: 143 },
                { icon: "🎓", text: "Direct Entry", count: 118 },
                { icon: "📚", text: "O'Level Reqs", count: 97 },
                { icon: "🏠", text: "Fees & Housing", count: 52 },
              ].map((topic, i) => (
                <button
                  key={i}
                  onClick={() => handleTopicClick(topic.text)}
                  className="w-full flex items-center justify-between p-2 rounded-lg text-[12.5px] text-slate-600 hover:bg-gold-pale hover:text-navy transition-colors mb-0.5 group text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 text-center text-[14px]">
                      {topic.icon}
                    </span>
                    <span className="font-medium group-hover:font-semibold">
                      {topic.text}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 group-hover:text-navy/50 transition-colors">
                    {topic.count}
                  </span>
                </button>
              ))}
            </div>

            {recentSessions.length > 0 && (
              <div className="animate-in fade-in duration-300">
                <div className="text-[10px] font-bold tracking-[1.5px] uppercase text-slate-400 mb-2.5 px-1 border-t border-mist/50 pt-4">
                  Recent History
                </div>
                <div className="space-y-1.5">
                  {recentSessions.map((session) => (
                    <button
                      key={session.id}
                      onClick={() => handleSessionCardClick(session.id)}
                      className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between group ${
                        activeSessionId === session.id
                          ? "bg-gold-pale/60 border-gold/30 shadow-sm"
                          : "bg-white border-mist/50 hover:bg-slate-50 hover:border-slate-300"
                      }`}
                    >
                      <div className="min-w-0 flex-1 pr-2">
                        <div
                          className={`text-[12.5px] truncate transition-colors ${activeSessionId === session.id ? "font-semibold text-navy" : "text-slate-600 group-hover:text-navy"}`}
                        >
                          💬 {session.preview}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 ml-5">
                          {session.timestamp}
                        </div>
                      </div>
                      <span className="text-slate-300 group-hover:text-slate-400 transition-colors text-xs shrink-0 font-mono">
                        →
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-3.5 border-t border-mist bg-slate-50/50">
            <Link
              to="https://jamb.gov.ng"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 p-2 rounded-lg text-slate-500 text-[12.5px] hover:bg-cream hover:text-navy transition-colors"
            >
              <span>🌐</span> UI students' portal
            </Link>
          </div>
        </div>

        {/* ── CHAT AREA ── */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#f6f8fc]">
          <div className="bg-white border-b border-mist px-4 lg:px-6 py-3 flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center text-lg shrink-0 shadow-[0_0_0_3px_rgba(13,33,73,0.08)]">
              🤖
            </div>
            <div>
              <h3 className="text-[14px] font-semibold text-navy">
                UI Admission Advisor
              </h3>
              <p className="text-[11.5px] text-slate-500 mt-[1px]">
                Career & Admission Guidance
              </p>
            </div>
            <div className="ml-auto">
              <button
                onClick={startNewChat}
                className="w-8 h-8 rounded-lg bg-cream border border-mist flex items-center justify-center text-sm text-slate-500 hover:bg-mist hover:text-navy transition-colors"
              >
                🗑️
              </button>
            </div>
          </div>

          <div className="h-[2px] bg-mist shrink-0 w-full">
            <div
              className="h-full bg-gradient-to-r from-gold to-green-500 transition-all duration-500"
              style={{ width: `${avgConf}%` }}
            ></div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 lg:p-6 flex flex-col gap-5 custom-scrollbar">
            {messages.length === 0 && (
              <div className="bg-white border-[1.5px] border-mist rounded-[20px] p-6 lg:p-8 max-w-[540px] w-full self-center my-auto shadow-[0_4px_20px_rgba(13,33,73,0.06)] text-center animate-in slide-in-from-bottom-4 fade-in duration-500">
                <div className="text-[44px] mb-3">🎓</div>
                <h2 className="font-playfair text-[22px] font-bold text-navy mb-2">
                  Hello! I'm your UI Admission Advisor
                </h2>
                <p className="text-[13.5px] text-slate-500 leading-[1.7] mb-6">
                  I can instantly answer your questions about{" "}
                  <strong>University of Ibadan</strong> programmes, JAMB scores,
                  cut-off marks, O'Level requirements, and the admission
                  process.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {[
                    "What's the cut-off for Medicine? 🩺",
                    "JAMB subjects for Computer Science 💻",
                    "How do I apply to UI? 📝",
                  ].map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() =>
                        handleSend(suggestion.replace(/[🩺💻📝]/g, "").trim())
                      }
                      className="text-[12px] px-3.5 py-1.5 rounded-full bg-cream border-[1.5px] border-mist text-navy font-medium hover:bg-navy hover:text-white hover:border-navy transition-all"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 max-w-[85%] lg:max-w-[75%] animate-in slide-in-from-bottom-2 fade-in duration-300 ${m.type === "bot" ? "self-start" : "self-end flex-row-reverse"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-sm ${m.type === "bot" ? "bg-navy text-white" : "bg-gold text-navy font-bold text-xs"}`}
                >
                  {m.type === "bot" ? "🤖" : "Y"}
                </div>
                <div
                  className={`flex flex-col gap-1 ${m.type === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`px-4 py-2.5 text-[13.5px] leading-[1.6] ${m.type === "bot" ? "bg-white text-navy border border-mist shadow-sm rounded-[4px_18px_18px_18px]" : "bg-navy text-white rounded-[18px_4px_18px_18px]"}`}
                    dangerouslySetInnerHTML={{ __html: m.text }}
                  ></div>

                  {/* 🌟 ADDED m.meta CHECK HERE so the special feedback message doesn't crash */}
                  {m.type === "bot" && m.meta && (
                    <>
                      <div className="flex items-center gap-1.5 text-[10.5px] text-slate-400 mt-0.5">
                        <span
                          className={`px-2 py-[1px] rounded-full font-mono font-semibold ${m.meta?.score >= 0.65 ? "bg-green-500/10 text-green-600" : m.meta?.score >= 0.35 ? "bg-amber-500/10 text-amber-600" : "bg-red-500/10 text-red-500"}`}
                        >
                          {m.meta?.score >= 0.65
                            ? "✓ High confidence"
                            : m.meta?.score >= 0.35
                              ? "⚠ Medium confidence"
                              : "⚠ Low confidence"}{" "}
                          {Math.round((m.meta?.score || 0) * 100)}%
                        </span>
                        {new Date().toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>

                      {m.meta?.followups && m.meta.followups.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {m.meta.followups.map((fu, i) => (
                            <button
                              key={i}
                              onClick={() => handleSend(fu)}
                              className="text-[11.5px] px-3 py-1 rounded-full bg-cream border border-mist text-slate-600 hover:bg-navy hover:text-white transition-colors"
                            >
                              {fu}
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                  {m.type === "user" && (
                    <div className="text-[10px] text-slate-400">
                      {new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5 max-w-[75%] self-start animate-in fade-in">
                <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center bg-navy text-white text-sm">
                  🤖
                </div>
                <div className="px-4 py-3.5 bg-white border border-mist shadow-sm rounded-[4px_18px_18px_18px]">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"></span>
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></span>
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="bg-white border-t border-mist p-3 lg:p-4 shrink-0">
            <div className="flex gap-2 items-end bg-cream border-[1.5px] border-mist rounded-[16px] p-2 focus-within:border-navy focus-within:shadow-[0_0_0_3px_rgba(13,33,73,0.06)] transition-all">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onInput={autoResize}
                placeholder="Ask about UI programmes, JAMB requirements, cut-off marks…"
                className="flex-1 bg-transparent border-none outline-none text-[14px] text-navy resize-none min-h-[24px] max-h-[120px] py-1 px-2 custom-scrollbar"
                rows="1"
              ></textarea>
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
                className="w-9 h-9 rounded-xl bg-navy text-white flex items-center justify-center shrink-0 hover:bg-[#162d5e] disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
              >
                ➤
              </button>
            </div>
            <div className="text-center text-[10.5px] text-slate-400 mt-2">
              Press{" "}
              <kbd className="bg-mist px-1.5 py-0.5 rounded text-[9px]">
                Enter
              </kbd>{" "}
              to send,{" "}
              <kbd className="bg-mist px-1.5 py-0.5 rounded text-[9px]">
                Shift+Enter
              </kbd>{" "}
              for new line
            </div>
          </div>
        </div>

        {/* ── RIGHT INFO PANEL ── */}
        <div className="hidden xl:flex w-[260px] bg-white border-l border-mist flex-col shrink-0 overflow-y-auto custom-scrollbar">
          <div className="p-4 border-b border-mist text-[11px] font-bold tracking-[2px] uppercase text-slate-500">
            Session Info
          </div>

          <div className="p-4 border-b border-mist">
            <div className="text-[10px] font-bold tracking-[1.5px] uppercase text-slate-400 mb-3">
              This Session
            </div>
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-[12px] text-slate-500">
                Questions Asked
              </span>
              <span className="text-[12px] font-semibold text-navy font-mono">
                {stats.count}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-[12px] text-slate-500">Avg Confidence</span>
              <span className="text-[12px] font-semibold text-navy font-mono">
                {stats.count === 0 ? "—" : `${avgConf}%`}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[12px] text-slate-500">Unanswered</span>
              <span className="text-[12px] font-semibold text-navy font-mono">
                {stats.unanswered}
              </span>
            </div>
          </div>

          <div className="p-4 border-b border-mist">
            <div className="text-[10px] font-bold tracking-[1.5px] uppercase text-slate-400 mb-3">
              Popular Right Now
            </div>
            <div
              onClick={() => handleSend("Tell me about Medicine & Surgery")}
              className="bg-cream border-[1.5px] border-mist rounded-xl p-3 mb-2 cursor-pointer hover:border-gold hover:bg-gold-pale transition-colors"
            >
              <div className="text-[13px] font-semibold text-navy mb-1">
                Medicine & Surgery
              </div>
              <div className="text-[11px] text-slate-500">
                Cut-off: 280+ · 6 Years
              </div>
            </div>
            <div
              onClick={() => handleSend("Tell me about Computer Science")}
              className="bg-cream border-[1.5px] border-mist rounded-xl p-3 mb-2 cursor-pointer hover:border-gold hover:bg-gold-pale transition-colors"
            >
              <div className="text-[13px] font-semibold text-navy mb-1">
                Computer Science
              </div>
              <div className="text-[11px] text-slate-500">
                Cut-off: 230+ · 4 Years
              </div>
            </div>
          </div>

          <div className="p-4 border-b border-mist">
            <div className="text-[10px] font-bold tracking-[1.5px] uppercase text-slate-400 mb-3">
              Quick Links
            </div>
            <a
              href="https://admissions.ui.edu.ng"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 p-2 rounded-lg text-[12px] text-slate-600 hover:bg-cream hover:text-navy transition-colors mb-1"
            >
              <span>🌐</span> UI Admissions Portal
            </a>
            <a
              href="https://jamb.gov.ng"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 p-2 rounded-lg text-[12px] text-slate-600 hover:bg-cream hover:text-navy transition-colors"
            >
              <span>2️⃣</span> JAMB Portal
            </a>
          </div>

          <div className="p-4 border-none">
            <div className="text-[10px] font-bold tracking-[1.5px] uppercase text-slate-400 mb-3">
              Research Evaluation
            </div>
            <p className="text-[12px] text-slate-500 leading-[1.65] mb-3.5">
              Help improve this system by evaluating your experience using our
              academic survey.
            </p>
            {/* 🌟 PERSISTENT FEEDBACK BUTTON (SIDEBAR) */}
            <a
              href={FEEDBACK_FORM_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-[10px] bg-gold-pale border border-gold text-navy text-[12.5px] font-semibold hover:bg-gold hover:text-white transition-all"
            >
              <span>📝</span> Evaluate System
            </a>
          </div>

          <div className="p-4 border-none border-t border-mist pt-6">
            <div className="text-[10px] font-bold tracking-[1.5px] uppercase text-slate-400 mb-3">
              Need More Help?
            </div>
            <p className="text-[12px] text-slate-500 leading-[1.65] mb-3.5">
              For complex questions not answered by the advisor, contact the UI
              Admission Unit directly.
            </p>
            <Link
              to="/contact"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-[10px] bg-navy text-white text-[12.5px] font-semibold hover:bg-[#162d5e] transition-all"
            >
              <span>📧</span> Contact Staff
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
