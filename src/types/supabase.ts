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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      _ChatMessageToLink: {
        Row: {
          A: string
          B: string
        }
        Insert: {
          A: string
          B: string
        }
        Update: {
          A?: string
          B?: string
        }
        Relationships: [
          {
            foreignKeyName: "_ChatMessageToLink_A_fkey"
            columns: ["A"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "_ChatMessageToLink_B_fkey"
            columns: ["B"]
            isOneToOne: false
            referencedRelation: "links"
            referencedColumns: ["id"]
          },
        ]
      }
      _prisma_migrations: {
        Row: {
          applied_steps_count: number
          checksum: string
          finished_at: string | null
          id: string
          logs: string | null
          migration_name: string
          rolled_back_at: string | null
          started_at: string
        }
        Insert: {
          applied_steps_count?: number
          checksum: string
          finished_at?: string | null
          id: string
          logs?: string | null
          migration_name: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Update: {
          applied_steps_count?: number
          checksum?: string
          finished_at?: string | null
          id?: string
          logs?: string | null
          migration_name?: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Relationships: []
      }
      accounts: {
        Row: {
          accessToken: string | null
          accessTokenExpiresAt: string | null
          accountId: string
          createdAt: string
          id: string
          idToken: string | null
          password: string | null
          providerId: string
          refreshToken: string | null
          refreshTokenExpiresAt: string | null
          scope: string | null
          updatedAt: string
          userId: string
        }
        Insert: {
          accessToken?: string | null
          accessTokenExpiresAt?: string | null
          accountId: string
          createdAt: string
          id: string
          idToken?: string | null
          password?: string | null
          providerId: string
          refreshToken?: string | null
          refreshTokenExpiresAt?: string | null
          scope?: string | null
          updatedAt: string
          userId: string
        }
        Update: {
          accessToken?: string | null
          accessTokenExpiresAt?: string | null
          accountId?: string
          createdAt?: string
          id?: string
          idToken?: string | null
          password?: string | null
          providerId?: string
          refreshToken?: string | null
          refreshTokenExpiresAt?: string | null
          scope?: string | null
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "accounts_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          chatId: string
          content: string
          createdAt: string
          id: string
          role: Database["public"]["Enums"]["MessageRole"]
        }
        Insert: {
          chatId: string
          content: string
          createdAt?: string
          id: string
          role: Database["public"]["Enums"]["MessageRole"]
        }
        Update: {
          chatId?: string
          content?: string
          createdAt?: string
          id?: string
          role?: Database["public"]["Enums"]["MessageRole"]
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_chatId_fkey"
            columns: ["chatId"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
        ]
      }
      chats: {
        Row: {
          createdAt: string
          id: string
          title: string | null
          updatedAt: string
          userId: string
        }
        Insert: {
          createdAt?: string
          id: string
          title?: string | null
          updatedAt: string
          userId: string
        }
        Update: {
          createdAt?: string
          id?: string
          title?: string | null
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "chats_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      link_contents: {
        Row: {
          chunkIndex: number
          content: string
          createdAt: string
          embedding: string | null
          id: string
          linkId: string
        }
        Insert: {
          chunkIndex: number
          content: string
          createdAt?: string
          embedding?: string | null
          id: string
          linkId: string
        }
        Update: {
          chunkIndex?: number
          content?: string
          createdAt?: string
          embedding?: string | null
          id?: string
          linkId?: string
        }
        Relationships: [
          {
            foreignKeyName: "link_contents_linkId_fkey"
            columns: ["linkId"]
            isOneToOne: false
            referencedRelation: "links"
            referencedColumns: ["id"]
          },
        ]
      }
      links: {
        Row: {
          contentType: Database["public"]["Enums"]["ContentType"]
          createdAt: string
          description: string | null
          domain: string
          favicon: string
          id: string
          ingestFailureReason:
            | Database["public"]["Enums"]["IngestFailureReason"]
            | null
          ingestStatus: Database["public"]["Enums"]["IngestStatus"]
          storagePath: string | null
          thumbnail: string | null
          title: string
          url: string
          userId: string
        }
        Insert: {
          contentType?: Database["public"]["Enums"]["ContentType"]
          createdAt?: string
          description?: string | null
          domain: string
          favicon: string
          id: string
          ingestFailureReason?:
            | Database["public"]["Enums"]["IngestFailureReason"]
            | null
          ingestStatus?: Database["public"]["Enums"]["IngestStatus"]
          storagePath?: string | null
          thumbnail?: string | null
          title: string
          url: string
          userId: string
        }
        Update: {
          contentType?: Database["public"]["Enums"]["ContentType"]
          createdAt?: string
          description?: string | null
          domain?: string
          favicon?: string
          id?: string
          ingestFailureReason?:
            | Database["public"]["Enums"]["IngestFailureReason"]
            | null
          ingestStatus?: Database["public"]["Enums"]["IngestStatus"]
          storagePath?: string | null
          thumbnail?: string | null
          title?: string
          url?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "links_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      post_reactions: {
        Row: {
          created_at: string
          id: string
          post_id: string
          post_slug: string
          reaction_type: string
          session_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          post_slug: string
          reaction_type: string
          session_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          post_slug?: string
          reaction_type?: string
          session_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      processed_stripe_events: {
        Row: {
          id: string
          receivedAt: string
          type: string
        }
        Insert: {
          id: string
          receivedAt?: string
          type: string
        }
        Update: {
          id?: string
          receivedAt?: string
          type?: string
        }
        Relationships: []
      }
      sessions: {
        Row: {
          createdAt: string
          expiresAt: string
          id: string
          ipAddress: string | null
          token: string
          updatedAt: string
          userAgent: string | null
          userId: string
        }
        Insert: {
          createdAt: string
          expiresAt: string
          id: string
          ipAddress?: string | null
          token: string
          updatedAt: string
          userAgent?: string | null
          userId: string
        }
        Update: {
          createdAt?: string
          expiresAt?: string
          id?: string
          ipAddress?: string | null
          token?: string
          updatedAt?: string
          userAgent?: string | null
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          cancelAtPeriodEnd: boolean
          compUntil: string | null
          currentPeriodEnd: string | null
          currentPeriodStart: string | null
          id: string
          planKey: Database["public"]["Enums"]["PlanKey"]
          status: Database["public"]["Enums"]["SubStatus"]
          stripeCustomerId: string | null
          stripePriceId: string | null
          stripeSubscriptionId: string | null
          trialEndingNotifiedAt: string | null
          trialEndsAt: string | null
          updatedAt: string
          userId: string
        }
        Insert: {
          cancelAtPeriodEnd?: boolean
          compUntil?: string | null
          currentPeriodEnd?: string | null
          currentPeriodStart?: string | null
          id: string
          planKey?: Database["public"]["Enums"]["PlanKey"]
          status?: Database["public"]["Enums"]["SubStatus"]
          stripeCustomerId?: string | null
          stripePriceId?: string | null
          stripeSubscriptionId?: string | null
          trialEndingNotifiedAt?: string | null
          trialEndsAt?: string | null
          updatedAt: string
          userId: string
        }
        Update: {
          cancelAtPeriodEnd?: boolean
          compUntil?: string | null
          currentPeriodEnd?: string | null
          currentPeriodStart?: string | null
          id?: string
          planKey?: Database["public"]["Enums"]["PlanKey"]
          status?: Database["public"]["Enums"]["SubStatus"]
          stripeCustomerId?: string | null
          stripePriceId?: string | null
          stripeSubscriptionId?: string | null
          trialEndingNotifiedAt?: string | null
          trialEndsAt?: string | null
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      usage_events: {
        Row: {
          createdAt: string
          id: string
          kind: Database["public"]["Enums"]["UsageKind"]
          meta: Json | null
          userId: string
        }
        Insert: {
          createdAt?: string
          id: string
          kind: Database["public"]["Enums"]["UsageKind"]
          meta?: Json | null
          userId: string
        }
        Update: {
          createdAt?: string
          id?: string
          kind?: Database["public"]["Enums"]["UsageKind"]
          meta?: Json | null
          userId?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          createdAt: string
          email: string
          emailVerified: boolean
          id: string
          image: string | null
          name: string
          updatedAt: string
        }
        Insert: {
          createdAt: string
          email: string
          emailVerified: boolean
          id: string
          image?: string | null
          name: string
          updatedAt: string
        }
        Update: {
          createdAt?: string
          email?: string
          emailVerified?: boolean
          id?: string
          image?: string | null
          name?: string
          updatedAt?: string
        }
        Relationships: []
      }
      verifications: {
        Row: {
          createdAt: string | null
          expiresAt: string
          id: string
          identifier: string
          updatedAt: string | null
          value: string
        }
        Insert: {
          createdAt?: string | null
          expiresAt: string
          id: string
          identifier: string
          updatedAt?: string | null
          value: string
        }
        Update: {
          createdAt?: string | null
          expiresAt?: string
          id?: string
          identifier?: string
          updatedAt?: string | null
          value?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      match_link_chunks:
        | {
            Args: {
              match_count: number
              p_content_type?: string
              p_user_id: string
              query_embedding: string
            }
            Returns: {
              link_id: string
              similarity: number
            }[]
          }
        | {
            Args: {
              match_count: number
              p_content_type?: string
              p_date_from?: string
              p_date_to?: string
              p_user_id: string
              query_embedding: string
            }
            Returns: {
              link_id: string
              similarity: number
            }[]
          }
    }
    Enums: {
      ContentType: "WEB" | "YOUTUBE" | "PDF" | "AUDIO"
      IngestFailureReason:
        | "SCRAPE_FAILED"
        | "LINK_NOT_FOUND"
        | "OTHER"
        | "EXTRACTION_LIMIT"
      IngestStatus:
        | "PENDING"
        | "PROCESSING"
        | "COMPLETED"
        | "FAILED"
        | "SKIPPED"
      MessageRole: "USER" | "ASSISTANT"
      PlanKey: "FREE" | "PRO" | "PRO_TRIAL"
      SubStatus: "TRIALING" | "ACTIVE" | "PAST_DUE" | "CANCELED" | "INCOMPLETE"
      UsageKind: "SAVE" | "EXTRACT" | "CHAT_MSG"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>]

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
      ContentType: ["WEB", "YOUTUBE", "PDF", "AUDIO"],
      IngestFailureReason: [
        "SCRAPE_FAILED",
        "LINK_NOT_FOUND",
        "OTHER",
        "EXTRACTION_LIMIT",
      ],
      IngestStatus: ["PENDING", "PROCESSING", "COMPLETED", "FAILED", "SKIPPED"],
      MessageRole: ["USER", "ASSISTANT"],
      PlanKey: ["FREE", "PRO", "PRO_TRIAL"],
      SubStatus: ["TRIALING", "ACTIVE", "PAST_DUE", "CANCELED", "INCOMPLETE"],
      UsageKind: ["SAVE", "EXTRACT", "CHAT_MSG"],
    },
  },
} as const
