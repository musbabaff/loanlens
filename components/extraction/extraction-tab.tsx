'use client';

import { useState, useEffect } from "react";
import { ApplicationWithDocuments } from "@/types/loanlens";
import { ExtractionCard } from "./extraction-card";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Play } from "lucide-react";
import { toast } from "sonner";

interface ExtractionTabProps {
  application: ApplicationWithDocuments;
}

export function ExtractionTab({ application }: ExtractionTabProps) {
  const [extractions, setExtractions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchExtractions();

    const channel = supabase
      .channel(`extractions:${application.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'extractions',
        filter: `application_id=eq.${application.id}`,
      }, (payload) => {
        // Optimistic UI update or re-fetch
        fetchExtractions();
      })
      .subscribe();

    return () => { channel.unsubscribe(); };
  }, [application.id]);

  const fetchExtractions = async () => {
    try {
      const { data, error } = await supabase
        .from('extractions')
        .select('*')
        .eq('application_id', application.id);

      if (error) throw error;
      setExtractions(data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load extractions");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunExtraction = async () => {
    setIsStarting(true);
    try {
      const res = await fetch(`/api/applications/${application.id}/extract`, {
        method: 'POST'
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to start extraction');
      
      toast.success("Extraction started");
      fetchExtractions();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Could not start extraction");
    } finally {
      setIsStarting(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  const isAnyProcessing = extractions.some(e => e.status === 'processing');
  const allCompleted = extractions.length > 0 && extractions.every(e => e.status === 'completed');
  const totalCost = extractions.reduce((sum, e) => sum + (e.cost_usd || 0), 0);

  return (
    <div className="flex flex-col h-full overflow-y-auto pr-2 pb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Document Extraction</h3>
          <p className="text-sm text-muted-foreground">Extract structured data from documents using Claude 3.5 Sonnet.</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <button
            onClick={handleRunExtraction}
            disabled={isStarting || isAnyProcessing || application.documents.length === 0}
            className="inline-flex items-center px-4 py-2 bg-brand-accent text-bg-base font-medium text-sm rounded-md hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {isStarting || isAnyProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Play className="h-4 w-4 mr-2" fill="currentColor" />
            )}
            {extractions.length > 0 ? "Re-run All" : "Run Extraction"}
          </button>
          
          {application.documents.length > 0 && !allCompleted && !isAnyProcessing && (
            <div className="text-[10px] text-muted-foreground">~${(application.documents.length * 0.05).toFixed(2)} estimated cost</div>
          )}
          {allCompleted && (
            <div className="text-xs text-muted-foreground font-mono">Total cost: ${totalCost.toFixed(3)}</div>
          )}
        </div>
      </div>

      {application.documents.length === 0 ? (
        <div className="text-center p-12 border border-dashed border-border-subtle rounded-xl text-muted-foreground">
          No documents uploaded yet. Upload documents to start extraction.
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {application.documents.map(doc => {
            const ext = extractions.find(e => e.document_id === doc.id);
            return (
              <ExtractionCard 
                key={doc.id} 
                document={doc} 
                extraction={ext}
                onRetry={handleRunExtraction}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
