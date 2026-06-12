import { SCHEMA_VERSION } from '../constants/quiz.constants'
import { createInitialState } from '../engine/quiz-engine'
import { QuizConfig, QuizPersistedState, ScreenId, SubmissionStatus } from '../models/quiz.types'

const SUBMISSION_STATUSES: SubmissionStatus[] = ['idle', 'submitting', 'success', 'error']

export function isValidPersistedState(
  value: unknown,
  config: QuizConfig,
  schemaVersion = SCHEMA_VERSION,
): value is QuizPersistedState {
  if (!value || typeof value !== 'object') return false

  const candidate = value as Record<string, unknown>

  if (candidate['schemaVersion'] !== schemaVersion) return false
  if (typeof candidate['currentScreenId'] !== 'string') return false
  if (!isKnownScreenId(candidate['currentScreenId'], config)) return false

  const path = candidate['path']
  if (!Array.isArray(path) || path.length === 0) return false
  if (!path.every(screenId => typeof screenId === 'string' && isKnownScreenId(screenId, config))) {
    return false
  }

  const answers = candidate['answers']
  if (
    answers !== null &&
    answers !== undefined &&
    (typeof answers !== 'object' || Array.isArray(answers))
  ) {
    return false
  }

  const track = candidate['track']
  if (track !== null && track !== undefined && track !== 'standard' && track !== 'advanced') {
    return false
  }

  const submissionStatus = candidate['submissionStatus']
  if (
    typeof submissionStatus !== 'string' ||
    !SUBMISSION_STATUSES.includes(submissionStatus as SubmissionStatus)
  ) {
    return false
  }

  return true
}

export function loadPersistedState(
  savedJson: string | null,
  config: QuizConfig,
): QuizPersistedState {
  if (!savedJson) return createInitialState(config)

  try {
    const parsed: unknown = JSON.parse(savedJson)
    if (!isValidPersistedState(parsed, config)) return createInitialState(config)

    return {
      ...createInitialState(config),
      ...parsed,
      path: parsed.path.filter(screenId => isKnownScreenId(screenId, config)),
    }
  } catch {
    return createInitialState(config)
  }
}

function isKnownScreenId(screenId: string, config: QuizConfig): screenId is ScreenId {
  return screenId in config.screens
}
