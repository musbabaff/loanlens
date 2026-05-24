import { z } from 'zod';

// Bank Statement
export const BankStatementSchema = z.object({
  account_holder: z.string(),
  bank_name: z.string(),
  account_number_masked: z.string().optional(),
  statement_period: z.object({
    from: z.string(),
    to: z.string(),
  }),
  opening_balance: z.number(),
  closing_balance: z.number(),
  currency: z.string().default('AZN'),
  transactions: z.array(z.object({
    date: z.string(),
    description: z.string(),
    amount: z.number(),
    type: z.enum(['credit', 'debit']),
    balance_after: z.number().optional(),
    category: z.string().optional(),
  })),
  summary: z.object({
    total_credits: z.number(),
    total_debits: z.number(),
    monthly_avg_inflow: z.number(),
    monthly_avg_outflow: z.number(),
    largest_credit: z.object({
      date: z.string(),
      amount: z.number(),
      description: z.string(),
    }).optional(),
    largest_debit: z.object({
      date: z.string(),
      amount: z.number(),
      description: z.string(),
    }).optional(),
    overdraft_count: z.number().default(0),
    nsf_count: z.number().default(0),
  }),
  red_flags: z.array(z.string()).default([]),
  confidence: z.number().min(0).max(1),
});

export type BankStatementData = z.infer<typeof BankStatementSchema>;

// Tax Return
export const TaxReturnSchema = z.object({
  taxpayer_name: z.string(),
  taxpayer_id: z.string().optional(),
  year: z.number(),
  declared_income: z.number(),
  tax_paid: z.number(),
  income_sources: z.array(z.object({
    source: z.string(),
    amount: z.number(),
  })).default([]),
  business_name: z.string().optional(),
  confidence: z.number().min(0).max(1),
});

export type TaxReturnData = z.infer<typeof TaxReturnSchema>;

// Business Plan
export const BusinessPlanSchema = z.object({
  business_name: z.string(),
  business_type: z.string(),
  industry: z.string(),
  location: z.string().optional(),
  total_budget: z.number().optional(),
  loan_amount_requested: z.number().optional(),
  personal_capital: z.number().optional(),
  monthly_operating_costs: z.number().optional(),
  projected_monthly_revenue_year_1: z.number().optional(),
  projected_monthly_revenue_year_2: z.number().optional(),
  break_even_months: z.number().optional(),
  key_strengths: z.array(z.string()).default([]),
  key_risks: z.array(z.string()).default([]),
  market_analysis_summary: z.string().optional(),
  confidence: z.number().min(0).max(1),
});

export type BusinessPlanData = z.infer<typeof BusinessPlanSchema>;

// ID Document
export const IdDocumentSchema = z.object({
  full_name: z.string(),
  date_of_birth: z.string().optional(),
  id_number: z.string(),
  expiration_date: z.string().optional(),
  issuing_authority: z.string().optional(),
  document_type: z.string().default('national_id'),
  confidence: z.number().min(0).max(1),
});

export type IdDocumentData = z.infer<typeof IdDocumentSchema>;

// Generic
export const GenericDocumentSchema = z.object({
  document_type_detected: z.string(),
  summary: z.string(),
  key_facts: z.array(z.string()).default([]),
  confidence: z.number().min(0).max(1),
});

export type GenericDocumentData = z.infer<typeof GenericDocumentSchema>;
