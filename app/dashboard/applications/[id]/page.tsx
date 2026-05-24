import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ApplicationDetail } from "@/components/applications/application-detail";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ApplicationWithDocuments } from "@/types/loanlens";

export default async function ApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return notFound();
  }

  const { data: application, error } = await supabase
    .from("applications")
    .select("*, documents(*)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !application) {
    console.error("Error fetching application:", error);
    return notFound();
  }

  // Sort documents by created_at desc
  const sortedDocuments = [...(application.documents || [])].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const applicationWithDocs: ApplicationWithDocuments = {
    ...application,
    documents: sortedDocuments,
  };

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16))] -m-8 p-8 overflow-hidden bg-bg-base">
      <div className="mb-6 shrink-0">
        <Link 
          href="/dashboard/applications"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to applications
        </Link>
      </div>
      
      <ApplicationDetail initialApplication={applicationWithDocs} />
    </div>
  );
}
