import { Injectable, inject } from '@angular/core'
import { LabelsService } from '../../core/i18n/labels.service'
import { QuizScreen } from '../models/quiz.types'

export interface SegmentedProgress {
  total: number
  activeIndex: number
  show: boolean
}

export interface ProgressLabel {
  text: string
  show: boolean
}

@Injectable({ providedIn: 'root' })
export class ProgressService {
  private readonly labels = inject(LabelsService)

  getSegmentedProgress(screen: QuizScreen): SegmentedProgress {
    if (screen.segmentedProgress) {
      return { ...screen.segmentedProgress, show: true }
    }

    if (screen.progress) {
      return {
        total: screen.progress.total,
        activeIndex: screen.progress.current - 1,
        show: true,
      }
    }

    return { total: 0, activeIndex: 0, show: false }
  }

  getProgressLabel(screen: QuizScreen): ProgressLabel {
    if (!screen.progress) return { text: '', show: false }

    const base = screen.progress.label
      ? this.labels.translate('progress.advancedTrack', {
          current: screen.progress.current,
          total: screen.progress.total,
        })
      : this.labels.translate('progress.questionOf', {
          current: screen.progress.current,
          total: screen.progress.total,
        })

    const suffix =
      screen.kind === 'multi-select'
        ? ` • ${this.labels.translate('common.selectAllThatApply')}`
        : ''

    return { text: `${base}${suffix}`, show: true }
  }
}
