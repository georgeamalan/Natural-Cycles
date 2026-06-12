import { Injectable, computed, inject, signal } from '@angular/core'
import { QUIZ_CONFIG_TOKEN } from '../config/quiz-config.token'
import { STORAGE_KEY } from '../constants/quiz.constants'
import {
  createInitialState,
  getNextScreenId,
  getScreen,
  getTrackForScreen,
  keepAnswersOnPathOnly,
} from '../engine/quiz-engine'
import { QuizAnswers, QuizPersistedState, ScreenId, SubmissionStatus } from '../models/quiz.types'
import { loadPersistedState } from './quiz-state-persistence'

@Injectable({ providedIn: 'root' })
export class QuizStateService {
  private readonly config = inject(QUIZ_CONFIG_TOKEN)
  private readonly state = signal<QuizPersistedState>(this.loadSavedState())

  readonly currentScreenId = computed(() => this.state().currentScreenId)
  readonly path = computed(() => this.state().path)
  readonly answers = computed(() => this.state().answers)
  readonly track = computed(() => this.state().track)
  readonly submissionStatus = computed(() => this.state().submissionStatus)
  readonly currentScreen = computed(() => getScreen(this.currentScreenId(), this.config))
  readonly currentState = computed(() => this.state())

  getAnswer(screenId: ScreenId): string | string[] | undefined {
    return this.state().answers[screenId]
  }

  continueFromScreen(screenId: ScreenId): void {
    const nextScreenId = getNextScreenId(screenId, this.state().answers, this.config)
    if (!nextScreenId) return
    this.goToScreen(nextScreenId)
  }

  selectSingleAnswer(screenId: ScreenId, optionId: string): void {
    this.saveAnswerAndUpdatePath(screenId, optionId)
    const nextScreenId = getNextScreenId(screenId, this.state().answers, this.config)
    if (nextScreenId) this.goToScreen(nextScreenId)
  }

  toggleMultiAnswer(screenId: ScreenId, optionId: string): void {
    const currentAnswer = this.getAnswer(screenId)
    const selectedOptionIds = Array.isArray(currentAnswer) ? [...currentAnswer] : []
    const optionIndex = selectedOptionIds.indexOf(optionId)

    if (optionIndex >= 0) selectedOptionIds.splice(optionIndex, 1)
    else selectedOptionIds.push(optionId)

    this.saveAnswerAndUpdatePath(screenId, selectedOptionIds)
  }

  continueFromMultiSelect(screenId: ScreenId): void {
    const answer = this.getAnswer(screenId)
    if (!Array.isArray(answer) || answer.length === 0) return

    const nextScreenId = getNextScreenId(screenId, this.state().answers, this.config)
    if (nextScreenId) this.goToScreen(nextScreenId)
  }

  goBack(): void {
    const updatedPath = [...this.state().path]
    if (updatedPath.length <= 1) return

    updatedPath.pop()
    const previousScreenId = updatedPath[updatedPath.length - 1]
    if (!previousScreenId) return

    this.saveStateUpdate({
      currentScreenId: previousScreenId,
      path: updatedPath,
      track: getTrackForScreen(previousScreenId, this.state().answers, this.config),
      submissionStatus: 'idle',
    })
  }

  startOver(): void {
    this.state.set(createInitialState(this.config))
    this.saveToStorage()
  }

  setSubmissionStatus(status: SubmissionStatus): void {
    this.saveStateUpdate({ submissionStatus: status })
  }

  private saveAnswerAndUpdatePath(screenId: ScreenId, answer: string | string[]): void {
    const updatedPath = [...this.state().path]
    const screenIndexOnPath = updatedPath.indexOf(screenId)

    if (screenIndexOnPath === -1) updatedPath.push(screenId)
    else updatedPath.splice(screenIndexOnPath + 1)

    const updatedAnswers: QuizAnswers = { ...this.state().answers, [screenId]: answer }
    const answersOnPath = keepAnswersOnPathOnly(updatedPath, updatedAnswers)

    this.saveStateUpdate({
      path: updatedPath,
      answers: answersOnPath,
      track: getTrackForScreen(screenId, answersOnPath, this.config),
      currentScreenId: screenId,
      submissionStatus: 'idle',
    })
  }

  private goToScreen(nextScreenId: ScreenId): void {
    const updatedPath = [...this.state().path]
    if (updatedPath[updatedPath.length - 1] !== nextScreenId) updatedPath.push(nextScreenId)

    const answersOnPath = keepAnswersOnPathOnly(updatedPath, this.state().answers)

    this.saveStateUpdate({
      currentScreenId: nextScreenId,
      path: updatedPath,
      answers: answersOnPath,
      track: getTrackForScreen(nextScreenId, answersOnPath, this.config),
    })
  }

  private saveStateUpdate(changes: Partial<QuizPersistedState>): void {
    this.state.update(currentState => ({ ...currentState, ...changes }))
    this.saveToStorage()
  }

  private loadSavedState(): QuizPersistedState {
    if (typeof localStorage === 'undefined') return createInitialState(this.config)
    return loadPersistedState(localStorage.getItem(STORAGE_KEY), this.config)
  }

  private saveToStorage(): void {
    if (typeof localStorage === 'undefined') return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state()))
  }
}
