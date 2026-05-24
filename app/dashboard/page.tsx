import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileBox, RefreshCcw, CheckCircle2, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  const stats = [
    {
      title: "Applications Today",
      value: "0",
      icon: FileBox,
      trend: "+0% from yesterday",
    },
    {
      title: "Processing",
      value: "0",
      icon: RefreshCcw,
      trend: "Requires review",
    },
    {
      title: "Completed",
      value: "0",
      icon: CheckCircle2,
      trend: "Past 30 days",
    },
    {
      title: "Avg Risk Score",
      value: "—",
      icon: TrendingUp,
      trend: "Out of 100",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-bg-surface border border-border-subtle shadow-sm hover:-translate-y-[1px] hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
              <CardTitle className="text-xs uppercase tracking-wide text-text-muted">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-brand-accent" />
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-0">
              <div className="text-3xl font-semibold text-text-primary">{stat.value}</div>
              <p className="text-xs text-text-secondary mt-1">
                {stat.trend}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-bg-surface border-border-subtle">
          <CardHeader>
            <CardTitle className="text-text-primary">Recent Applications</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-64 text-text-muted text-sm border-t border-border-subtle">
            No applications yet.
          </CardContent>
        </Card>
        <Card className="col-span-3 bg-bg-surface border-border-subtle">
          <CardHeader>
            <CardTitle className="text-text-primary">Recent Memos</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-64 text-text-muted text-sm border-t border-border-subtle">
            No memos generated yet.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
