import { QUIZ_CONFIG } from '../config/quiz.config'
import { STORAGE_KEY } from '../constants/quiz.constants'
import { createInitialState } from '../engine/quiz-engine'
import { isValidPersistedState, loadPersistedState } from './quiz-state-persistence'

describe('quiz-state-persistence', () => {
  const config = QUIZ_CONFIG

  it('accepts a valid persisted payload', () => {
    const state = createInitialState(config)
    expect(isValidPersistedState(state, config)).toBe(true)
  })

  it('rejects schema version mismatches', () => {
    const state = { ...createInitialState(config), schemaVersion: 999 }
    expect(isValidPersistedState(state, config)).toBe(false)
  })

  it('rejects unknown screen ids on the path', () => {
    const state = {
      ...createInitialState(config),
      path: ['welcome', 'missing-screen' as 'welcome'],
    }
    expect(isValidPersistedState(state, config)).toBe(false)
  })

  it('rejects invalid submission status values', () => {
    const state = { ...createInitialState(config), submissionStatus: 'pending' }
    expect(isValidPersistedState(state, config)).toBe(false)
  })

  it('loads valid json from storage', () => {
    const state = {
      ...createInitialState(config),
      currentScreenId: 'interests' as const,
      path: ['welcome', 'experience-level', 'inspiration', 'interests'] as const,
      answers: { 'experience-level': 'beginner' },
    }

    const loaded = loadPersistedState(JSON.stringify(state), config)
    expect(loaded.currentScreenId).toBe('interests')
    expect(loaded.answers['experience-level']).toBe('beginner')
  })

  it('falls back to initial state for malformed json', () => {
    const loaded = loadPersistedState('{not-json', config)
    expect(loaded.currentScreenId).toBe(config.startScreenId)
  })

  it('uses the real storage key constant', () => {
    expect(STORAGE_KEY).toBe('nc-onboarding-quiz-state')
  })
})
