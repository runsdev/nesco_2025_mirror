export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      deadlines: {
        Row: {
          created_at: string
          deadline: string | null
          id: number
        }
        Insert: {
          created_at?: string
          deadline?: string | null
          id?: number
        }
        Update: {
          created_at?: string
          deadline?: string | null
          id?: number
        }
        Relationships: []
      }
      logs: {
        Row: {
          code: string | null
          created_at: string
          details: string | null
          flag: string | null
          hint: string | null
          id: number
          message: string | null
          raw: string | null
        }
        Insert: {
          code?: string | null
          created_at?: string
          details?: string | null
          flag?: string | null
          hint?: string | null
          id?: number
          message?: string | null
          raw?: string | null
        }
        Update: {
          code?: string | null
          created_at?: string
          details?: string | null
          flag?: string | null
          hint?: string | null
          id?: number
          message?: string | null
          raw?: string | null
        }
        Relationships: []
      }
      registrations: {
        Row: {
          competition: Database["public"]["Enums"]["competition_type"]
          id: number
          team_id: string
          verified: boolean
        }
        Insert: {
          competition: Database["public"]["Enums"]["competition_type"]
          id?: never
          team_id: string
          verified?: boolean
        }
        Update: {
          competition?: Database["public"]["Enums"]["competition_type"]
          id?: never
          team_id?: string
          verified?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "registrations_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      seminar_registrants: {
        Row: {
          created_at: string
          email: string | null
          id: string
          instance: string | null
          name: string | null
          seminar_id: number | null
          user_id: string
          wa_handle: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          instance?: string | null
          name?: string | null
          seminar_id?: number | null
          user_id: string
          wa_handle?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          instance?: string | null
          name?: string | null
          seminar_id?: number | null
          user_id?: string
          wa_handle?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seminar_registrants_seminar_id_fkey"
            columns: ["seminar_id"]
            isOneToOne: false
            referencedRelation: "seminars"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seminar_registrants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "seminar_registrants_with_users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      seminars: {
        Row: {
          created_at: string
          end_time: string | null
          id: number
          key_speaker: string | null
          moderator: string | null
          place: string | null
          quota: number | null
          seminar_end: string | null
          seminar_start: string | null
          start_time: string | null
          theme: string | null
          title: string | null
        }
        Insert: {
          created_at?: string
          end_time?: string | null
          id?: number
          key_speaker?: string | null
          moderator?: string | null
          place?: string | null
          quota?: number | null
          seminar_end?: string | null
          seminar_start?: string | null
          start_time?: string | null
          theme?: string | null
          title?: string | null
        }
        Update: {
          created_at?: string
          end_time?: string | null
          id?: number
          key_speaker?: string | null
          moderator?: string | null
          place?: string | null
          quota?: number | null
          seminar_end?: string | null
          seminar_start?: string | null
          start_time?: string | null
          theme?: string | null
          title?: string | null
        }
        Relationships: []
      }
      submission_verifies: {
        Row: {
          created_at: string
          id: number
          submission_id: string | null
          team_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          submission_id?: string | null
          team_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          submission_id?: string | null
          team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "submission_verifies_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submission_verifies_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      submissions: {
        Row: {
          created_at: string
          id: string
          originality: string | null
          submission: string | null
          submission_2: string | null
          submitted_at_1: string | null
          submitted_at_2: string | null
          submitted_at_3: string | null
          team_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          originality?: string | null
          submission?: string | null
          submission_2?: string | null
          submitted_at_1?: string | null
          submitted_at_2?: string | null
          submitted_at_3?: string | null
          team_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          originality?: string | null
          submission?: string | null
          submission_2?: string | null
          submitted_at_1?: string | null
          submitted_at_2?: string | null
          submitted_at_3?: string | null
          team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "submissions_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_files: {
        Row: {
          folder_id: string | null
          id: string
          instagram_follow: string
          payment: string
          photo: string
          student_card: string
          team_id: string
          twibbon: string
        }
        Insert: {
          folder_id?: string | null
          id?: string
          instagram_follow: string
          payment: string
          photo: string
          student_card: string
          team_id: string
          twibbon: string
        }
        Update: {
          folder_id?: string | null
          id?: string
          instagram_follow?: string
          payment?: string
          photo?: string
          student_card?: string
          team_id?: string
          twibbon?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_files_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: true
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_links: {
        Row: {
          created_at: string
          drive_link: string
          id: number
          team_id: string | null
        }
        Insert: {
          created_at?: string
          drive_link: string
          id?: number
          team_id?: string | null
        }
        Update: {
          created_at?: string
          drive_link?: string
          id?: number
          team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_link_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          id: string
          name: string
          team_id: string | null
        }
        Insert: {
          id?: string
          name: string
          team_id?: string | null
        }
        Update: {
          id?: string
          name?: string
          team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          competition: Database["public"]["Enums"]["competition_type"]
          contact: string | null
          created_at: string | null
          email: string | null
          id: string
          institution: string
          leader: string | null
          team_name: string
          verified: boolean | null
        }
        Insert: {
          competition: Database["public"]["Enums"]["competition_type"]
          contact?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          institution: string
          leader?: string | null
          team_name: string
          verified?: boolean | null
        }
        Update: {
          competition?: Database["public"]["Enums"]["competition_type"]
          contact?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          institution?: string
          leader?: string | null
          team_name?: string
          verified?: boolean | null
        }
        Relationships: []
      }
    }
    Views: {
      seminar_registrants_with_users: {
        Row: {
          registrant_created_at: string | null
          registrant_id: string | null
          registrant_instance: string | null
          registrant_name: string | null
          registrant_wa_handle: string | null
          user_created_at: string | null
          user_email: string | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      count_remaining_quota: {
        Args: { idseminar: number }
        Returns: number
      }
      email_exists: {
        Args: { target_email: string }
        Returns: boolean
      }
    }
    Enums: {
      competition_type:
        | "Paper Competition"
        | "Innovation Challenge"
        | "Poster Competition 1 Karya"
        | "Scientific Debate"
        | "Seminar"
        | "Poster Competition 2 Karya"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      competition_type: [
        "Paper Competition",
        "Innovation Challenge",
        "Poster Competition 1 Karya",
        "Scientific Debate",
        "Seminar",
        "Poster Competition 2 Karya",
      ],
    },
  },
} as const
