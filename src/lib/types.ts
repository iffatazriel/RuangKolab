export type UserRole = 'student' | 'moderator' | 'admin'
export type PostType = 'competition' | 'project'
export type PostStatus = 'open' | 'full' | 'closed'
export type RequestStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled'
export type PublishStatus = 'draft' | 'pending' | 'published'
export type ReportTarget = 'user' | 'post' | 'competition'
export type ReportStatus = 'pending' | 'reviewed' | 'resolved'

export type Database = {
  public: {
    Tables: {
      campuses: {
        Row: { id: string; nama: string; kota: string; created_at: string }
        Insert: { id?: string; nama: string; kota: string; created_at?: string }
        Update: { id?: string; nama?: string; kota?: string; created_at?: string }
        Relationships: []
      }
      users: {
        Row: {
          id: string
          nama: string
          campus_id: string
          jurusan: string | null
          angkatan: number | null
          bio: string | null
          portofolio_url: string | null
          role: UserRole
          created_at: string
        }
        Insert: {
          id: string
          nama: string
          campus_id: string
          jurusan?: string | null
          angkatan?: number | null
          bio?: string | null
          portofolio_url?: string | null
          role?: UserRole
          created_at?: string
        }
        Update: {
          id?: string
          nama?: string
          campus_id?: string
          jurusan?: string | null
          angkatan?: number | null
          bio?: string | null
          portofolio_url?: string | null
          role?: UserRole
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_campus_id_fkey"
            columns: ["campus_id"]
            isOneToOne: false
            referencedRelation: "campuses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_contacts: {
        Row: { user_id: string; whatsapp: string }
        Insert: { user_id: string; whatsapp: string }
        Update: { user_id?: string; whatsapp?: string }
        Relationships: [
          {
            foreignKeyName: "user_contacts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: { id: string; nama: string }
        Insert: { id?: string; nama: string }
        Update: { id?: string; nama?: string }
        Relationships: []
      }
      user_skills: {
        Row: { user_id: string; skill_id: string }
        Insert: { user_id: string; skill_id: string }
        Update: { user_id?: string; skill_id?: string }
        Relationships: [
          {
            foreignKeyName: "user_skills_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      competitions: {
        Row: {
          id: string
          campus_id: string | null
          created_by: string | null
          judul: string
          penyelenggara: string | null
          kategori: string | null
          tingkat: string | null
          deadline: string
          biaya: number
          url: string
          poster_url: string | null
          deskripsi: string | null
          publish_status: PublishStatus
          created_at: string
        }
        Insert: {
          id?: string
          campus_id?: string | null
          created_by?: string | null
          judul: string
          penyelenggara?: string | null
          kategori?: string | null
          tingkat?: string | null
          deadline: string
          biaya?: number
          url: string
          poster_url?: string | null
          deskripsi?: string | null
          publish_status?: PublishStatus
          created_at?: string
        }
        Update: {
          id?: string
          campus_id?: string | null
          created_by?: string | null
          judul?: string
          penyelenggara?: string | null
          kategori?: string | null
          tingkat?: string | null
          deadline?: string
          biaya?: number
          url?: string
          poster_url?: string | null
          deskripsi?: string | null
          publish_status?: PublishStatus
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "competitions_campus_id_fkey"
            columns: ["campus_id"]
            isOneToOne: false
            referencedRelation: "campuses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competitions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      team_posts: {
        Row: {
          id: string
          owner_id: string
          competition_id: string | null
          tipe: PostType
          judul: string
          deskripsi: string
          slot_total: number
          slot_terisi: number
          status: PostStatus
          komitmen: string | null
          repo_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          competition_id?: string | null
          tipe: PostType
          judul: string
          deskripsi: string
          slot_total: number
          slot_terisi?: number
          status?: PostStatus
          komitmen?: string | null
          repo_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          competition_id?: string | null
          tipe?: PostType
          judul?: string
          deskripsi?: string
          slot_total?: number
          slot_terisi?: number
          status?: PostStatus
          komitmen?: string | null
          repo_url?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_posts_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_posts_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
        ]
      }
      post_skills: {
        Row: { post_id: string; skill_id: string }
        Insert: { post_id: string; skill_id: string }
        Update: { post_id?: string; skill_id?: string }
        Relationships: [
          {
            foreignKeyName: "post_skills_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "team_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      join_requests: {
        Row: {
          id: string
          post_id: string
          user_id: string
          pesan: string | null
          status: RequestStatus
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          pesan?: string | null
          status?: RequestStatus
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          pesan?: string | null
          status?: RequestStatus
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "join_requests_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "team_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "join_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      competition_favorites: {
        Row: { user_id: string; competition_id: string; created_at: string }
        Insert: { user_id: string; competition_id: string; created_at?: string }
        Update: { user_id?: string; competition_id?: string; created_at?: string }
        Relationships: [
          {
            foreignKeyName: "competition_favorites_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          tipe: string
          payload: Record<string, unknown>
          link: string | null
          dibaca: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tipe: string
          payload?: Record<string, unknown>
          link?: string | null
          dibaca?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tipe?: string
          payload?: Record<string, unknown>
          link?: string | null
          dibaca?: boolean
          created_at?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          id: string
          reporter_id: string | null
          target_type: ReportTarget
          target_id: string
          alasan: string
          status: ReportStatus
          created_at: string
        }
        Insert: {
          id?: string
          reporter_id?: string | null
          target_type: ReportTarget
          target_id: string
          alasan: string
          status?: ReportStatus
          created_at?: string
        }
        Update: {
          id?: string
          reporter_id?: string | null
          target_type?: ReportTarget
          target_id?: string
          alasan?: string
          status?: ReportStatus
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      user_role: UserRole
      post_type: PostType
      post_status: PostStatus
      request_status: RequestStatus
      publish_status: PublishStatus
      report_target: ReportTarget
      report_status: ReportStatus
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type User = Tables<'users'>
export type Campus = Tables<'campuses'>
export type Skill = Tables<'skills'>
export type Competition = Tables<'competitions'>
export type TeamPost = Tables<'team_posts'>
export type JoinRequest = Tables<'join_requests'>
export type Report = Tables<'reports'>
