import AlertBanner from "../../components/dashboard/AlertBanner";
import MetricCards from "../../components/dashboard/MetricCards";
import TrendChart from "../../components/dashboard/TrendChart";
import TopQueries from "../../components/dashboard/TopQueries";
import {
  RetrievalAccuracy,
  QueryCategories,
  QuickAddFAQ,
} from "../../components/dashboard/BottomWidgets";
import RecentLogs from "../../components/dashboard/RecentLogs";
import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";

export default function Overview() {
  const { data: metrics } = useQuery({
    queryKey: ["dashboard-metrics"],
    queryFn: async () => (await api.get("/analytics/metrics")).data,
  });
  return (
    <div className="space-y-6">
      {/* Alert Banner from Template */}
      <AlertBanner />
      <MetricCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendChart />
        <TopQueries />
      </div>

      {/* The 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <RetrievalAccuracy metrics={metrics} />
        <QueryCategories />
        <QuickAddFAQ />
      </div>

      {/* Recent Logs */}
      <RecentLogs />
    </div>
  );
}
