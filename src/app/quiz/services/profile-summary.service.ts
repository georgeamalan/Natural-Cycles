import { Injectable, inject } from '@angular/core'
import { LabelsService } from '../../core/i18n/labels.service'
import {
  ACHIEVEMENT_GOAL_KEYS,
  ACHIEVEMENT_SCREEN_ID,
  EXPERIENCE_LEVEL_SCREEN_ID,
  EXPERIENCE_SUMMARY_KEYS,
  EXPERTISE_FOCUS_KEYS,
  EXPERTISE_SCREEN_ID,
  INTERESTS_SCREEN_ID,
  INTEREST_SUMMARY_KEYS,
  SPECIALIZATION_SCREENS,
  SPECIALIZATION_SUMMARY_KEYS,
} from '../constants/quiz.constants'
import {
  AdvancedProfileSummary,
  ProfileSummaryField,
  ProfileSummaryRow,
  QuizPersistedState,
  ScreenId,
} from '../models/quiz.types'

@Injectable({ providedIn: 'root' })
export class ProfileSummaryService {
  private readonly labels = inject(LabelsService)

  buildStandardSummary(state: QuizPersistedState): ProfileSummaryField[] {
    const fields: ProfileSummaryField[] = []

    const experience = state.answers[EXPERIENCE_LEVEL_SCREEN_ID]
    if (typeof experience === 'string' && experience in EXPERIENCE_SUMMARY_KEYS) {
      fields.push({
        labelKey: 'summary.experienceLevel',
        valueKeys: [EXPERIENCE_SUMMARY_KEYS[experience as keyof typeof EXPERIENCE_SUMMARY_KEYS]],
      })
    }

    const interests = state.answers[INTERESTS_SCREEN_ID]
    if (Array.isArray(interests) && interests.length) {
      const valueKeys = interests
        .filter((id): id is keyof typeof INTEREST_SUMMARY_KEYS => id in INTEREST_SUMMARY_KEYS)
        .map(id => INTEREST_SUMMARY_KEYS[id])

      if (valueKeys.length) {
        fields.push({ labelKey: 'summary.interests', valueKeys })
      }
    }

    const specializationScreenId = this.getSpecializationScreenId(state.path)
    if (specializationScreenId) {
      const answer = state.answers[specializationScreenId]
      if (typeof answer === 'string') {
        const compositeKey = `${specializationScreenId}:${answer}`
        const valueKey = SPECIALIZATION_SUMMARY_KEYS[compositeKey]
        if (valueKey) {
          fields.push({ labelKey: 'summary.specialization', valueKeys: [valueKey] })
        }
      }
    }

    return fields
  }

  resolveSummaryFields(fields: ProfileSummaryField[]): ProfileSummaryRow[] {
    return fields.map(field => ({
      label: this.labels.translate(field.labelKey),
      value: field.valueKeys.map(key => this.labels.translate(key)).join(', '),
    }))
  }

  buildAdvancedSummary(state: QuizPersistedState): AdvancedProfileSummary {
    const expertiseAnswer = state.answers[EXPERTISE_SCREEN_ID]
    const achievementAnswer = state.answers[ACHIEVEMENT_SCREEN_ID]

    const expertiseId = typeof expertiseAnswer === 'string' ? expertiseAnswer : ''
    const achievementId = typeof achievementAnswer === 'string' ? achievementAnswer : ''

    const focusKey = EXPERTISE_FOCUS_KEYS[expertiseId] ?? 'summaryFocus.innovation'
    const goalKey = ACHIEVEMENT_GOAL_KEYS[achievementId] ?? 'summaryGoal.innovation'

    return {
      focus: this.labels.translate(focusKey),
      goal: this.labels.translate(goalKey),
    }
  }

  private getSpecializationScreenId(path: ScreenId[]): ScreenId | null {
    for (let index = path.length - 1; index >= 0; index--) {
      const screenId = path[index]
      if (
        screenId !== undefined &&
        SPECIALIZATION_SCREENS.includes(screenId as (typeof SPECIALIZATION_SCREENS)[number])
      ) {
        return screenId
      }
    }
    return null
  }
}
