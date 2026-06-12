import { TestBed } from '@angular/core/testing'
import { EXPERIENCE_LEVEL_SCREEN_ID, INTERESTS_SCREEN_ID } from '../constants/quiz.constants'
import { createInitialState } from '../engine/quiz-engine'
import { QuizPersistedState } from '../models/quiz.types'
import { ProfileSummaryService } from './profile-summary.service'

describe('ProfileSummaryService', () => {
  let service: ProfileSummaryService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(ProfileSummaryService)
  })

  it('builds the standard summary for beginner + design path', () => {
    const state: QuizPersistedState = {
      ...createInitialState(),
      answers: {
        [EXPERIENCE_LEVEL_SCREEN_ID]: 'beginner',
        [INTERESTS_SCREEN_ID]: ['design'],
        'design-preference': 'solo-designer',
      },
      path: ['welcome', 'experience-level', 'inspiration', 'interests', 'design-preference'],
    }

    const rows = service.resolveSummaryFields(service.buildStandardSummary(state))
    expect(rows.length).toBeGreaterThan(0)
    expect(rows.every(row => row.label.length > 0 && row.value.length > 0)).toBe(true)
  })

  it('builds the advanced summary from expertise and achievement answers', () => {
    const state: QuizPersistedState = {
      ...createInitialState(),
      track: 'advanced',
      answers: {
        expertise: 'system-architecture',
        achievement: 'maximize-impact',
      },
    }

    const summary = service.buildAdvancedSummary(state)
    expect(summary.focus.length).toBeGreaterThan(0)
    expect(summary.goal.length).toBeGreaterThan(0)
  })
})
