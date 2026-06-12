import { QUIZ_CONFIG } from '../config/quiz.config'
import {
  EXPERIENCE_LEVEL_SCREEN_ID,
  SCHEMA_VERSION,
  TRACK_BY_EXPERIENCE,
} from '../constants/quiz.constants'
import {
  BranchResolver,
  QuizAnswers,
  QuizConfig,
  QuizPersistedState,
  QuizScreen,
  ScreenId,
  TrackId,
} from '../models/quiz.types'

declare const ngDevMode: boolean | undefined

export function getScreen(screenId: ScreenId, config: QuizConfig = QUIZ_CONFIG): QuizScreen {
  const screen = config.screens[screenId]
  if (!screen) throw new Error(`Unknown screen: ${screenId}`)
  return screen
}

export function getTrackForScreen(
  screenId: ScreenId,
  answers: QuizAnswers,
  config: QuizConfig = QUIZ_CONFIG,
): TrackId | null {
  const experienceAnswer = answers[EXPERIENCE_LEVEL_SCREEN_ID]
  if (isExperienceOptionId(experienceAnswer)) {
    return TRACK_BY_EXPERIENCE[experienceAnswer]
  }
  return config.screens[screenId]?.track ?? null
}

export function getNextScreenId(
  currentScreenId: ScreenId,
  answers: QuizAnswers,
  config: QuizConfig = QUIZ_CONFIG,
): ScreenId | null {
  const screen = getScreen(currentScreenId, config)

  if (screen.branch.type === 'terminal') return null

  if (screen.kind === 'welcome' || screen.kind === 'inspiration') {
    return getScreenIdFromBranch(screen.branch, answers)
  }

  const answer = answers[currentScreenId]
  if (answer === undefined || (Array.isArray(answer) && answer.length === 0)) return null

  return getScreenIdFromBranch(screen.branch, answers)
}

function getScreenIdFromBranch(branch: BranchResolver, answers: QuizAnswers): ScreenId | null {
  switch (branch.type) {
    case 'static':
      return branch.target
    case 'terminal':
      return null
    case 'answer': {
      const answerValue = answers[branch.questionId]
      const selectedOptionId = Array.isArray(answerValue) ? answerValue[0] : answerValue
      const target = selectedOptionId !== undefined ? branch.map[selectedOptionId] : undefined
      if (!target && typeof ngDevMode !== 'undefined' && ngDevMode) {
        // eslint-disable-next-line no-console -- dev-only branch debugging via ngDevMode
        console.warn(
          `[quiz] Answer "${selectedOptionId}" has no branch target in screen "${branch.questionId}". ` +
            `Falling back to the first map entry.`,
        )
      }
      return target ?? Object.values(branch.map)[0] ?? null
    }
    case 'priority': {
      const selectedOptions = answers[branch.questionId]
      const selectedIds = Array.isArray(selectedOptions) ? selectedOptions : []
      for (const priorityOptionId of branch.priority) {
        if (selectedIds.includes(priorityOptionId)) {
          return branch.map[priorityOptionId] ?? null
        }
      }
      const fallbackOptionId = branch.priority[branch.priority.length - 1]
      return (fallbackOptionId !== undefined ? branch.map[fallbackOptionId] : undefined) ?? null
    }
  }
}

export function keepAnswersOnPathOnly(path: ScreenId[], answers: QuizAnswers): QuizAnswers {
  const screenIdsOnPath = new Set(path)
  const answersOnPath: QuizAnswers = {}

  for (const [screenId, answer] of Object.entries(answers) as [ScreenId, string | string[]][]) {
    if (screenIdsOnPath.has(screenId)) answersOnPath[screenId] = answer
  }

  return answersOnPath
}

export function createInitialState(config: QuizConfig = QUIZ_CONFIG): QuizPersistedState {
  return {
    schemaVersion: SCHEMA_VERSION,
    currentScreenId: config.startScreenId,
    path: [config.startScreenId],
    answers: {},
    track: null,
    submissionStatus: 'idle',
  }
}

type ExperienceOptionId = keyof typeof TRACK_BY_EXPERIENCE

function isExperienceOptionId(value: string | string[] | undefined): value is ExperienceOptionId {
  return typeof value === 'string' && value in TRACK_BY_EXPERIENCE
}
