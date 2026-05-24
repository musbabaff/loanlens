import { Database } from './database';

export type ApplicationWithDocuments = Database['public']['Tables']['applications']['Row'] & {
  documents: Database['public']['Tables']['documents']['Row'][];
};

export type DocumentType = 'bank_statement' | 'tax_return' | 'business_plan' | 'id_document' | 'other';
