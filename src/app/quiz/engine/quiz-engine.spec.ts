import { QUIZ_CONFIG } from '../config/quiz.config'
import {
  EXPERIENCE_LEVEL_SCREEN_ID,
  INTERESTS_SCREEN_ID,
  SCHEMA_VERSION,
} from '../constants/quiz.constants'
import {
  createInitialState,
  getNextScreenId,
  getScreen,
  getTrackForScreen,
  keepAnswersOnPathOnly,
} from './quiz-engine'

describe('quiz-engine', () => {
  const config = QUIZ_CONFIG

  describe('getScreen', () => {
    it('returns a known screen', () => {
      expect(getScreen('welcome', config).kind).toBe('welcome')
    })

    it('throws for an unknown screen', () => {
      expect(() => getScreen('missing' as never, config)).toThrowError('Unknown screen: missing')
    })
  })

  describe('createInitialState', () => {
    it('starts on the configured start screen', () => {
      const state = createInitialState(config)
      expect(state.currentScreenId).toBe('welcome')
      expect(state.path).toEqual(['welcome'])
      expect(state.answers).toEqual({})
      expect(state.track).toBeNull()
      expect(state.submissionStatus).toBe('idle')
      expect(state.schemaVersion).toBe(SCHEMA_VERSION)
    })
  })

  describe('getTrackForScreen', () => {
    it('returns standard for beginner experience', () => {
      expect(
        getTrackForScreen('interests', { [EXPERIENCE_LEVEL_SCREEN_ID]: 'beginner' }, config),
      ).toBe('standard')
    })

    it('returns advanced for advanced experience', () => {
      expect(
        getTrackForScreen('expertise', { [EXPERIENCE_LEVEL_SCREEN_ID]: 'advanced' }, config),
      ).toBe('advanced')
    })

    it('falls back to the screen track when no experience answer', () => {
      expect(getTrackForScreen('interests', {}, config)).toBe('standard')
    })

    it('returns null for screens with no track', () => {
      expect(getTrackForScreen('welcome', {}, config)).toBeNull()
    })
  })

  describe('getNextScreenId', () => {
    it('routes welcome to experience-level', () => {
      expect(getNextScreenId('welcome', {}, config)).toBe('experience-level')
    })

    it('routes beginner experience to inspiration', () => {
      expect(
        getNextScreenId('experience-level', { [EXPERIENCE_LEVEL_SCREEN_ID]: 'beginner' }, config),
      ).toBe('inspiration')
    })

    it('routes intermediate experience to inspiration', () => {
      expect(
        getNextScreenId(
          'experience-level',
          { [EXPERIENCE_LEVEL_SCREEN_ID]: 'intermediate' },
          config,
        ),
      ).toBe('inspiration')
    })

    it('routes advanced experience to expertise', () => {
      expect(
        getNextScreenId('experience-level', { [EXPERIENCE_LEVEL_SCREEN_ID]: 'advanced' }, config),
      ).toBe('expertise')
    })

    it('returns null when experience-level has no answer', () => {
      expect(getNextScreenId('experience-level', {}, config)).toBeNull()
    })

    it('routes inspiration to interests without requiring an answer', () => {
      expect(getNextScreenId('inspiration', {}, config)).toBe('interests')
    })

    it('returns null for multi-select with no selection', () => {
      expect(getNextScreenId('interests', {}, config)).toBeNull()
      expect(getNextScreenId('interests', { [INTERESTS_SCREEN_ID]: [] }, config)).toBeNull()
    })

    it('uses priority branching — design wins over development', () => {
      expect(
        getNextScreenId('interests', { [INTERESTS_SCREEN_ID]: ['development', 'design'] }, config),
      ).toBe('design-preference')
    })

    it('routes design-only interests to design-preference', () => {
      expect(getNextScreenId('interests', { [INTERESTS_SCREEN_ID]: ['design'] }, config)).toBe(
        'design-preference',
      )
    })

    it('routes development-only interests to technical-focus', () => {
      expect(getNextScreenId('interests', { [INTERESTS_SCREEN_ID]: ['development'] }, config)).toBe(
        'technical-focus',
      )
    })

    it('routes strategy-only interests to primary-objective', () => {
      expect(getNextScreenId('interests', { [INTERESTS_SCREEN_ID]: ['strategy'] }, config)).toBe(
        'primary-objective',
      )
    })

    it('routes specialisation screens to standard-completion', () => {
      expect(
        getNextScreenId('design-preference', { 'design-preference': 'solo-designer' }, config),
      ).toBe('standard-completion')
      expect(getNextScreenId('technical-focus', { 'technical-focus': 'frontend' }, config)).toBe(
        'standard-completion',
      )
      expect(getNextScreenId('primary-objective', { 'primary-objective': 'growth' }, config)).toBe(
        'standard-completion',
      )
    })

    it('returns null for terminal completion screens', () => {
      expect(getNextScreenId('standard-completion', {}, config)).toBeNull()
      expect(getNextScreenId('advanced-completion', {}, config)).toBeNull()
    })

    it('routes the advanced track through expertise → achievement → advanced-completion', () => {
      expect(getNextScreenId('expertise', { expertise: 'system-architecture' }, config)).toBe(
        'achievement',
      )
      expect(getNextScreenId('achievement', { achievement: 'deep-mastery' }, config)).toBe(
        'advanced-completion',
      )
    })
  })

  describe('keepAnswersOnPathOnly', () => {
    it('keeps only answers whose screenId is in the path', () => {
      const path: ['welcome', 'experience-level', 'inspiration'] = [
        'welcome',
        'experience-level',
        'inspiration',
      ]
      const answers = {
        'experience-level': 'beginner',
        interests: ['design'],
        'design-preference': 'solo-designer',
      }

      expect(keepAnswersOnPathOnly(path, answers)).toEqual({
        'experience-level': 'beginner',
      })
    })

    it('returns empty answers when the path is empty', () => {
      expect(keepAnswersOnPathOnly([], { 'experience-level': 'beginner' })).toEqual({})
    })

    it('returns all answers when every screen is on the path', () => {
      const answers = {
        'experience-level': 'beginner',
        inspiration: undefined,
        interests: ['design'],
      }
      const path: ['experience-level', 'inspiration', 'interests'] = [
        'experience-level',
        'inspiration',
        'interests',
      ]
      expect(keepAnswersOnPathOnly(path, answers)).toEqual(answers)
    })
  })
})
