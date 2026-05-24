import { BankStatementData } from "@/lib/ai/extractors/schemas";
import { ArrowDownIcon, ArrowUpIcon, AlertTriangle } from "lucide-react";

export function BankStatementSummary({ data }: { data: BankStatementData }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-bg-surface border border-border-subtle">
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Period</div>
          <div className="font-mono text-sm">
            {data.statement_period.from} to {data.statement_period.to}
          </div>
        </div>
        <div className="p-4 rounded-lg bg-bg-surface border border-border-subtle">
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Account</div>
          <div className="font-mono text-sm">
            {data.bank_name} - {data.account_number_masked || 'Unknown'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-bg-surface border border-border-subtle">
          <div className="text-xs text-muted-foreground mb-1">Opening Balance</div>
          <div className="font-mono text-lg">{data.opening_balance.toLocaleString()} {data.currency}</div>
        </div>
        <div className="p-4 rounded-lg bg-bg-surface border border-border-subtle">
          <div className="text-xs text-muted-foreground mb-1">Closing Balance</div>
          <div className="font-mono text-lg">{data.closing_balance.toLocaleString()} {data.currency}</div>
        </div>
        <div className="p-4 rounded-lg bg-bg-surface border border-border-subtle">
          <div className="text-xs text-muted-foreground mb-1">Total Inflow</div>
          <div className="font-mono text-lg text-success flex items-center">
            <ArrowUpIcon className="h-4 w-4 mr-1" />
            {data.summary.total_credits.toLocaleString()} {data.currency}
          </div>
        </div>
        <div className="p-4 rounded-lg bg-bg-surface border border-border-subtle">
          <div className="text-xs text-muted-foreground mb-1">Total Outflow</div>
          <div className="font-mono text-lg text-danger flex items-center">
            <ArrowDownIcon className="h-4 w-4 mr-1" />
            {data.summary.total_debits.toLocaleString()} {data.currency}
          </div>
        </div>
      </div>

      {data.red_flags && data.red_flags.length > 0 && (
        <div className="p-4 rounded-lg bg-danger/10 border border-danger/20">
          <div className="flex items-center text-danger font-medium mb-2 text-sm">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Red Flags Detected
          </div>
          <ul className="list-disc list-inside text-sm text-danger/90 space-y-1">
            {data.red_flags.map((flag, idx) => (
              <li key={idx}>{flag}</li>
            ))}
          </ul>
        </div>
      )}

      {data.transactions && data.transactions.length > 0 && (
        <div className="border border-border-subtle rounded-lg overflow-hidden bg-bg-surface">
          <div className="p-3 border-b border-border-subtle font-medium text-sm">Top Transactions</div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground border-b border-border-subtle">
                <th className="p-3 font-normal">Date</th>
                <th className="p-3 font-normal">Description</th>
                <th className="p-3 font-normal text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.transactions.slice(0, 5).map((t, idx) => (
                <tr key={idx} className="border-b border-border-subtle/50 last:border-0">
                  <td className="p-3 font-mono text-muted-foreground">{t.date}</td>
                  <td className="p-3 truncate max-w-[200px]">{t.description}</td>
                  <td className={`p-3 font-mono text-right ${t.type === 'credit' ? 'text-success' : 'text-foreground'}`}>
                    {t.type === 'credit' ? '+' : '-'}{t.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
