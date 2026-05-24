import { Plus } from "lucide-react";
import Link from "next/link";
import { ApplicationsTable } from "@/components/applications/applications-table";

export default function ApplicationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Applications</h2>
          <p className="text-muted-foreground">Manage and track loan applications.</p>
        </div>
        <Link
          href="/dashboard/applications/new"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 gap-2"
        >
          <Plus className="h-4 w-4" />
          New Application
        </Link>
      </div>

      <ApplicationsTable />
    </div>
  );
}
