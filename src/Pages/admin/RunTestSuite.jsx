import { useState, useRef, useEffect } from "react";
import api from "../../services/api";

// 🌟 YOUR 50 DEFAULT QUESTIONS (You can expand this list)
const DEFAULT_TEST_SET = `How can I fix a wrong JAMB subject combination before the admission process begins? | 122
What is the freshers' orientation programme like at UI? | 224
What is the '1st MB' exam in the UI College of Medicine? | 576
Can I study Political Science through the UI DLC? | 714
What JAMB subjects are required for Nursing Science at UI? | 94
Do UI DLC students attend the same convocation as regular students? | 734
Is the UCH School of Nursing the same as the UI Department of Nursing? | 546
What is the motto of the University of Ibadan? | 206
What is the Union of Campus Journalists (UCJ) at UI? | 465
What JAMB subjects are needed for Statistics at UI? | 102
What is Abadina College at the University of Ibadan? | 620
Who was Professor Olu Longe? | 467
What JAMB subjects are required for Industrial Chemistry at UI? | 347
How is Yaba Higher College related to the founding of the University of Ibadan? | 253
Can I study Adult Education through the UI DLC? | 726
How should I prepare for the UI Post-UTME screening? | 154
What is the Morohundiya Complex at UI? | 515
What happens if I miss the UI Post-UTME screening? | 157
Can UI students carry over failed courses and retake them? | 226
What is the Department of Religious Studies at UI? | 398
`;

