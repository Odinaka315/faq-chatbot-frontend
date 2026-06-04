import AlertBanner from "../../components/dashboard/AlertBanner";
import MetricCards from "../../components/dashboard/MetricCards";

export default function Overview() {
  return (
    <div className="space-y-6">
      {/* Alert Banner from Template */}
      <AlertBanner />

      {/* Metric Cards from Template */}

      <MetricCards />

      {/* Placeholders for our next components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-64 rounded-xl border border-border bg-surface p-5 flex items-center justify-center text-muted">
          Chart Component Loading...
        </div>
        <div className="h-64 rounded-xl border border-border bg-surface p-5 flex items-center justify-center text-muted">
          Top Queries Loading...
        </div>
      </div>
    </div>
  );
}
