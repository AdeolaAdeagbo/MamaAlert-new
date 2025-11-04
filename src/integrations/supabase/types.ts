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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      ai_nurse_chats: {
        Row: {
          ai_response: string
          created_at: string
          id: string
          is_synced: boolean
          response_audio_url: string | null
          user_id: string
          user_message: string
        }
        Insert: {
          ai_response: string
          created_at?: string
          id?: string
          is_synced?: boolean
          response_audio_url?: string | null
          user_id: string
          user_message: string
        }
        Update: {
          ai_response?: string
          created_at?: string
          id?: string
          is_synced?: boolean
          response_audio_url?: string | null
          user_id?: string
          user_message?: string
        }
        Relationships: []
      }
      appointments: {
        Row: {
          appointment_date: string
          appointment_time: string
          created_at: string
          hospital_name: string
          id: string
          notes: string | null
          reminder_sent: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          appointment_date: string
          appointment_time: string
          created_at?: string
          hospital_name: string
          id?: string
          notes?: string | null
          reminder_sent?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          created_at?: string
          hospital_name?: string
          id?: string
          notes?: string | null
          reminder_sent?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      baby_growth: {
        Row: {
          baby_id: string
          created_at: string
          head_circumference: number | null
          height: number | null
          id: string
          notes: string | null
          recorded_date: string
          user_id: string
          weight: number | null
        }
        Insert: {
          baby_id: string
          created_at?: string
          head_circumference?: number | null
          height?: number | null
          id?: string
          notes?: string | null
          recorded_date: string
          user_id: string
          weight?: number | null
        }
        Update: {
          baby_id?: string
          created_at?: string
          head_circumference?: number | null
          height?: number | null
          id?: string
          notes?: string | null
          recorded_date?: string
          user_id?: string
          weight?: number | null
        }
        Relationships: []
      }
      baby_milestones: {
        Row: {
          achieved_date: string | null
          baby_id: string
          created_at: string
          expected_age_months: number | null
          id: string
          milestone_name: string
          milestone_type: string | null
          notes: string | null
          user_id: string
        }
        Insert: {
          achieved_date?: string | null
          baby_id: string
          created_at?: string
          expected_age_months?: number | null
          id?: string
          milestone_name: string
          milestone_type?: string | null
          notes?: string | null
          user_id: string
        }
        Update: {
          achieved_date?: string | null
          baby_id?: string
          created_at?: string
          expected_age_months?: number | null
          id?: string
          milestone_name?: string
          milestone_type?: string | null
          notes?: string | null
          user_id?: string
        }
        Relationships: []
      }
      baby_profiles: {
        Row: {
          birth_date: string
          birth_height: number | null
          birth_weight: number | null
          created_at: string
          gender: string | null
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          birth_date: string
          birth_height?: number | null
          birth_weight?: number | null
          created_at?: string
          gender?: string | null
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          birth_date?: string
          birth_height?: number | null
          birth_weight?: number | null
          created_at?: string
          gender?: string | null
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      breastfeeding_sessions: {
        Row: {
          baby_id: string
          created_at: string
          end_time: string | null
          id: string
          notes: string | null
          side_used: string | null
          start_time: string
          user_id: string
        }
        Insert: {
          baby_id: string
          created_at?: string
          end_time?: string | null
          id?: string
          notes?: string | null
          side_used?: string | null
          start_time: string
          user_id: string
        }
        Update: {
          baby_id?: string
          created_at?: string
          end_time?: string | null
          id?: string
          notes?: string | null
          side_used?: string | null
          start_time?: string
          user_id?: string
        }
        Relationships: []
      }
      emergency_alerts: {
        Row: {
          alert_type: string
          id: string
          location: string | null
          message: string
          resolved: boolean | null
          timestamp: string
          user_id: string
        }
        Insert: {
          alert_type?: string
          id?: string
          location?: string | null
          message: string
          resolved?: boolean | null
          timestamp?: string
          user_id: string
        }
        Update: {
          alert_type?: string
          id?: string
          location?: string | null
          message?: string
          resolved?: boolean | null
          timestamp?: string
          user_id?: string
        }
        Relationships: []
      }
      emergency_contacts: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          is_primary: boolean | null
          name: string
          phone: string
          relationship: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          is_primary?: boolean | null
          name: string
          phone: string
          relationship: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          is_primary?: boolean | null
          name?: string
          phone?: string
          relationship?: string
          user_id?: string
        }
        Relationships: []
      }
      emergency_planning: {
        Row: {
          checklist_items: string | null
          created_at: string
          id: string
          updated_at: string
          user_id: string
          weekly_reminders: boolean
        }
        Insert: {
          checklist_items?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
          weekly_reminders?: boolean
        }
        Update: {
          checklist_items?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
          weekly_reminders?: boolean
        }
        Relationships: []
      }
      infant_symptoms: {
        Row: {
          baby_id: string
          created_at: string
          description: string | null
          id: string
          severity: number | null
          symptom_type: string
          temperature: number | null
          timestamp: string
          user_id: string
        }
        Insert: {
          baby_id: string
          created_at?: string
          description?: string | null
          id?: string
          severity?: number | null
          symptom_type: string
          temperature?: number | null
          timestamp?: string
          user_id: string
        }
        Update: {
          baby_id?: string
          created_at?: string
          description?: string | null
          id?: string
          severity?: number | null
          symptom_type?: string
          temperature?: number | null
          timestamp?: string
          user_id?: string
        }
        Relationships: []
      }
      mood_tracking: {
        Row: {
          anxiety_level: number | null
          created_at: string
          id: string
          mood_score: number | null
          notes: string | null
          sleep_hours: number | null
          user_id: string
        }
        Insert: {
          anxiety_level?: number | null
          created_at?: string
          id?: string
          mood_score?: number | null
          notes?: string | null
          sleep_hours?: number | null
          user_id: string
        }
        Update: {
          anxiety_level?: number | null
          created_at?: string
          id?: string
          mood_score?: number | null
          notes?: string | null
          sleep_hours?: number | null
          user_id?: string
        }
        Relationships: []
      }
      pregnancy_data: {
        Row: {
          allergies: string | null
          created_at: string | null
          current_medications: string | null
          delivery_date: string | null
          doctor_name: string | null
          due_date: string | null
          emergency_notes: string | null
          hospital_name: string | null
          id: string
          is_high_risk: boolean | null
          last_menstrual_period: string | null
          medical_conditions: string | null
          previous_pregnancies: string | null
          updated_at: string | null
          user_id: string
          weeks_pregnant: number | null
        }
        Insert: {
          allergies?: string | null
          created_at?: string | null
          current_medications?: string | null
          delivery_date?: string | null
          doctor_name?: string | null
          due_date?: string | null
          emergency_notes?: string | null
          hospital_name?: string | null
          id?: string
          is_high_risk?: boolean | null
          last_menstrual_period?: string | null
          medical_conditions?: string | null
          previous_pregnancies?: string | null
          updated_at?: string | null
          user_id: string
          weeks_pregnant?: number | null
        }
        Update: {
          allergies?: string | null
          created_at?: string | null
          current_medications?: string | null
          delivery_date?: string | null
          doctor_name?: string | null
          due_date?: string | null
          emergency_notes?: string | null
          hospital_name?: string | null
          id?: string
          is_high_risk?: boolean | null
          last_menstrual_period?: string | null
          medical_conditions?: string | null
          previous_pregnancies?: string | null
          updated_at?: string | null
          user_id?: string
          weeks_pregnant?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          first_name: string
          id: string
          last_name: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          first_name: string
          id: string
          last_name: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      symptom_logs: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          severity: number | null
          symptom_type: string
          timestamp: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          severity?: number | null
          symptom_type: string
          timestamp?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          severity?: number | null
          symptom_type?: string
          timestamp?: string | null
          user_id?: string
        }
        Relationships: []
      }
      transport_requests: {
        Row: {
          created_at: string
          destination: string
          destination_latitude: number | null
          destination_longitude: number | null
          driver_name: string | null
          driver_phone: string | null
          id: string
          notes: string | null
          pickup_latitude: number | null
          pickup_location: string
          pickup_longitude: number | null
          status: string
          transport_type: string
          updated_at: string
          urgency: string
          user_id: string
          vehicle_number: string | null
        }
        Insert: {
          created_at?: string
          destination: string
          destination_latitude?: number | null
          destination_longitude?: number | null
          driver_name?: string | null
          driver_phone?: string | null
          id?: string
          notes?: string | null
          pickup_latitude?: number | null
          pickup_location: string
          pickup_longitude?: number | null
          status?: string
          transport_type: string
          updated_at?: string
          urgency: string
          user_id: string
          vehicle_number?: string | null
        }
        Update: {
          created_at?: string
          destination?: string
          destination_latitude?: number | null
          destination_longitude?: number | null
          driver_name?: string | null
          driver_phone?: string | null
          id?: string
          notes?: string | null
          pickup_latitude?: number | null
          pickup_location?: string
          pickup_longitude?: number | null
          status?: string
          transport_type?: string
          updated_at?: string
          urgency?: string
          user_id?: string
          vehicle_number?: string | null
        }
        Relationships: []
      }
      trusted_transport: {
        Row: {
          created_at: string
          driver_name: string
          id: string
          notes: string | null
          phone_number: string
          updated_at: string
          user_id: string
          vehicle_info: string | null
        }
        Insert: {
          created_at?: string
          driver_name: string
          id?: string
          notes?: string | null
          phone_number: string
          updated_at?: string
          user_id: string
          vehicle_info?: string | null
        }
        Update: {
          created_at?: string
          driver_name?: string
          id?: string
          notes?: string | null
          phone_number?: string
          updated_at?: string
          user_id?: string
          vehicle_info?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vaccines: {
        Row: {
          administered_date: string | null
          baby_id: string
          created_at: string
          id: string
          location: string | null
          notes: string | null
          reminder_sent: boolean | null
          reminder_sent_date: string | null
          scheduled_date: string
          updated_at: string
          user_id: string
          vaccine_name: string
        }
        Insert: {
          administered_date?: string | null
          baby_id: string
          created_at?: string
          id?: string
          location?: string | null
          notes?: string | null
          reminder_sent?: boolean | null
          reminder_sent_date?: string | null
          scheduled_date: string
          updated_at?: string
          user_id: string
          vaccine_name: string
        }
        Update: {
          administered_date?: string | null
          baby_id?: string
          created_at?: string
          id?: string
          location?: string | null
          notes?: string | null
          reminder_sent?: boolean | null
          reminder_sent_date?: string | null
          scheduled_date?: string
          updated_at?: string
          user_id?: string
          vaccine_name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role:
        | { Args: never; Returns: boolean }
        | {
            Args: {
              _role: Database["public"]["Enums"]["app_role"]
              _user_id: string
            }
            Returns: boolean
          }
      send_vaccine_reminders: { Args: never; Returns: undefined }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
