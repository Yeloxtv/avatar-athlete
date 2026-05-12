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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      audit_xp: {
        Row: {
          created_at: string
          delta_agilite: number | null
          delta_endurance: number | null
          delta_force: number | null
          delta_mental: number | null
          delta_total: number | null
          id: string
          quest_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          delta_agilite?: number | null
          delta_endurance?: number | null
          delta_force?: number | null
          delta_mental?: number | null
          delta_total?: number | null
          id?: string
          quest_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          delta_agilite?: number | null
          delta_endurance?: number | null
          delta_force?: number | null
          delta_mental?: number | null
          delta_total?: number | null
          id?: string
          quest_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_xp_quest_id_fkey"
            columns: ["quest_id"]
            isOneToOne: false
            referencedRelation: "quests"
            referencedColumns: ["id"]
          },
        ]
      }
      badges: {
        Row: {
          condition_type: string
          condition_value: number
          created_at: string
          description: string | null
          emoji: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          condition_type: string
          condition_value: number
          created_at?: string
          description?: string | null
          emoji: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          condition_type?: string
          condition_value?: number
          created_at?: string
          description?: string | null
          emoji?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          created_at: string
          description: string | null
          equipment_tags: string[] | null
          estimated_duration_weeks: number | null
          id: string
          is_active: boolean | null
          is_published: boolean | null
          level_required: string | null
          owner_user_id: string | null
          slug: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          equipment_tags?: string[] | null
          estimated_duration_weeks?: number | null
          id?: string
          is_active?: boolean | null
          is_published?: boolean | null
          level_required?: string | null
          owner_user_id?: string | null
          slug: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          equipment_tags?: string[] | null
          estimated_duration_weeks?: number | null
          id?: string
          is_active?: boolean | null
          is_published?: boolean | null
          level_required?: string | null
          owner_user_id?: string | null
          slug?: string
          title?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_emoji: string | null
          created_at: string
          display_name: string | null
          id: string
          level: number | null
          stat_agilite: number | null
          stat_endurance: number | null
          stat_force: number | null
          stat_mental: number | null
          updated_at: string
          user_id: string
          xp_total: number | null
        }
        Insert: {
          avatar_emoji?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          level?: number | null
          stat_agilite?: number | null
          stat_endurance?: number | null
          stat_force?: number | null
          stat_mental?: number | null
          updated_at?: string
          user_id: string
          xp_total?: number | null
        }
        Update: {
          avatar_emoji?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          level?: number | null
          stat_agilite?: number | null
          stat_endurance?: number | null
          stat_force?: number | null
          stat_mental?: number | null
          updated_at?: string
          user_id?: string
          xp_total?: number | null
        }
        Relationships: []
      }
      quest_exercises: {
        Row: {
          created_at: string
          id: string
          name: string
          notes: string | null
          order_index: number
          quest_id: string
          target_reps: number | null
          sets_count: number | null
          target_weight: number | null  
          rest_seconds: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          notes?: string | null
          order_index: number
          quest_id: string
          target_reps?: number | null
          sets_count?: number | null
          target_weight?: number | null
          rest_seconds?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          notes?: string | null
          order_index?: number
          quest_id?: string
          target_reps?: number | null
          sets_count?: number | null
          target_weight?: number | null
          rest_seconds?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "quest_exercises_quest_id_fkey"
            columns: ["quest_id"]
            isOneToOne: false
            referencedRelation: "quests"
            referencedColumns: ["id"]
          },
        ]
      }
      quests: {
        Row: {
          campaign_id: string
          created_at: string
          day_of_week: number | null
          description: string | null
          equipment_tags: string[] | null
          estimated_duration_minutes: number | null
          id: string
          is_one_shot: boolean | null
          is_published: boolean | null
          level_required: string | null
          order_index: number
          rest_seconds: number | null
          rounds_target: number | null
          title: string
          total_minutes: number | null
          type: string
          work_seconds: number | null
          workout_type: string
          xp_agilite: number | null
          xp_endurance: number | null
          xp_force: number | null
          xp_mental: number | null
          xp_total: number | null
        }
        Insert: {
          campaign_id: string
          created_at?: string
          day_of_week?: number | null
          description?: string | null
          equipment_tags?: string[] | null
          estimated_duration_minutes?: number | null
          id?: string
          is_one_shot?: boolean | null
          is_published?: boolean | null
          level_required?: string | null
          order_index: number
          rest_seconds?: number | null
          rounds_target?: number | null
          title: string
          total_minutes?: number | null
          type: string
          work_seconds?: number | null
          workout_type: string
          xp_agilite?: number | null
          xp_endurance?: number | null
          xp_force?: number | null
          xp_mental?: number | null
          xp_total?: number | null
        }
        Update: {
          campaign_id?: string
          created_at?: string
          day_of_week?: number | null
          description?: string | null
          equipment_tags?: string[] | null
          estimated_duration_minutes?: number | null
          id?: string
          is_one_shot?: boolean | null
          is_published?: boolean | null
          level_required?: string | null
          order_index?: number
          rest_seconds?: number | null
          rounds_target?: number | null
          title?: string
          total_minutes?: number | null
          type?: string
          work_seconds?: number | null
          workout_type?: string
          xp_agilite?: number | null
          xp_endurance?: number | null
          xp_force?: number | null
          xp_mental?: number | null
          xp_total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "quests_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      session_rounds: {
        Row: {
          created_at: string
          duration_seconds: number | null
          id: string
          reps_total: number | null
          round_no: number
          session_id: string
        }
        Insert: {
          created_at?: string
          duration_seconds?: number | null
          id?: string
          reps_total?: number | null
          round_no: number
          session_id: string
        }
        Update: {
          created_at?: string
          duration_seconds?: number | null
          id?: string
          reps_total?: number | null
          round_no?: number
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_rounds_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "workout_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_badges: {
        Row: {
          badge_id: string
          id: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          badge_id: string
          id?: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          badge_id?: string
          id?: string
          unlocked_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_quests: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          quest_id: string
          status: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          quest_id: string
          status?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          quest_id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_quests_quest_id_fkey"
            columns: ["quest_id"]
            isOneToOne: false
            referencedRelation: "quests"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_sessions: {
        Row: {
          created_at: string
          ended_at: string | null
          id: string
          is_completed: boolean | null
          note: string | null
          quest_id: string
          rounds_completed: number | null
          started_at: string
          total_time_seconds: number | null
          user_id: string
          workout_type: string
        }
        Insert: {
          created_at?: string
          ended_at?: string | null
          id?: string
          is_completed?: boolean | null
          note?: string | null
          quest_id: string
          rounds_completed?: number | null
          started_at?: string
          total_time_seconds?: number | null
          user_id: string
          workout_type: string
        }
        Update: {
          created_at?: string
          ended_at?: string | null
          id?: string
          is_completed?: boolean | null
          quest_id?: string
          rounds_completed?: number | null
          started_at?: string
          total_time_seconds?: number | null
          user_id?: string
          workout_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_sessions_quest_id_fkey"
            columns: ["quest_id"]
            isOneToOne: false
            referencedRelation: "quests"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      complete_quest: {
        Args: { p_quest_id: string }
        Returns: Json
      }
      initialize_user_quests: {
        Args: { p_campaign_id: string; p_user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      user_quest_status: "locked" | "available" | "completed"
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
      user_quest_status: ["locked", "available", "completed"],
    },
  },
} as const
