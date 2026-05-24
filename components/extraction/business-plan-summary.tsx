import { BusinessPlanData } from "@/lib/ai/extractors/schemas";
import { TrendingUp, ShieldAlert, CheckCircle2 } from "lucide-react";

export function BusinessPlanSummary({ data }: { data: BusinessPlanData }) {
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-lg bg-bg-surface border border-border-subtle">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-lg">{data.business_name}</h3>
            <p className="text-sm text-muted-foreground">{data.business_type} • {data.industry}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border-subtle">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Total Budget</div>
            <div className="font-mono text-sm">{data.total_budget ? `${data.total_budget.toLocaleString()} AZN` : 'N/A'}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Loan Requested</div>
            <div className="font-mono text-sm text-brand-accent">{data.loan_amount_requested ? `${data.loan_amount_requested.toLocaleString()} AZN` : 'N/A'}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Monthly Cost</div>
            <div className="font-mono text-sm">{data.monthly_operating_costs ? `${data.monthly_operating_costs.toLocaleString()} AZN` : 'N/A'}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Break-even</div>
            <div className="font-mono text-sm">{data.break_even_months ? `${data.break_even_months} months` : 'N/A'}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.key_strengths && data.key_strengths.length > 0 && (
          <div className="p-4 rounded-lg bg-bg-surface border border-border-subtle">
            <div className="flex items-center text-success font-medium mb-3 text-sm">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Key Strengths
            </div>
            <ul className="space-y-2 text-sm">
              {data.key_strengths.map((strength, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="mr-2 text-success">•</span>
                  <span className="text-muted-foreground">{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {data.key_risks && data.key_risks.length > 0 && (
          <div className="p-4 rounded-lg bg-bg-surface border border-border-subtle">
            <div className="flex items-center text-warning font-medium mb-3 text-sm">
              <ShieldAlert className="h-4 w-4 mr-2" />
              Key Risks
            </div>
            <ul className="space-y-2 text-sm">
              {data.key_risks.map((risk, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="mr-2 text-warning">•</span>
                  <span className="text-muted-foreground">{risk}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {data.projected_monthly_revenue_year_1 && (
        <div className="p-4 rounded-lg bg-bg-surface border border-border-subtle">
          <div className="flex items-center text-sm font-medium mb-3">
            <TrendingUp className="h-4 w-4 mr-2 text-brand-accent" />
            Revenue Projections
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Year 1 (Monthly)</div>
              <div className="font-mono text-lg">{data.projected_monthly_revenue_year_1.toLocaleString()} AZN</div>
            </div>
            {data.projected_monthly_revenue_year_2 && (
              <div>
                <div className="text-xs text-muted-foreground mb-1">Year 2 (Monthly)</div>
                <div className="font-mono text-lg">{data.projected_monthly_revenue_year_2.toLocaleString()} AZN</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
