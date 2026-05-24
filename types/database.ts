export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      applications: {
        Row: {
          id: string
          user_id: string
          applicant_name: string
          loan_amount: number
          loan_purpose: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          applicant_name: string
          loan_amount: number
          loan_purpose: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          applicant_name?: string
          loan_amount?: number
          loan_purpose?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          id: string
          application_id: string
          user_id: string
          file_path: string
          document_type: string
          file_size_bytes: number | null
          original_filename: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          application_id: string
          user_id?: string
          file_path: string
          document_type?: string
          file_size_bytes?: number | null
          original_filename?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          application_id?: string
          user_id?: string
          file_path?: string
          document_type?: string
          file_size_bytes?: number | null
          original_filename?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          }
        ]
      }
      audit_logs: {
        Row: {
          id: string
          application_id: string
          user_id: string
          action: string
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          application_id: string
          user_id?: string
          action: string
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          application_id?: string
          user_id?: string
          action?: string
          metadata?: Json | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          id: string
          full_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      extractions: {
        Row: {
          id: string
          document_id: string | null
          application_id: string | null
          status: string | null
          raw_data: Json | null
          structured_data: Json | null
          confidence_score: number | null
          error_message: string | null
          tokens_input: number | null
          tokens_output: number | null
          cost_usd: number | null
          started_at: string | null
          completed_at: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          document_id?: string | null
          application_id?: string | null
          status?: string | null
          raw_data?: Json | null
          structured_data?: Json | null
          confidence_score?: number | null
          error_message?: string | null
          tokens_input?: number | null
          tokens_output?: number | null
          cost_usd?: number | null
          started_at?: string | null
          completed_at?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          document_id?: string | null
          application_id?: string | null
          status?: string | null
          raw_data?: Json | null
          structured_data?: Json | null
          confidence_score?: number | null
          error_message?: string | null
          tokens_input?: number | null
          tokens_output?: number | null
          cost_usd?: number | null
          started_at?: string | null
          completed_at?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "extractions_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "extractions_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: true
            referencedRelation: "documents"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
