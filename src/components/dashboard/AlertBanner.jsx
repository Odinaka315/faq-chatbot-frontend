import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";

export default function AlertBanner() {
  const [isVisible, setIsVisible] = useState(false);

  // Grab the metrics (TanStack will use the cached data from MetricCards)
  const { data: metrics } = useQuery({
    queryKey: ["dashboard-metrics"],
    queryFn: async () => {
      const response = await api.get("/analytics/metrics");
      return response.data;
    },
  });

  useEffect(() => {
    if (!metrics) return;

    const currentLowConfCount = metrics.low_confidence_count || 0;

    // Check localStorage for the previously dismissed count
    const dismissedCount = parseInt(
      localStorage.getItem("dismissedLowConfCount") || "0",
      10,
    );

    // Only show the alert if the current count is strictly GREATER than what the user previously dismissed
    if (currentLowConfCount > dismissedCount) {
      setIsVisible(true);
    }
  }, [metrics]);

  const handleDismiss = () => {
    // Save the current count to localStorage so it doesn't show again until the number goes up
    if (metrics) {
      localStorage.setItem(
        "dismissedLowConfCount",
        metrics.low_confidence_count.toString(),
      );
    }
    setIsVisible(false);
  };

  if (!isVisible || !metrics || metrics.low_confidence_count === 0) {
    return null; // Don't render anything if there's no alert
  }

  // NOTE: Finding the exact "category" requires NLP clustering of unanswered questions.
  // For now, we use a generic placeholder until that specific gap-analysis feature is built.
  const suggestedCategory = "various";

  return (
    <div className="flex items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-500 mb-6 transition-all duration-300 ease-in-out">
      <span className="text-lg">⚠️</span>
      <span className="flex-1">
        <strong className="font-semibold">
          {metrics.low_confidence_count} queries
        </strong>{" "}
        returned low confidence scores this week — consider expanding FAQs in
        the <strong className="font-semibold">{suggestedCategory}</strong>{" "}
        category.
      </span>
      <button
        onClick={handleDismiss}
        className="opacity-60 transition-opacity hover:opacity-100 p-1"
      >
        ✕
      </button>
    </div>
  );
}
