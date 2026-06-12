import { QUIZ_CONFIG } from '../config/quiz.config'
import { QuizConfig, ScreenId } from '../models/quiz.types'
import { validateQuizConfig } from './quiz-config-validator'

describe('validateQuizConfig', () => {
  it('accepts the shipped quiz config', () => {
    expect(() => validateQuizConfig(QUIZ_CONFIG)).not.toThrow()
    expect(validateQuizConfig(QUIZ_CONFIG)).toBe(QUIZ_CONFIG)
  })

  it('rejects a screen key that does not match its id', () => {
    const invalid = {
      startScreenId: 'welcome',
      screens: {
        welcome: { ...QUIZ_CONFIG.screens['welcome'], id: 'mismatch' },
      },
    } as unknown as QuizConfig

    expect(() => validateQuizConfig(invalid)).toThrowError(
      'Quiz screen key "welcome" does not match its id "mismatch"',
    )
  })

  it('rejects answer branches that point to unknown screens', () => {
    const invalid = {
      startScreenId: 'broken',
      screens: {
        broken: {
          id: 'broken',
          kind: 'single-select',
          titleKey: 'screens.experienceLevel.title',
          options: [{ id: 'a', labelKey: 'options.experience.beginner.label' }],
          branch: {
            type: 'answer',
            questionId: 'broken',
            map: { a: 'missing-target' },
          },
        },
      },
    } as unknown as QuizConfig

    expect(() => validateQuizConfig(invalid)).toThrowError(
      'Unknown quiz screen "missing-target" referenced by branch target from "broken"',
    )
  })
})
