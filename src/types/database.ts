export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      automation_runs: {
        Row: {
          automation_id: string | null
          automation_name: string | null
          created_at: string
          detail: string | null
          error: string | null
          icon_name: string | null
          id: string
          org_id: string
          status: string
          timestamp_text: string | null
        }
        Insert: {
          automation_id?: string | null
          automation_name?: string | null
          created_at?: string
          detail?: string | null
          error?: string | null
          icon_name?: string | null
          id?: string
          org_id: string
          status: string
          timestamp_text?: string | null
        }
        Update: {
          automation_id?: string | null
          automation_name?: string | null
          created_at?: string
          detail?: string | null
          error?: string | null
          icon_name?: string | null
          id?: string
          org_id?: string
          status?: string
          timestamp_text?: string | null
        }
        Relationships: []
      }
      automations: {
        Row: {
          actions: Json | null
          created_at: string
          description: string | null
          enabled: boolean
          icon_name: string | null
          id: string
          last_run: string | null
          name: string
          org_id: string
          runs: number | null
          trigger_text: string | null
          updated_at: string
        }
        Insert: {
          actions?: Json | null
          created_at?: string
          description?: string | null
          enabled?: boolean
          icon_name?: string | null
          id: string
          last_run?: string | null
          name: string
          org_id: string
          runs?: number | null
          trigger_text?: string | null
          updated_at?: string
        }
        Update: {
          actions?: Json | null
          created_at?: string
          description?: string | null
          enabled?: boolean
          icon_name?: string | null
          id?: string
          last_run?: string | null
          name?: string
          org_id?: string
          runs?: number | null
          trigger_text?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      booking_personnel: {
        Row: {
          booking_id: string
          created_at: string
          id: string
          personnel_id: string
          role: string
        }
        Insert: {
          booking_id: string
          created_at?: string
          id?: string
          personnel_id: string
          role?: string
        }
        Update: {
          booking_id?: string
          created_at?: string
          id?: string
          personnel_id?: string
          role?: string
        }
        Relationships: []
      }
      booking_stage_history: {
        Row: {
          booking_id: string
          changed_at: string
          changed_by: string | null
          from_stage: string | null
          id: string
          note: string | null
          to_stage: string
        }
        Insert: {
          booking_id: string
          changed_at?: string
          changed_by?: string | null
          from_stage?: string | null
          id?: string
          note?: string | null
          to_stage: string
        }
        Update: {
          booking_id?: string
          changed_at?: string
          changed_by?: string | null
          from_stage?: string | null
          id?: string
          note?: string | null
          to_stage?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          actual_hours: number | null
          created_at: string
          customer_contact: string | null
          customer_id: string | null
          customer_name: string
          days_text: string | null
          deleted_at: string | null
          hours: number | null
          id: string
          info: string | null
          material: string | null
          org_id: string
          other_info: string | null
          product: string | null
          region: string | null
          report_photo_url: string | null
          report_text: string | null
          scheduled_date: string | null
          service_type: string
          shipped_items: string | null
          sold_volume: string | null
          stage: string
          store_city: string | null
          store_contact_name: string | null
          store_contact_phone: string | null
          store_id: string | null
          store_name: string
          updated_at: string
        }
        Insert: {
          actual_hours?: number | null
          created_at?: string
          customer_contact?: string | null
          customer_id?: string | null
          customer_name: string
          days_text?: string | null
          deleted_at?: string | null
          hours?: number | null
          id?: string
          info?: string | null
          material?: string | null
          org_id: string
          other_info?: string | null
          product?: string | null
          region?: string | null
          report_photo_url?: string | null
          report_text?: string | null
          scheduled_date?: string | null
          service_type?: string
          shipped_items?: string | null
          sold_volume?: string | null
          stage?: string
          store_city?: string | null
          store_contact_name?: string | null
          store_contact_phone?: string | null
          store_id?: string | null
          store_name: string
          updated_at?: string
        }
        Update: {
          actual_hours?: number | null
          created_at?: string
          customer_contact?: string | null
          customer_id?: string | null
          customer_name?: string
          days_text?: string | null
          deleted_at?: string | null
          hours?: number | null
          id?: string
          info?: string | null
          material?: string | null
          org_id?: string
          other_info?: string | null
          product?: string | null
          region?: string | null
          report_photo_url?: string | null
          report_text?: string | null
          scheduled_date?: string | null
          service_type?: string
          shipped_items?: string | null
          sold_volume?: string | null
          stage?: string
          store_city?: string | null
          store_contact_name?: string | null
          store_contact_phone?: string | null
          store_id?: string | null
          store_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      customer_contacts: {
        Row: {
          created_at: string
          customer_id: string
          email: string | null
          id: string
          is_primary: boolean | null
          name: string
          phone: string | null
          role: string | null
        }
        Insert: {
          created_at?: string
          customer_id: string
          email?: string | null
          id?: string
          is_primary?: boolean | null
          name: string
          phone?: string | null
          role?: string | null
        }
        Update: {
          created_at?: string
          customer_id?: string
          email?: string | null
          id?: string
          is_primary?: boolean | null
          name?: string
          phone?: string | null
          role?: string | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          created_at: string
          domain: string | null
          id: string
          name: string
          org_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          domain?: string | null
          id?: string
          name: string
          org_id: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          domain?: string | null
          id?: string
          name?: string
          org_id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          booking_id: string | null
          created_at: string
          description: string | null
          expense_date: string
          id: string
          is_roundtrip: boolean | null
          km_rate: number | null
          mileage_comment: string | null
          mileage_verdict: string | null
          org_id: string
          personnel_id: string | null
          receipt_url: string | null
          reimbursed: boolean | null
          reimbursed_at: string | null
          reported_km: number | null
          type: string
          updated_at: string
          verified_km: number | null
        }
        Insert: {
          amount: number
          booking_id?: string | null
          created_at?: string
          description?: string | null
          expense_date: string
          id?: string
          is_roundtrip?: boolean | null
          km_rate?: number | null
          mileage_comment?: string | null
          mileage_verdict?: string | null
          org_id: string
          personnel_id?: string | null
          receipt_url?: string | null
          reimbursed?: boolean | null
          reimbursed_at?: string | null
          reported_km?: number | null
          type: string
          updated_at?: string
          verified_km?: number | null
        }
        Update: {
          amount?: number
          booking_id?: string | null
          created_at?: string
          description?: string | null
          expense_date?: string
          id?: string
          is_roundtrip?: boolean | null
          km_rate?: number | null
          mileage_comment?: string | null
          mileage_verdict?: string | null
          org_id?: string
          personnel_id?: string | null
          receipt_url?: string | null
          reimbursed?: boolean | null
          reimbursed_at?: string | null
          reported_km?: number | null
          type?: string
          updated_at?: string
          verified_km?: number | null
        }
        Relationships: []
      }
      inbox_emails: {
        Row: {
          auto_reply_draft: string | null
          auto_reply_sent_at: string | null
          body: string | null
          booking_id: string | null
          created_at: string
          from_company: string | null
          from_email: string
          from_name: string | null
          id: string
          missing_fields: string[] | null
          org_id: string
          parse_status: string
          parsed_fields: Json | null
          received_at: string
          status: string
          subject: string | null
        }
        Insert: {
          auto_reply_draft?: string | null
          auto_reply_sent_at?: string | null
          body?: string | null
          booking_id?: string | null
          created_at?: string
          from_company?: string | null
          from_email: string
          from_name?: string | null
          id?: string
          missing_fields?: string[] | null
          org_id: string
          parse_status?: string
          parsed_fields?: Json | null
          received_at?: string
          status?: string
          subject?: string | null
        }
        Update: {
          auto_reply_draft?: string | null
          auto_reply_sent_at?: string | null
          body?: string | null
          booking_id?: string | null
          created_at?: string
          from_company?: string | null
          from_email?: string
          from_name?: string | null
          id?: string
          missing_fields?: string[] | null
          org_id?: string
          parse_status?: string
          parsed_fields?: Json | null
          received_at?: string
          status?: string
          subject?: string | null
        }
        Relationships: []
      }
      invoice_bookings: {
        Row: {
          booking_id: string
          invoice_id: string
        }
        Insert: {
          booking_id: string
          invoice_id: string
        }
        Update: {
          booking_id?: string
          invoice_id?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          created_at: string
          customer_id: string
          deleted_at: string | null
          due_date: string | null
          expenses_total: number | null
          fortnox_id: string | null
          id: string
          invoice_date: string
          invoice_number: string
          labor_cost: number | null
          org_id: string
          paid_date: string | null
          status: string
          total: number | null
          total_hours: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          deleted_at?: string | null
          due_date?: string | null
          expenses_total?: number | null
          fortnox_id?: string | null
          id?: string
          invoice_date: string
          invoice_number: string
          labor_cost?: number | null
          org_id: string
          paid_date?: string | null
          status?: string
          total?: number | null
          total_hours?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          deleted_at?: string | null
          due_date?: string | null
          expenses_total?: number | null
          fortnox_id?: string | null
          id?: string
          invoice_date?: string
          invoice_number?: string
          labor_cost?: number | null
          org_id?: string
          paid_date?: string | null
          status?: string
          total?: number | null
          total_hours?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      organizations: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      personnel: {
        Row: {
          active: boolean
          availability: string | null
          certifications: string[] | null
          competencies: string[] | null
          created_at: string
          email: string | null
          experience_years: number | null
          full_name: string
          home_city: string | null
          id: string
          initials: string
          languages: string[] | null
          lat: number | null
          lng: number | null
          max_radius_km: number | null
          notes: string | null
          org_id: string
          phone: string | null
          rating: number | null
          specialties: string[] | null
          total_assignments: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          active?: boolean
          availability?: string | null
          certifications?: string[] | null
          competencies?: string[] | null
          created_at?: string
          email?: string | null
          experience_years?: number | null
          full_name: string
          home_city?: string | null
          id?: string
          initials: string
          languages?: string[] | null
          lat?: number | null
          lng?: number | null
          max_radius_km?: number | null
          notes?: string | null
          org_id: string
          phone?: string | null
          rating?: number | null
          specialties?: string[] | null
          total_assignments?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          active?: boolean
          availability?: string | null
          certifications?: string[] | null
          competencies?: string[] | null
          created_at?: string
          email?: string | null
          experience_years?: number | null
          full_name?: string
          home_city?: string | null
          id?: string
          initials?: string
          languages?: string[] | null
          lat?: number | null
          lng?: number | null
          max_radius_km?: number | null
          notes?: string | null
          org_id?: string
          phone?: string | null
          rating?: number | null
          specialties?: string[] | null
          total_assignments?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      quality_reviews: {
        Row: {
          average_score: number
          booking_id: string
          comments: Json | null
          created_at: string
          id: string
          org_id: string
          overall_comment: string | null
          personnel_id: string | null
          preferred_personnel_id: string | null
          review_number: number
          reviewed_by: string | null
          scores: Json
        }
        Insert: {
          average_score: number
          booking_id: string
          comments?: Json | null
          created_at?: string
          id?: string
          org_id: string
          overall_comment?: string | null
          personnel_id?: string | null
          preferred_personnel_id?: string | null
          review_number: number
          reviewed_by?: string | null
          scores: Json
        }
        Update: {
          average_score?: number
          booking_id?: string
          comments?: Json | null
          created_at?: string
          id?: string
          org_id?: string
          overall_comment?: string | null
          personnel_id?: string | null
          preferred_personnel_id?: string | null
          review_number?: number
          reviewed_by?: string | null
          scores?: Json
        }
        Relationships: []
      }
      store_contacts: {
        Row: {
          created_at: string
          email: string | null
          id: string
          is_primary: boolean | null
          name: string
          phone: string | null
          role: string | null
          store_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          is_primary?: boolean | null
          name: string
          phone?: string | null
          role?: string | null
          store_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          is_primary?: boolean | null
          name?: string
          phone?: string | null
          role?: string | null
          store_id?: string
        }
        Relationships: []
      }
      stores: {
        Row: {
          city: string | null
          created_at: string
          id: string
          lat: number | null
          lng: number | null
          name: string
          org_id: string
          region: string | null
          updated_at: string
        }
        Insert: {
          city?: string | null
          created_at?: string
          id?: string
          lat?: number | null
          lng?: number | null
          name: string
          org_id: string
          region?: string | null
          updated_at?: string
        }
        Update: {
          city?: string | null
          created_at?: string
          id?: string
          lat?: number | null
          lng?: number | null
          name?: string
          org_id?: string
          region?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string
          customer_id: string | null
          email: string
          full_name: string | null
          id: string
          org_id: string | null
          personnel_id: string | null
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          email: string
          full_name?: string | null
          id: string
          org_id?: string | null
          personnel_id?: string | null
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          email?: string
          full_name?: string | null
          id?: string
          org_id?: string | null
          personnel_id?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      current_user_org_id: { Args: Record<string, never>; Returns: string }
      current_user_role: { Args: Record<string, never>; Returns: string }
      is_super_admin: { Args: Record<string, never>; Returns: boolean }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
