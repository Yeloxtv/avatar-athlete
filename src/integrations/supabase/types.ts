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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      campaigns: {
        Row: {
          created_at: string
          description: string | null
          equipment_tags: string[] | null
          estimated_duration_weeks: number | null
          id: string
          is_active: boolean | null
          is_published: boolean | null
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
          owner_user_id?: string | null
          slug?: string
          title?: string
        }
        Relationships: []
      }
      chests: {
        Row: {
          cards_count: number
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          prob_common: number
          prob_epic: number
          prob_legendary: number
          prob_rare: number
          slug: string
        }
        Insert: {
          cards_count?: number
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          prob_common?: number
          prob_epic?: number
          prob_legendary?: number
          prob_rare?: number
          slug: string
        }
        Update: {
          cards_count?: number
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          prob_common?: number
          prob_epic?: number
          prob_legendary?: number
          prob_rare?: number
          slug?: string
        }
        Relationships: []
      }
      collectibles: {
        Row: {
          base_value: number
          category: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          rarity: string
          slug: string
          upgrade_cost: number
        }
        Insert: {
          base_value?: number
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          rarity?: string
          slug: string
          upgrade_cost?: number
        }
        Update: {
          base_value?: number
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          rarity?: string
          slug?: string
          upgrade_cost?: number
        }
        Relationships: []
      }
      exercise_logs: {
        Row: {
          completed_at: string | null
          created_at: string | null
          exercise_id: string | null
          exercise_name: string | null
          global_exercise_id: string | null
          id: string
          reps_completed: number
          session_id: string | null
          set_number: number
          weight_used: number | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          exercise_id?: string | null
          exercise_name?: string | null
          global_exercise_id?: string | null
          id?: string
          reps_completed: number
          session_id?: string | null
          set_number: number
          weight_used?: number | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          exercise_id?: string | null
          exercise_name?: string | null
          global_exercise_id?: string | null
          id?: string
          reps_completed?: number
          session_id?: string | null
          set_number?: number
          weight_used?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "exercise_logs_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "quest_exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_logs_global_exercise_id_fkey"
            columns: ["global_exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_logs_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "workout_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      exercises: {
        Row: {
          body_part: string | null
          created_at: string | null
          created_by: string | null
          difficulty: string | null
          equipment: string | null
          external_id: string | null
          gif_url: string | null
          id: string
          image_url: string | null
          instructions: string[] | null
          is_custom: boolean
          name: string
          name_fr: string | null
          secondary_muscles: string[] | null
          target_muscle: string
          video_url: string | null
        }
        Insert: {
          body_part?: string | null
          created_at?: string | null
          created_by?: string | null
          difficulty?: string | null
          equipment?: string | null
          external_id?: string | null
          gif_url?: string | null
          id?: string
          image_url?: string | null
          instructions?: string[] | null
          is_custom?: boolean
          name: string
          name_fr?: string | null
          secondary_muscles?: string[] | null
          target_muscle: string
          video_url?: string | null
        }
        Update: {
          body_part?: string | null
          created_at?: string | null
          created_by?: string | null
          difficulty?: string | null
          equipment?: string | null
          external_id?: string | null
          gif_url?: string | null
          id?: string
          image_url?: string | null
          instructions?: string[] | null
          is_custom?: boolean
          name?: string
          name_fr?: string | null
          secondary_muscles?: string[] | null
          target_muscle?: string
          video_url?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_emoji: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
          user_mode: string | null
        }
        Insert: {
          avatar_emoji?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
          user_mode?: string | null
        }
        Update: {
          avatar_emoji?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
          user_mode?: string | null
        }
        Relationships: []
      }
      quest_exercises: {
        Row: {
          created_at: string
          exercise_id: string | null
          id: string
          name: string
          notes: string | null
          order_index: number
          quest_id: string
          rest_seconds: number | null
          sets_count: number | null
          superset_group: number | null
          target_reps: number | null
          target_weight: number | null
        }
        Insert: {
          created_at?: string
          exercise_id?: string | null
          id?: string
          name: string
          notes?: string | null
          order_index: number
          quest_id: string
          rest_seconds?: number | null
          sets_count?: number | null
          superset_group?: number | null
          target_reps?: number | null
          target_weight?: number | null
        }
        Update: {
          created_at?: string
          exercise_id?: string | null
          id?: string
          name?: string
          notes?: string | null
          order_index?: number
          quest_id?: string
          rest_seconds?: number | null
          sets_count?: number | null
          superset_group?: number | null
          target_reps?: number | null
          target_weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "quest_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
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
          order_index: number
          rest_seconds: number | null
          rest_time_seconds: number | null
          sets_count: number | null
          title: string
          total_minutes: number | null
          type: string
          work_seconds: number | null
          workout_type: string
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
          order_index: number
          rest_seconds?: number | null
          rest_time_seconds?: number | null
          sets_count?: number | null
          title: string
          total_minutes?: number | null
          type: string
          work_seconds?: number | null
          workout_type: string
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
          order_index?: number
          rest_seconds?: number | null
          rest_time_seconds?: number | null
          sets_count?: number | null
          title?: string
          total_minutes?: number | null
          type?: string
          work_seconds?: number | null
          workout_type?: string
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
      user_chests: {
        Row: {
          chest_id: string
          created_at: string
          id: string
          opened_at: string | null
          session_id: string | null
          source: string
          status: string
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          chest_id: string
          created_at?: string
          id?: string
          opened_at?: string | null
          session_id?: string | null
          source?: string
          status?: string
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          chest_id?: string
          created_at?: string
          id?: string
          opened_at?: string | null
          session_id?: string | null
          source?: string
          status?: string
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_chests_chest_id_fkey"
            columns: ["chest_id"]
            isOneToOne: false
            referencedRelation: "chests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_chests_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "workout_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_collectibles: {
        Row: {
          card_level: number
          collectible_id: string
          copies: number
          id: string
          obtained_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          card_level?: number
          collectible_id: string
          copies?: number
          id?: string
          obtained_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          card_level?: number
          collectible_id?: string
          copies?: number
          id?: string
          obtained_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_collectibles_collectible_id_fkey"
            columns: ["collectible_id"]
            isOneToOne: false
            referencedRelation: "collectibles"
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
          note?: string | null
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
      complete_quest: { Args: { p_quest_id: string }; Returns: Json }
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
