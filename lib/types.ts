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
      courses: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          level: string
          order_index: number
          thumbnail_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          level: string
          order_index: number
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          level?: string
          order_index?: number
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          display_name: string
          email: string
          id: string
          role: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name: string
          email: string
          id: string
          role?: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string
          email?: string
          id?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      sections: {
        Row: {
          course_id: string
          created_at: string | null
          description: string | null
          id: string
          order_index: number
          title: string
          updated_at: string | null
        }
        Insert: {
          course_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          order_index: number
          title: string
          updated_at?: string | null
        }
        Update: {
          course_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          order_index?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sections_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          id: string
          user_id: string
          video_id: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          user_id: string
          video_id: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          user_id?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      videos: {
        Row: {
          created_at: string | null
          description: string | null
          duration: number | null
          id: string
          is_preview: boolean | null
          order_index: number
          section_id: string
          title: string
          updated_at: string | null
          youtube_url: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration?: number | null
          id?: string
          is_preview?: boolean | null
          order_index: number
          section_id: string
          title: string
          updated_at?: string | null
          youtube_url: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration?: number | null
          id?: string
          is_preview?: boolean | null
          order_index?: number
          section_id?: string
          title?: string
          updated_at?: string | null
          youtube_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "videos_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id"]
          },
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

// 便利な型エイリアス
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Course = Database['public']['Tables']['courses']['Row']
export type Section = Database['public']['Tables']['sections']['Row']
export type Video = Database['public']['Tables']['videos']['Row']
export type UserProgress = Database['public']['Tables']['user_progress']['Row']

// レベルの型
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced'

// ロールの型
export type UserRole = 'user' | 'admin'

// ネストしたデータ型
export type SectionWithVideos = Section & {
  videos: Video[]
}

export type CourseWithSections = Course & {
  sections: SectionWithVideos[]
}
