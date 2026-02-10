export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      funnel_events: {
        Row: {
          created_at: string
          device_type: string | null
          event_type: string
          id: string
          metadata: Json | null
          referrer: string | null
          session_id: string
          step_name: string | null
          step_number: number | null
        }
        Insert: {
          created_at?: string
          device_type?: string | null
          event_type: string
          id?: string
          metadata?: Json | null
          referrer?: string | null
          session_id: string
          step_name?: string | null
          step_number?: number | null
        }
        Update: {
          created_at?: string
          device_type?: string | null
          event_type?: string
          id?: string
          metadata?: Json | null
          referrer?: string | null
          session_id?: string
          step_name?: string | null
          step_number?: number | null
        }
        Relationships: []
      }
      investor_profiles: {
        Row: {
          confidence: number
          created_at: string
          id: string
          japanese_name: string | null
          profile_type: string
          scores: Json
          tagline: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          confidence: number
          created_at?: string
          id?: string
          japanese_name?: string | null
          profile_type: string
          scores?: Json
          tagline?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          confidence?: number
          created_at?: string
          id?: string
          japanese_name?: string | null
          profile_type?: string
          scores?: Json
          tagline?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      kyc_audit_log: {
        Row: {
          action: string
          api_called: string | null
          created_at: string
          error_message: string | null
          id: string
          ip_address: string | null
          kyc_record_id: string | null
          request_summary: Json | null
          response_summary: Json | null
          status: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action: string
          api_called?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          ip_address?: string | null
          kyc_record_id?: string | null
          request_summary?: Json | null
          response_summary?: Json | null
          status?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action?: string
          api_called?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          ip_address?: string | null
          kyc_record_id?: string | null
          request_summary?: Json | null
          response_summary?: Json | null
          status?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "kyc_audit_log_kyc_record_id_fkey"
            columns: ["kyc_record_id"]
            isOneToOne: false
            referencedRelation: "kyc_records"
            referencedColumns: ["id"]
          },
        ]
      }
      kyc_records: {
        Row: {
          aadhaar_masked: string | null
          ckyc_kin: string | null
          created_at: string
          expires_at: string | null
          id: string
          kra_status: string | null
          kyc_data: Json | null
          kyc_source: Database["public"]["Enums"]["kyc_source"] | null
          pan_number: string | null
          status: Database["public"]["Enums"]["kyc_status"]
          updated_at: string
          user_id: string
          verified_at: string | null
        }
        Insert: {
          aadhaar_masked?: string | null
          ckyc_kin?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          kra_status?: string | null
          kyc_data?: Json | null
          kyc_source?: Database["public"]["Enums"]["kyc_source"] | null
          pan_number?: string | null
          status?: Database["public"]["Enums"]["kyc_status"]
          updated_at?: string
          user_id: string
          verified_at?: string | null
        }
        Update: {
          aadhaar_masked?: string | null
          ckyc_kin?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          kra_status?: string | null
          kyc_data?: Json | null
          kyc_source?: Database["public"]["Enums"]["kyc_source"] | null
          pan_number?: string | null
          status?: Database["public"]["Enums"]["kyc_status"]
          updated_at?: string
          user_id?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      onboarding_answers: {
        Row: {
          answer_value: Json
          created_at: string
          id: string
          question_id: string
          user_id: string
        }
        Insert: {
          answer_value: Json
          created_at?: string
          id?: string
          question_id: string
          user_id: string
        }
        Update: {
          answer_value?: Json
          created_at?: string
          id?: string
          question_id?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          pan: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          pan?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          pan?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_documents: {
        Row: {
          created_at: string
          doc_number: string | null
          doc_type: Database["public"]["Enums"]["document_type"]
          extracted_data: Json | null
          file_name: string | null
          file_size: number | null
          id: string
          mime_type: string | null
          storage_path: string | null
          updated_at: string
          uploaded_at: string
          user_id: string
          verification_notes: string | null
          verification_status: Database["public"]["Enums"]["verification_status"]
          verified_at: string | null
        }
        Insert: {
          created_at?: string
          doc_number?: string | null
          doc_type: Database["public"]["Enums"]["document_type"]
          extracted_data?: Json | null
          file_name?: string | null
          file_size?: number | null
          id?: string
          mime_type?: string | null
          storage_path?: string | null
          updated_at?: string
          uploaded_at?: string
          user_id: string
          verification_notes?: string | null
          verification_status?: Database["public"]["Enums"]["verification_status"]
          verified_at?: string | null
        }
        Update: {
          created_at?: string
          doc_number?: string | null
          doc_type?: Database["public"]["Enums"]["document_type"]
          extracted_data?: Json | null
          file_name?: string | null
          file_size?: number | null
          id?: string
          mime_type?: string | null
          storage_path?: string | null
          updated_at?: string
          uploaded_at?: string
          user_id?: string
          verification_notes?: string | null
          verification_status?: Database["public"]["Enums"]["verification_status"]
          verified_at?: string | null
        }
        Relationships: []
      }
      user_goals: {
        Row: {
          created_at: string
          goal_name: string
          goal_type: string
          id: string
          is_primary: boolean | null
          monthly_sip: number | null
          recommended_portfolio: Json | null
          status: string | null
          target_amount: number
          timeline_years: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          goal_name: string
          goal_type: string
          id?: string
          is_primary?: boolean | null
          monthly_sip?: number | null
          recommended_portfolio?: Json | null
          status?: string | null
          target_amount: number
          timeline_years: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          goal_name?: string
          goal_type?: string
          id?: string
          is_primary?: boolean | null
          monthly_sip?: number | null
          recommended_portfolio?: Json | null
          status?: string | null
          target_amount?: number
          timeline_years?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      document_type:
        | "PAN"
        | "AADHAAR"
        | "PASSPORT"
        | "VOTER_ID"
        | "DRIVING_LICENSE"
        | "ADDRESS_PROOF"
        | "PHOTO"
        | "SIGNATURE"
      kyc_source: "CKYC" | "KRA" | "FRESH"
      kyc_status:
        | "PENDING"
        | "IN_PROGRESS"
        | "VERIFIED"
        | "REJECTED"
        | "EXPIRED"
      verification_status: "PENDING" | "VERIFIED" | "REJECTED" | "EXPIRED"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      document_type: [
        "PAN",
        "AADHAAR",
        "PASSPORT",
        "VOTER_ID",
        "DRIVING_LICENSE",
        "ADDRESS_PROOF",
        "PHOTO",
        "SIGNATURE",
      ],
      kyc_source: ["CKYC", "KRA", "FRESH"],
      kyc_status: ["PENDING", "IN_PROGRESS", "VERIFIED", "REJECTED", "EXPIRED"],
      verification_status: ["PENDING", "VERIFIED", "REJECTED", "EXPIRED"],
    },
  },
} as const
