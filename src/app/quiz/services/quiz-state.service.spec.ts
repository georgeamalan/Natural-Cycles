import { TestBed } from '@angular/core/testing'
import { EXPERIENCE_LEVEL_SCREEN_ID, STORAGE_KEY } from '../constants/quiz.constants'
import { QuizStateService } from './quiz-state.service'

describe('QuizStateService', () => {
  let service: QuizStateService

  beforeEach(() => {
    localStorage.removeItem(STORAGE_KEY)
    TestBed.configureTestingModule({})
    service = TestBed.inject(QuizStateService)
    service.startOver()
  })

  afterEach(() => {
    localStorage.removeItem(STORAGE_KEY)
  })

  it('starts on the welcome screen with an empty answer map', () => {
    expect(service.currentScreenId()).toBe('welcome')
    expect(service.answers()).toEqual({})
    expect(service.path()).toEqual(['welcome'])
  })

  it('persists answers and path to localStorage', () => {
    service.continueFromScreen('welcome')
    service.selectSingleAnswer('experience-level', 'beginner')

    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
    expect(saved.currentScreenId).toBe('inspiration')
    expect(saved.answers[EXPERIENCE_LEVEL_SCREEN_ID]).toBe('beginner')
    expect(saved.path).toEqual(['welcome', 'experience-level', 'inspiration'])
  })

  it('restores persisted progress when the service is created again', () => {
    service.continueFromScreen('welcome')
    service.selectSingleAnswer('experience-level', 'beginner')

    TestBed.resetTestingModule()
    TestBed.configureTestingModule({})
    const restored = TestBed.inject(QuizStateService)

    expect(restored.currentScreenId()).toBe('inspiration')
    expect(restored.getAnswer('experience-level')).toBe('beginner')
  })

  it('goBack returns to the previous screen on the path', () => {
    service.continueFromScreen('welcome')
    service.selectSingleAnswer('experience-level', 'beginner')
    service.goBack()

    expect(service.currentScreenId()).toBe('experience-level')
    expect(service.path()).toEqual(['welcome', 'experience-level'])
  })

  it('re-routes and prunes downstream answers when experience changes', () => {
    service.continueFromScreen('welcome')
    service.selectSingleAnswer('experience-level', 'beginner')
    service.goBack()
    service.selectSingleAnswer('experience-level', 'advanced')

    expect(service.currentScreenId()).toBe('expertise')
    expect(service.getAnswer('experience-level')).toBe('advanced')
    expect(service.getAnswer('inspiration')).toBeUndefined()
    expect(service.path()).toEqual(['welcome', 'experience-level', 'expertise'])
    expect(service.track()).toBe('advanced')
  })

  it('clears persisted state on startOver', () => {
    service.continueFromScreen('welcome')
    service.selectSingleAnswer('experience-level', 'advanced')
    service.startOver()

    expect(service.currentScreenId()).toBe('welcome')
    expect(localStorage.getItem(STORAGE_KEY)).toContain('"currentScreenId":"welcome"')
  })

  it('ignores invalid persisted payloads', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        schemaVersion: 999,
        currentScreenId: 'welcome',
        path: ['welcome'],
        answers: {},
        track: null,
        submissionStatus: 'idle',
      }),
    )

    TestBed.resetTestingModule()
    TestBed.configureTestingModule({})
    const restored = TestBed.inject(QuizStateService)

    expect(restored.currentScreenId()).toBe('welcome')
    expect(restored.answers()).toEqual({})
  })
})
