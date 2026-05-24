import { useState } from "react";
import { FileText, FileBadge, BookOpen, IdCard, Loader2, RefreshCcw, FileBox } from "lucide-react";
import { BankStatementSummary } from "./bank-statement-summary";
import { TaxReturnSummary } from "./tax-return-summary";
import { BusinessPlanSummary } from "./business-plan-summary";

interface ExtractionCardProps {
  document: any;
  extraction?: any;
  onRetry?: () => void;
}

export function ExtractionCard({ document, extraction, onRetry }: ExtractionCardProps) {
  const isPending = !extraction || extraction.status === 'pending';
  const isProcessing = extraction?.status === 'processing';
  const isFailed = extraction?.status === 'failed';
  const isCompleted = extraction?.status === 'completed';

  const docIcon = {
    bank_statement: <FileText className="h-5 w-5" />,
    tax_return: <FileBadge className="h-5 w-5" />,
    business_plan: <BookOpen className="h-5 w-5" />,
    id_document: <IdCard className="h-5 w-5" />,
    other: <FileBox className="h-5 w-5" />
  }[document.document_type as string] || <FileBox className="h-5 w-5" />;

  return (
    <div className="border border-border-subtle bg-bg-surface rounded-xl overflow-hidden flex flex-col">
      <div className="p-4 border-b border-border-subtle flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isCompleted ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
            {docIcon}
          </div>
          <div>
            <h4 className="font-medium text-sm truncate max-w-[200px]">{document.original_filename || 'Unknown Document'}</h4>
            <div className="text-xs text-muted-foreground capitalize">{document.document_type.replace('_', ' ')}</div>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          {isPending && <span className="inline-flex px-2 py-1 rounded text-[10px] font-medium bg-muted text-muted-foreground">Pending</span>}
          {isProcessing && <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-medium bg-warning/10 text-warning animate-pulse"><Loader2 className="h-3 w-3 mr-1 animate-spin" /> Processing</span>}
          {isCompleted && <span className="inline-flex px-2 py-1 rounded text-[10px] font-medium bg-success/10 text-success">Completed</span>}
          {isFailed && <span className="inline-flex px-2 py-1 rounded text-[10px] font-medium bg-danger/10 text-danger">Failed</span>}
          
          {isCompleted && extraction.confidence_score !== null && (
            <div className="flex items-center gap-2">
              <div className="text-[10px] text-muted-foreground">Confidence</div>
              <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                <div 
                  className={`h-full ${extraction.confidence_score > 0.8 ? 'bg-success' : extraction.confidence_score > 0.5 ? 'bg-warning' : 'bg-danger'}`}
                  style={{ width: `${Math.round(extraction.confidence_score * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 flex-1">
        {isPending && (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-2 py-8">
            <div className="text-sm">Waiting to start...</div>
          </div>
        )}

        {isProcessing && (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4 py-8">
            <Loader2 className="h-8 w-8 animate-spin text-brand-accent" />
            <div className="text-sm">Extracting data with Claude...</div>
          </div>
        )}

        {isFailed && (
          <div className="h-full flex flex-col items-center justify-center text-danger space-y-3 py-6">
            <div className="text-sm text-center px-4">{extraction.error_message || 'Extraction failed'}</div>
            <button 
              onClick={onRetry}
              className="inline-flex items-center px-3 py-1.5 rounded-md border border-danger/20 hover:bg-danger/10 transition-colors text-xs font-medium"
            >
              <RefreshCcw className="h-3 w-3 mr-1.5" />
              Retry
            </button>
          </div>
        )}

        {isCompleted && extraction.structured_data && (
          <div className="h-full">
            {document.document_type === 'bank_statement' && <BankStatementSummary data={extraction.structured_data} />}
            {document.document_type === 'tax_return' && <TaxReturnSummary data={extraction.structured_data} />}
            {document.document_type === 'business_plan' && <BusinessPlanSummary data={extraction.structured_data} />}
            {['id_document', 'other'].includes(document.document_type) && (
              <div className="text-sm">
                <pre className="p-3 bg-muted rounded-md text-xs font-mono overflow-auto max-h-[250px]">
                  {JSON.stringify(extraction.structured_data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
