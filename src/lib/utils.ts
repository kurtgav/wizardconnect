// ============================================
// UTILITY FUNCTIONS
// ============================================

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Format date and time to readable string
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Calculate time remaining from now to target date
 */
export function getTimeRemaining(targetDate: Date | string): {
  days: number
  hours: number
  minutes: number
  seconds: number
  isExpired: boolean
} {
  const target = typeof targetDate === 'string' ? new Date(targetDate) : targetDate
  const now = new Date()
  const diff = target.getTime() - now.getTime()

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true }
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return { days, hours, minutes, seconds, isExpired: false }
}

/**
 * Check if current date is within campaign phase
 */
export function getCampaignPhase(): 'survey_open' | 'survey_closed' | 'profile_update' | 'results_released' | 'before_launch' {
  const now = new Date()
  const dates = {
    surveyOpen: new Date('2026-02-05T00:00:00'),
    surveyClose: new Date('2026-02-10T23:59:59'),
    profileStart: new Date('2026-02-11T00:00:00'),
    profileEnd: new Date('2026-02-13T23:59:59'),
    results: new Date('2026-02-14T07:00:00'),
  }

  if (now < dates.surveyOpen) return 'before_launch'
  if (now >= dates.surveyOpen && now <= dates.surveyClose) return 'survey_open'
  if (now >= dates.profileStart && now <= dates.profileEnd) return 'profile_update'
  if (now >= dates.results) return 'results_released'
  return 'survey_closed'
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate Mapua student email
 */
export function isValidMapuaEmail(email: string): boolean {
  return email.endsWith('@mapua.edu.ph') || email.endsWith('@student.mapua.edu.ph')
}

/**
 * Truncate text to specified length
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

/**
 * Generate random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

/**
 * Sleep function for async delays
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Format compatibility score to percentage
 */
export function formatCompatibilityScore(score: number): string {
  return `${Math.round(score)}%`
}

/**
 * Get color based on compatibility score
 */
export function getCompatibilityColor(score: number): string {
  if (score >= 80) return '#22c55e' // green
  if (score >= 60) return '#eab308' // yellow
  if (score >= 40) return '#f97316' // orange
  return '#ef4444' // red
}

/**
 * Calculate age from birth date
 */
export function calculateAge(birthDate: Date | string): number {
  const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }

  return age
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Format phone number
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)

  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3]
  }

  return phone
}

/**
 * Check if date is within range
 */
export function isDateInRange(
  date: Date,
  startDate: Date,
  endDate: Date
): boolean {
  return date >= startDate && date <= endDate
}

/**
 * Parse JSON safely
 */
export function safeJsonParse<T = any>(str: string, fallback: T): T {
  try {
    return JSON.parse(str) as T
  } catch {
    return fallback
  }
}

/**
 * Local storage helpers
 */
export const storage = {
  get: <T = any>(key: string, fallback?: T): T | null => {
    if (typeof window === 'undefined') return fallback ?? null
    try {
      const item = localStorage.getItem(key)
      return item ? safeJsonParse(item, fallback as T) : fallback ?? null
    } catch {
      return fallback ?? null
    }
  },

  set: (key: string, value: any): void => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  },

  remove: (key: string): void => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(key)
  },

  clear: (): void => {
    if (typeof window === 'undefined') return
    localStorage.clear()
  },
}
