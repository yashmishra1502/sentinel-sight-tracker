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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      alerts: {
        Row: {
          acknowledged: boolean
          camera_code: string
          camera_id: string | null
          confidence: number
          created_at: string
          id: string
          location: string
          note: string
          severity: Database["public"]["Enums"]["alert_severity"]
          title: string
          vehicle_number: string
        }
        Insert: {
          acknowledged?: boolean
          camera_code?: string
          camera_id?: string | null
          confidence?: number
          created_at?: string
          id?: string
          location?: string
          note?: string
          severity?: Database["public"]["Enums"]["alert_severity"]
          title: string
          vehicle_number?: string
        }
        Update: {
          acknowledged?: boolean
          camera_code?: string
          camera_id?: string | null
          confidence?: number
          created_at?: string
          id?: string
          location?: string
          note?: string
          severity?: Database["public"]["Enums"]["alert_severity"]
          title?: string
          vehicle_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "alerts_camera_id_fkey"
            columns: ["camera_id"]
            isOneToOne: false
            referencedRelation: "cameras"
            referencedColumns: ["id"]
          },
        ]
      }
      cameras: {
        Row: {
          ai_active: boolean
          code: string
          created_at: string
          department: string
          district: string
          id: string
          last_heartbeat_at: string | null
          location: string
          map_x: number
          map_y: number
          name: string
          resolution: string
          status: Database["public"]["Enums"]["camera_status"]
          stream_type: Database["public"]["Enums"]["stream_type"]
          stream_url: string | null
          updated_at: string
        }
        Insert: {
          ai_active?: boolean
          code: string
          created_at?: string
          department?: string
          district?: string
          id?: string
          last_heartbeat_at?: string | null
          location?: string
          map_x?: number
          map_y?: number
          name: string
          resolution?: string
          status?: Database["public"]["Enums"]["camera_status"]
          stream_type?: Database["public"]["Enums"]["stream_type"]
          stream_url?: string | null
          updated_at?: string
        }
        Update: {
          ai_active?: boolean
          code?: string
          created_at?: string
          department?: string
          district?: string
          id?: string
          last_heartbeat_at?: string | null
          location?: string
          map_x?: number
          map_y?: number
          name?: string
          resolution?: string
          status?: Database["public"]["Enums"]["camera_status"]
          stream_type?: Database["public"]["Enums"]["stream_type"]
          stream_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      detections: {
        Row: {
          camera_code: string
          camera_id: string | null
          colour: string
          confidence: number
          created_at: string
          detected_at: string
          direction: string
          id: string
          location: string
          plate_confidence: number
          vehicle_number: string
          vehicle_type: string
        }
        Insert: {
          camera_code?: string
          camera_id?: string | null
          colour?: string
          confidence?: number
          created_at?: string
          detected_at?: string
          direction?: string
          id?: string
          location?: string
          plate_confidence?: number
          vehicle_number: string
          vehicle_type?: string
        }
        Update: {
          camera_code?: string
          camera_id?: string | null
          colour?: string
          confidence?: number
          created_at?: string
          detected_at?: string
          direction?: string
          id?: string
          location?: string
          plate_confidence?: number
          vehicle_number?: string
          vehicle_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "detections_camera_id_fkey"
            columns: ["camera_id"]
            isOneToOne: false
            referencedRelation: "cameras"
            referencedColumns: ["id"]
          },
        ]
      }
      watchlist: {
        Row: {
          added_by: string
          created_at: string
          id: string
          last_seen_at: string | null
          reason: string
          status: Database["public"]["Enums"]["watchlist_status"]
          vehicle_number: string
        }
        Insert: {
          added_by?: string
          created_at?: string
          id?: string
          last_seen_at?: string | null
          reason?: string
          status?: Database["public"]["Enums"]["watchlist_status"]
          vehicle_number: string
        }
        Update: {
          added_by?: string
          created_at?: string
          id?: string
          last_seen_at?: string | null
          reason?: string
          status?: Database["public"]["Enums"]["watchlist_status"]
          vehicle_number?: string
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
      alert_severity: "critical" | "high" | "medium" | "low" | "resolved"
      camera_status: "live" | "connecting" | "offline" | "no-signal" | "error"
      stream_type: "hls" | "mjpeg" | "mp4" | "webrtc"
      watchlist_status: "WATCH" | "STOLEN" | "WANTED" | "CLEARED"
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
      alert_severity: ["critical", "high", "medium", "low", "resolved"],
      camera_status: ["live", "connecting", "offline", "no-signal", "error"],
      stream_type: ["hls", "mjpeg", "mp4", "webrtc"],
      watchlist_status: ["WATCH", "STOLEN", "WANTED", "CLEARED"],
    },
  },
} as const
