import { InjectionToken } from '@angular/core'
import { QuizConfig } from '../models/quiz.types'
import { validateQuizConfig } from '../engine/quiz-config-validator'
import { QUIZ_CONFIG } from './quiz.config'

export const QUIZ_CONFIG_TOKEN = new InjectionToken<QuizConfig>('QUIZ_CONFIG', {
  providedIn: 'root',
  factory: () => validateQuizConfig(QUIZ_CONFIG),
})
