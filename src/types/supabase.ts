export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      bookmarks: {
        Row: {
          created_at: string | null
          id: number
          interaction_id: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          interaction_id?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          interaction_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'bookmarks_interaction_id_fkey'
            columns: ['interaction_id']
            referencedRelation: 'interactions'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'bookmarks_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      comments: {
        Row: {
          body: string
          id: number
          interaction_id: number | null
          reply_id: number | null
          user_id: string | null
          created_at: string | null
        }
        Insert: {
          body: string
          id?: number
          interaction_id?: number | null
          reply_id?: number | null
          user_id?: string | null
          created_at?: string | null
        }
        Update: {
          body?: string
          id?: number
          interaction_id?: number | null
          reply_id?: number | null
          user_id?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'comments_interaction_id_fkey'
            columns: ['interaction_id']
            referencedRelation: 'interactions'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'comments_reply_id_fkey'
            columns: ['reply_id']
            referencedRelation: 'comments'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'comments_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      interactions: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          media_url: string | null
          name: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          media_url?: string | null
          name?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          media_url?: string | null
          name?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'interactions_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      likes: {
        Row: {
          created_at: string | null
          id: number
          interaction_id: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          interaction_id?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          interaction_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'likes_interaction_id_fkey'
            columns: ['interaction_id']
            referencedRelation: 'interactions'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'likes_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey'
            columns: ['id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
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


export type Row<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type InsertDto<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type UpdateDto<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];


export type Bookmarks = Row<'bookmarks'>;
export type BookmarksInsertDto = InsertDto<'bookmarks'>;
export type BookmarksUpdateDto = UpdateDto<'bookmarks'>;

export type Comments = Row<'comments'>;
export type CommentsInsertDto = InsertDto<'comments'>;
export type CommentsUpdateDto = UpdateDto<'comments'>;

export type Interactions = Row<'interactions'>;
export type InteractionsInsertDto = InsertDto<'interactions'>;
export type InteractionsUpdateDto = UpdateDto<'interactions'>;

export type Likes = Row<'likes'>;
export type LikesInsertDto = InsertDto<'likes'>;
export type LikesUpdateDto = UpdateDto<'likes'>;


export type Profiles = Row<'profiles'>;
export type ProfilesInsertDto = InsertDto<'profiles'>;
export type ProfilesUpdateDto = UpdateDto<'profiles'>;

export type Tables = {
  bookmarks: Bookmarks
  comments: Comments
  interactions: Interactions
  likes: Likes
  profiles: Profiles
}