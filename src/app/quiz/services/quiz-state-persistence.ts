import { SCHEMA_VERSION } from '../constants/quiz.constants'
import { createInitialState, getNextScreenId, getTrackForScreen } from '../engine/quiz-engine'
import {
  QuizAnswers,
  QuizConfig,
  QuizPersistedState,
  QuizScreen,
  ScreenId,
  SubmissionStatus,
} from '../models/quiz.types'

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
  if (path[0] !== config.startScreenId) return false
  if (path[path.length - 1] !== candidate['currentScreenId']) return false

  const answers = candidate['answers']
  if (!isValidAnswers(answers, config)) return false
  if (
    !path.every(
      screenId => answers[screenId] !== undefined || !requiresAnswer(config.screens[screenId]),
    )
  ) {
    return false
  }
  if (!pathTransitionsAreValid(path, answers, config)) return false

  const track = candidate['track']
  if (track !== null && track !== undefined && track !== 'standard' && track !== 'advanced') {
    return false
  }
  if (track !== getTrackForScreen(candidate['currentScreenId'], answers, config)) return false

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

function isValidAnswers(value: unknown, config: QuizConfig): value is QuizAnswers {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false

  for (const [screenId, answer] of Object.entries(value)) {
    if (!isKnownScreenId(screenId, config)) return false

    const screen = config.screens[screenId]
    const optionIds = new Set((screen.options ?? []).map(option => option.id))

    if (screen.kind === 'single-select') {
      if (typeof answer !== 'string' || !optionIds.has(answer)) return false
    } else if (screen.kind === 'multi-select') {
      if (
        !Array.isArray(answer) ||
        answer.length === 0 ||
        !answer.every(optionId => typeof optionId === 'string' && optionIds.has(optionId))
      ) {
        return false
      }
    } else {
      return false
    }
  }

  return true
}

function requiresAnswer(screen: QuizScreen): boolean {
  return screen.kind === 'single-select' || screen.kind === 'multi-select'
}

function pathTransitionsAreValid(
  path: ScreenId[],
  answers: QuizAnswers,
  config: QuizConfig,
): boolean {
  return path.slice(0, -1).every((screenId, index) => {
    return getNextScreenId(screenId, answers, config) === path[index + 1]
  })
}
