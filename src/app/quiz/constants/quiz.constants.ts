import { EnLabelKey } from '../../core/i18n/labels.en'
import { TrackId } from '../models/quiz.types'

export const STORAGE_KEY = 'nc-onboarding-quiz-state'

// Bump when persisted state shape changes
export const SCHEMA_VERSION = 1

// Screen IDs
export const WELCOME_SCREEN_ID = 'welcome'
export const EXPERIENCE_LEVEL_SCREEN_ID = 'experience-level'
export const INSPIRATION_SCREEN_ID = 'inspiration'
export const INTERESTS_SCREEN_ID = 'interests'
export const EXPERTISE_SCREEN_ID = 'expertise'
export const ACHIEVEMENT_SCREEN_ID = 'achievement'

export const TRACK_BY_EXPERIENCE: Record<'beginner' | 'intermediate' | 'advanced', TrackId> = {
  beginner: 'standard',
  intermediate: 'standard',
  advanced: 'advanced',
}

export const SPECIALIZATION_SCREENS = [
  'design-preference',
  'technical-focus',
  'primary-objective',
] as const

export const EXPERIENCE_SUMMARY_KEYS: Record<'beginner' | 'intermediate' | 'advanced', EnLabelKey> =
  {
    beginner: 'summaryValues.experience.beginner',
    intermediate: 'summaryValues.experience.intermediate',
    advanced: 'summaryValues.experience.advanced',
  }

export const INTEREST_SUMMARY_KEYS: Record<'design' | 'development' | 'strategy', EnLabelKey> = {
  design: 'summaryValues.interests.design',
  development: 'summaryValues.interests.development',
  strategy: 'summaryValues.interests.strategy',
}

// Key: `${screenId}:${optionId}`
export const SPECIALIZATION_SUMMARY_KEYS: Record<string, EnLabelKey> = {
  'design-preference:solo-designer': 'summaryValues.designPreference.solo-designer',
  'design-preference:team-collaboration': 'summaryValues.designPreference.team-collaboration',
  'technical-focus:frontend': 'summaryValues.technicalFocus.frontend',
  'technical-focus:backend': 'summaryValues.technicalFocus.backend',
  'primary-objective:growth': 'summaryValues.primaryObjective.growth',
  'primary-objective:efficiency': 'summaryValues.primaryObjective.efficiency',
}

export const EXPERTISE_FOCUS_KEYS: Record<string, EnLabelKey> = {
  'system-architecture': 'summaryFocus.systemArchitecture',
  'technical-leadership': 'summaryFocus.leadership',
  'research-innovation': 'summaryFocus.innovation',
}

export const ACHIEVEMENT_GOAL_KEYS: Record<string, EnLabelKey> = {
  'maximize-impact': 'summaryGoal.impact',
  'deep-mastery': 'summaryGoal.mastery',
  'drive-innovation': 'summaryGoal.innovation',
}
