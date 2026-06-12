import { EnLabelKey } from '../../core/i18n/labels.en'

export type ScreenKind =
  | 'welcome'
  | 'single-select'
  | 'multi-select'
  | 'inspiration'
  | 'completion'
  | 'advanced-completion'

export type TrackId = 'standard' | 'advanced'

export type SubmissionStatus = 'idle' | 'submitting' | 'success' | 'error'

export type ScreenId =
  | 'welcome'
  | 'experience-level'
  | 'inspiration'
  | 'interests'
  | 'design-preference'
  | 'technical-focus'
  | 'primary-objective'
  | 'standard-completion'
  | 'expertise'
  | 'achievement'
  | 'advanced-completion'

export type QuizAnswers = Partial<Record<ScreenId, string | string[]>>

export interface QuizOption {
  id: string
  labelKey: EnLabelKey
  descriptionKey?: EnLabelKey
}

export type BranchResolver =
  | { type: 'static'; target: ScreenId }
  | { type: 'terminal' }
  | { type: 'answer'; questionId: ScreenId; map: Record<string, ScreenId> }
  | {
      type: 'priority'
      questionId: ScreenId
      priority: string[]
      map: Record<string, ScreenId>
    }

export interface ScreenProgress {
  current: number
  total: number
  /** When set to `'advanced'`, the progress label uses the advanced track copy. */
  label?: 'advanced'
}

export interface SegmentedProgressConfig {
  total: number
  activeIndex: number
}

export interface QuizScreen {
  id: ScreenId
  kind: ScreenKind
  titleKey: EnLabelKey
  subtitleKey?: EnLabelKey
  track?: TrackId
  progress?: ScreenProgress
  segmentedProgress?: SegmentedProgressConfig
  options?: QuizOption[]
  continueLabelKey?: EnLabelKey
  showBack?: boolean
  /** Config-driven bullet points shown on the advanced-completion screen. */
  resourceBulletKeys?: EnLabelKey[]
  branch: BranchResolver
}

export interface QuizConfig {
  startScreenId: ScreenId
  screens: Record<ScreenId, QuizScreen>
}

export interface QuizPersistedState {
  schemaVersion: number
  currentScreenId: ScreenId
  path: ScreenId[]
  answers: QuizAnswers
  track: TrackId | null
  submissionStatus: SubmissionStatus
}

export interface ProfileSummaryField {
  labelKey: EnLabelKey
  valueKeys: EnLabelKey[]
}

export interface ProfileSummaryRow {
  label: string
  value: string
}

export interface AdvancedProfileSummary {
  focus: string
  goal: string
}

export interface SubmissionPayload {
  track: TrackId | null
  path: ScreenId[]
  answers: QuizAnswers
  profileSummary: ProfileSummaryRow[]
  submittedAt: string
  advancedProfile?: AdvancedProfileSummary
}