export default function RunTestSuite() {
  const [threshold, setThreshold] = useState(0.45);
  const [testQueries, setTestQueries] = useState("");

  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);
  const [logs, setLogs] = useState([]);
  const [rawLogData, setRawLogData] = useState([]); // Used for CSV download
  const [runHistory, setRunHistory] = useState([]); // Stores previous runs

  const logEndRef = useRef(null);

  // 🌟 Fetch Previous Runs on Component Mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get("admin/test-suite/history");
        setRunHistory(res.data);
      } catch (err) {
        console.error("Failed to load run history", err);
      }
    };
    fetchHistory();
  }, []);

  const loadDefaultQuestions = () => {
    setTestQueries(DEFAULT_TEST_SET);
  };

  // 🌟 Generate and Download CSV File
  const downloadCSV = () => {
    if (rawLogData.length === 0) return;

    let csvContent = "Query,Status,Score,Is Fallback\n"; // CSV Headers
    rawLogData.forEach((row) => {
      // Wrap query in quotes to prevent commas from breaking the CSV layout
      csvContent += `"${row.query}",${row.status},${row.score},${row.is_fallback}\n`;
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `UI_Test_Log_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const startTest = async () => {
    const parsedQueries = testQueries
      .split("\n")
      .map((line) => {
        const parts = line.split("|");
        if (parts.length === 2) {
          return {
            query: parts[0].trim(),
            expected_faq_id: parseInt(parts[1].trim(), 10),
          };
        }
        return null;
      })
      .filter((q) => q !== null && !isNaN(q.expected_faq_id));

    if (parsedQueries.length === 0) {
      alert(
        "Please enter valid test queries in the format: query | expected_id",
      );
      return;
    }

    setIsRunning(true);
    setProgress(0);
    setResults(null);
    setRawLogData([]);
    setLogs([
      "# UI Career Advisor — NLP Test Suite v2.0",
      `# Run started: ${new Date().toLocaleString()}`,
      `[INFO] Target threshold: ${threshold} · top_n: 3`,
      "─────────────────────────────────",
    ]);

    let simulatedProgress = 0;
    const progressInterval = setInterval(() => {
      simulatedProgress += Math.random() * 15;
      if (simulatedProgress > 90) simulatedProgress = 90;
      setProgress(simulatedProgress);
    }, 200);

    try {
      const response = await api.post("admin/test-suite/run", {
        queries: parsedQueries,
        threshold: parseFloat(threshold),
        top_n: 3,
      });

      clearInterval(progressInterval);
      setProgress(100);

      const newLogs = response.data.logs.map((l) => l.log_string);
      setRawLogData(response.data.logs); // Save raw data for CSV

      setLogs((prev) => [
        ...prev,
        ...newLogs,
        "─────────────────────────────────",
        `[DONE] Top-1: ${response.data.metrics.top1_accuracy}% · Mean: ${response.data.metrics.mean_similarity}`,
      ]);
      setResults(response.data.metrics);

      // Refresh history panel to show the run we just completed
      const historyRes = await api.get("admin/test-suite/history");
      setRunHistory(historyRes.data);

      setTimeout(
        () => logEndRef.current?.scrollIntoView({ behavior: "smooth" }),
        100,
      );
    } catch (error) {
      clearInterval(progressInterval);
      setLogs((prev) => [...prev, "[ERROR] Failed to connect to test server."]);
    } finally {
      setIsRunning(false);
    }
  };

  const resetTest = () => {
    setProgress(0);
    setResults(null);
    setLogs([]);
    setRawLogData([]);
  };

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white/90 font-sans text-[14px] flex flex-col">
      <div className="h-[60px] bg-[#111827] border-b border-white/5 flex items-center px-7 gap-4 shrink-0 sticky top-0 z-10">
        <div>
          <span className="font-serif text-[16px] font-bold text-white tracking-wide">
            Run Test Suite
          </span>
          <span className="text-[12px] text-white/40 ml-2">
            / Evaluate retrieval performance
          </span>
        </div>
      </div>

      <div className="flex-1 p-7 pb-10 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Left Column */}
          <div>
            {/* Config Panel */}
            <div className="bg-[#111827] border border-white/5 rounded-[14px] p-6 mb-4 shadow-sm">
              <div className="font-serif text-[14px] font-bold text-white mb-1">
                NLP Test Suite Configuration
              </div>
              <div className="text-[12px] text-white/40 mb-5">
                Configure semantic evaluation parameters
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between p-3 bg-[#1a2235] rounded-lg border border-white/5">
                  <span className="text-[12.5px] text-white/90">
                    Similarity Threshold
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0.05"
                      max="0.85"
                      step="0.01"
                      value={threshold}
                      onChange={(e) => setThreshold(e.target.value)}
                      className="w-[100px] accent-[#C9A84C]"
                    />
                    <span className="font-mono text-[12px] text-white/50 w-8 text-right">
                      {threshold}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#1a2235] rounded-lg border border-white/5">
                  <span className="text-[12.5px] text-white/90">
                    Evaluate Top-N
                  </span>
                  <div className="flex gap-2">
                    <button className="text-[11px] px-3 py-1 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/15 text-[#C9A84C] font-medium transition-colors">
                      Top-1 & Top-3
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-[#1a2235] rounded-lg border border-white/5">
                  <span className="text-[12.5px] text-white/90">
                    Embedding Model
                  </span>
                  <span className="font-mono text-[12px] text-white/50">
                    all-MiniLM-L6-v2
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-[#1a2235] rounded-lg border border-white/5">
                  <span className="text-[12.5px] text-white/90">
                    Similarity Metric
                  </span>
                  <span className="font-mono text-[12px] text-white/50">
                    Cosine Distance
                  </span>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  className="bg-[#C9A84C] hover:bg-[#d4b55e] text-black font-bold text-[14px] py-2.5 px-6 rounded-lg transition-all inline-flex items-center gap-2 disabled:bg-white/10 disabled:text-white/40"
                  onClick={startTest}
                  disabled={isRunning}
                >
                  {isRunning ? "⏳ Running…" : "▶ Run Test Suite"}
                </button>
                <button
                  className="bg-[#1a2235] hover:bg-white/10 text-white/40 hover:text-white/90 border border-white/5 py-2.5 px-4 rounded-lg text-[12.5px] transition-colors"
                  onClick={resetTest}
                >
                  ↺ Reset
                </button>
              </div>
            </div>

            {/* 🌟 Previous Runs Panel */}
            <div className="bg-[#111827] border border-white/5 rounded-[14px] shadow-sm overflow-hidden">
              <div className="p-5 border-b border-white/5">
                <div className="font-serif text-[13px] font-bold text-white">
                  Previous Runs
                </div>
                <div className="text-[11px] text-white/40 mt-1">
                  Last 5 evaluations
                </div>
              </div>
              <div className="py-2">
                {runHistory.length === 0 ? (
                  <div className="px-5 py-4 text-[12px] text-white/40 italic">
                    No previous runs found.
                  </div>
                ) : (
                  runHistory.map((run) => (
                    <div
                      key={run.id}
                      className="flex items-center gap-3 px-5 py-3 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
                    >
                      <span className="font-mono text-[11px] text-white/40 w-[110px]">
                        {new Date(run.created_at).toLocaleString([], {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </span>
                      <span className="flex-1 text-[12.5px] text-white/90">
                        {run.total_queries} queries · thr {run.threshold}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full font-mono ${run.top1_accuracy >= 80 ? "bg-green-500/10 text-green-500" : run.top1_accuracy >= 50 ? "bg-amber-500/10 text-amber-500" : "bg-red-500/10 text-red-500"}`}
                      >
                        {run.top1_accuracy}%
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            {/* Output Terminal */}
            <div
              className={`bg-[#111827] border border-white/5 rounded-[14px] p-6 mb-4 shadow-sm transition-opacity duration-300 ${progress > 0 || results ? "opacity-100 block" : "opacity-0 hidden"}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="font-serif text-[14px] font-bold text-white mb-1">
                    Test Suite Output
                  </div>
                  <div className="text-[12px] text-white/40">
                    Processing semantic vectors…
                  </div>
                </div>

                {/* 🌟 Download CSV Button */}
                {results && (
                  <button
                    onClick={downloadCSV}
                    className="text-[11.5px] px-3 py-1.5 rounded-lg border border-[#C9A84C]/30 bg-[#C9A84C]/10 text-[#C9A84C] hover:bg-[#C9A84C]/20 transition-colors flex items-center gap-1.5"
                  >
                    <span>📥</span> Export CSV
                  </button>
                )}
              </div>

              <div className="h-2.5 rounded-full bg-white/10 overflow-hidden mb-4">
                <div
                  className="h-full rounded-full bg-[#C9A84C] transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              <div className="bg-[#060d18] border border-white/5 rounded-lg p-4 font-mono text-[11.5px] min-h-[140px] max-h-[220px] overflow-y-auto leading-relaxed custom-scrollbar">
                {logs.map((log, i) => {
                  let textColor = "text-white/40";
                  if (log.includes("✅")) textColor = "text-green-500";
                  if (log.includes("❌")) textColor = "text-red-500";
                  if (log.includes("⚠")) textColor = "text-amber-500";
                  if (log.includes("[INFO]")) textColor = "text-blue-400";
                  if (log.includes("[DONE]")) textColor = "text-white";
                  return (
                    <span key={i} className={`block ${textColor}`}>
                      {log}
                    </span>
                  );
                })}
                <div ref={logEndRef} />
              </div>
            </div>

            {results && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 animate-in fade-in">
                {/* ... [Metric Cards remain exactly the same as before] ... */}
                <div className="bg-[#1a2235] border border-white/5 rounded-[10px] p-3.5 text-center">
                  <div className="font-serif text-[22px] font-extrabold text-green-500">
                    {results.top1_accuracy}%
                  </div>
                  <div className="text-[10.5px] text-white/40 mt-1 uppercase tracking-wider">
                    Top-1 Acc
                  </div>
                </div>
                <div className="bg-[#1a2235] border border-white/5 rounded-[10px] p-3.5 text-center">
                  <div className="font-serif text-[22px] font-extrabold text-green-500">
                    {results.top3_accuracy}%
                  </div>
                  <div className="text-[10.5px] text-white/40 mt-1 uppercase tracking-wider">
                    Top-3 Acc
                  </div>
                </div>
                <div className="bg-[#1a2235] border border-white/5 rounded-[10px] p-3.5 text-center">
                  <div className="font-serif text-[22px] font-extrabold text-white">
                    {results.mean_similarity}
                  </div>
                  <div className="text-[10.5px] text-white/40 mt-1 uppercase tracking-wider">
                    Mean Sim
                  </div>
                </div>
                <div className="bg-[#1a2235] border border-white/5 rounded-[10px] p-3.5 text-center">
                  <div className="font-serif text-[22px] font-extrabold text-amber-500">
                    {results.fallback_rate}%
                  </div>
                  <div className="text-[10.5px] text-white/40 mt-1 uppercase tracking-wider">
                    Fallback
                  </div>
                </div>
              </div>
            )}

            {/* Test Query Editor */}
            <div className="bg-[#111827] border border-white/5 rounded-[14px] p-6 shadow-sm">
              <div className="font-serif text-[14px] font-bold text-white mb-1">
                Test Query Editor
              </div>
              <div className="text-[12px] text-white/40 mb-4">
                Add custom test queries below (Format: query | expected_faq_id)
              </div>

              <textarea
                className="w-full bg-[#1a2235] border border-white/5 rounded-lg py-3 px-4 text-white/90 text-[12.5px] font-mono outline-none focus:border-[#C9A84C] transition-colors resize-y min-h-[160px] custom-scrollbar"
                value={testQueries}
                onChange={(e) => setTestQueries(e.target.value)}
                placeholder="Type your queries here..."
              />

              {/* 🌟 Load Defaults Button */}
              <div className="mt-3 flex justify-end gap-2">
                <button
                  onClick={() => setTestQueries("")}
                  className="text-[11.5px] px-3 py-1.5 rounded-lg border border-white/10 text-white/50 hover:bg-white/5 hover:text-white/90 transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={loadDefaultQuestions}
                  className="text-[11.5px] px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/90 hover:bg-white/10 transition-colors"
                >
                  Load Default (50)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
