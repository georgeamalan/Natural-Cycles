import { LabelsService } from '../../core/i18n/labels.service'
import { QuizScreen, ScreenId } from '../models/quiz.types'

export function getScreenTitleId(screenId: ScreenId): string {
  return `screen-title-${screenId}`
}

export function getProgressLabelId(screenId: ScreenId): string {
  return `screen-progress-${screenId}`
}

export function getStepLabel(
  labels: LabelsService,
  activeIndex: number,
  totalSegments: number,
): string {
  return labels.translate('progress.stepOf', {
    current: activeIndex + 1,
    total: totalSegments,
  })
}

export function getScreenSubtitle(labels: LabelsService, screen: QuizScreen): string | undefined {
  return screen.subtitleKey ? labels.translate(screen.subtitleKey) : undefined
}
