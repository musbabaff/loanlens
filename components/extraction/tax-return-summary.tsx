import { TaxReturnData } from "@/lib/ai/extractors/schemas";

export function TaxReturnSummary({ data }: { data: TaxReturnData }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 rounded-lg bg-bg-surface border border-border-subtle">
        <div>
          <div className="text-xs text-muted-foreground mb-1">Taxpayer</div>
          <div className="font-medium">{data.taxpayer_name}</div>
          <div className="text-xs text-muted-foreground font-mono mt-1">ID: {data.taxpayer_id || 'Unknown'}</div>
        </div>
        <div className="text-right">
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-accent/10 text-brand-accent">
            Tax Year {data.year}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-bg-surface border border-border-subtle">
          <div className="text-xs text-muted-foreground mb-1">Declared Income</div>
          <div className="font-mono text-2xl">{data.declared_income.toLocaleString()} AZN</div>
        </div>
        <div className="p-4 rounded-lg bg-bg-surface border border-border-subtle">
          <div className="text-xs text-muted-foreground mb-1">Tax Paid</div>
          <div className="font-mono text-2xl">{data.tax_paid.toLocaleString()} AZN</div>
        </div>
      </div>

      {data.income_sources && data.income_sources.length > 0 && (
        <div className="border border-border-subtle rounded-lg overflow-hidden bg-bg-surface">
          <div className="p-3 border-b border-border-subtle font-medium text-sm">Income Sources</div>
          <div className="divide-y divide-border-subtle">
            {data.income_sources.map((source, idx) => (
              <div key={idx} className="p-3 flex justify-between items-center text-sm">
                <span className="text-muted-foreground">{source.source}</span>
                <span className="font-mono">{source.amount.toLocaleString()} AZN</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
