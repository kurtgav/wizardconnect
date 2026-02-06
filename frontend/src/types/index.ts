// ============================================
// WIZARD CONNECT - TYPE DEFINITIONS
// ============================================

// Database Types (Generated from Supabase)
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
      users: {
        Row: User
        Insert: UserInsert
        Update: UserUpdate
      }
      campaigns: {
        Row: Campaign
        Insert: CampaignInsert
        Update: CampaignUpdate
      }
      survey_responses: {
        Row: SurveyResponse
        Insert: SurveyResponseInsert
        Update: SurveyResponseUpdate
      }
      crush_lists: {
        Row: CrushList
        Insert: CrushListInsert
        Update: CrushListUpdate
      }
      matches: {
        Row: Match
        Insert: MatchInsert
        Update: MatchUpdate
      }
      messages: {
        Row: Message
        Insert: MessageInsert
        Update: MessageUpdate
      }
    }
  }
}

// User Types
export interface User {
  id: string
  email: string
  google_id?: string
  first_name?: string
  last_name?: string
  year?: string
  major?: string
  college?: string
  gender?: string
  seeking_gender?: string
  profile_photo_url?: string
  bio?: string
  instagram_handle?: string
  phone_number?: string
  contact_preference?: 'email' | 'phone' | 'instagram'
  profile_visibility?: 'public' | 'matches_only' | 'private'
  created_at: string
  updated_at: string
}

export type UserInsert = Omit<User, 'id' | 'created_at' | 'updated_at'>
export type UserUpdate = Partial<UserInsert>

// Campaign Types
export interface Campaign {
  id: string
  name: string
  survey_open_date: string
  survey_close_date: string
  profile_update_start_date?: string
  profile_update_end_date?: string
  results_release_date?: string
  is_active: boolean
  total_participants: number
  total_matches_generated: number
  algorithm_version?: string
  config?: Json
  created_at: string
  updated_at: string
}

export type CampaignInsert = Omit<Campaign, 'id' | 'created_at' | 'updated_at'>
export type CampaignUpdate = Partial<CampaignInsert>

// Survey Response Types
export interface SurveyResponse {
  id: string
  user_id: string
  campaign_id: string
  question_id: string
  question_category?: string
  response_value: Json
  response_score?: number
  submitted_at: string
}

export type SurveyResponseInsert = Omit<SurveyResponse, 'id' | 'submitted_at'>
export type SurveyResponseUpdate = Partial<SurveyResponseInsert>

// Crush List Types
export interface CrushList {
  id: string
  user_id: string
  campaign_id: string
  crush_email: string
  crush_name?: string
  is_matched: boolean
  is_mutual: boolean
  nudge_sent: boolean
  created_at: string
}

export type CrushListInsert = Omit<CrushList, 'id' | 'created_at'>
export type CrushListUpdate = Partial<CrushListInsert>

// Match Types
export interface Match {
  id: string
  campaign_id: string
  user_a_id: string
  user_b_id: string
  compatibility_score: number
  rank_for_a?: number
  rank_for_b?: number
  is_mutual_crush: boolean
  user_a_viewed: boolean
  user_b_viewed: boolean
  user_a_contacted: boolean
  user_b_contacted: boolean
  messaging_unlocked: boolean
  created_at: string
}

export type MatchInsert = Omit<Match, 'id' | 'created_at'>
export type MatchUpdate = Partial<MatchInsert>

// Message Types
export interface Message {
  id: string
  match_id: string
  sender_id: string
  recipient_id: string
  content: string
  is_read: boolean
  sent_at: string
  read_at?: string
}

export type MessageInsert = Omit<Message, 'id' | 'sent_at'>
export type MessageUpdate = Partial<MessageInsert>

// Domain Types

export interface SurveyQuestion {
  id: string
  category: 'demographics' | 'personality' | 'values' | 'lifestyle' | 'interests'
  text: string
  type: 'multiple_choice' | 'scale' | 'multi_select' | 'text' | 'crush_list'
  options?: SurveyOption[]
  weight: number
  scoring_method: 'similarity' | 'complement' | 'match'
  required: boolean
}

export interface SurveyOption {
  value: string
  label: string
  score?: number
}

export interface SurveyState {
  responses: Record<string, any>
  currentStep: number
  isComplete: boolean
  isSaving: boolean
}

export interface MatchWithUser extends Match {
  user: User
  shared_interests?: string[]
}

export interface CampaignStats {
  totalParticipants: number
  totalMatches: number
  completionRate: number
  genderDistribution: Record<string, number>
  yearDistribution: Record<string, number>
  majorDistribution: Record<string, number>
}

// API Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface AuthUser {
  id: string
  email: string
  firstName?: string
  lastName?: string
}

// UI Types
export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  duration?: number
}

export interface ModalState {
  isOpen: boolean
  title: string
  content: React.ReactNode
  onConfirm?: () => void
  onCancel?: () => void
}

// Constants
export const CAMPAIGN_DATES = {
  SURVEY_OPEN: new Date('2026-02-05T00:00:00'),
  SURVEY_CLOSE: new Date('2026-02-10T23:59:59'),
  PROFILE_UPDATE_START: new Date('2026-02-11T00:00:00'),
  PROFILE_UPDATE_END: new Date('2026-02-13T23:59:59'),
  RESULTS_RELEASE: new Date('2026-02-14T07:00:00'),
} as const

export const MAPUA_INFO = {
  COLLEGE_NAME: 'Mapua Malayan Colleges Laguna',
  COLORS: {
    RED: '#D32F2F',
    BLUE: '#1976D2',
    RED_LIGHT: '#FF6B6B',
    BLUE_LIGHT: '#64B5F6',
  },
  DOMAIN: '@mapua.edu.ph' // Example domain
} as const
