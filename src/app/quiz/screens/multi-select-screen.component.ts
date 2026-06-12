import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core'
import { LabelsService } from '../../core/i18n/labels.service'
import { AutofocusDirective } from '../../shared/directives/autofocus.directive'
import { BackButtonComponent } from '../../shared/components/back-button/back-button.component'
import { OptionCardComponent } from '../../shared/components/option-card/option-card.component'
import { PrimaryButtonComponent } from '../../shared/components/primary-button/primary-button.component'
import { SegmentedProgressComponent } from '../../shared/components/segmented-progress/segmented-progress.component'
import { QuizScreen } from '../models/quiz.types'
import { ProgressService } from '../services/progress.service'
import { QuizStateService } from '../services/quiz-state.service'
import { getProgressLabelId, getScreenTitleId, getStepLabel } from './quiz-screen.helpers'

@Component({
  selector: 'app-multi-select-screen',
  standalone: true,
  imports: [
    AutofocusDirective,
    BackButtonComponent,
    OptionCardComponent,
    PrimaryButtonComponent,
    SegmentedProgressComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="screen screen--with-footer" [attr.aria-labelledby]="titleId()">
      @if (screen().showBack) {
        <app-back-button (pressed)="quizState.goBack()" />
      }
      @if (progressLabel().show) {
        <p class="progress-label" [id]="progressLabelId()">{{ progressLabel().text }}</p>
      }
      <h1 class="title" [id]="titleId()" tabindex="-1" appAutofocus>
        {{ labels.translate(screen().titleKey) }}
      </h1>
      <div class="options" role="group" [attr.aria-labelledby]="titleId()">
        @for (option of screen().options; track option.id; let index = $index) {
          <app-option-card
            selectionRole="checkbox"
            [label]="labels.translate(option.labelKey)"
            [description]="
              option.descriptionKey ? labels.translate(option.descriptionKey) : undefined
            "
            [showCheckbox]="true"
            [selected]="isSelected(option.id)"
            [tabIndex]="optionTabIndex(index)"
            (selectedChange)="quizState.toggleMultiAnswer(screen().id, option.id)"
            (optionKeydown)="onOptionKeydown($event, index)"
          />
        }
      </div>
      <app-primary-button
        [label]="labels.translate(screen().continueLabelKey ?? 'common.continue')"
        iconRight="arrow-right"
        [disabled]="!canContinue()"
        (pressed)="quizState.continueFromMultiSelect(screen().id)"
      />
      @if (segmentedProgress().show) {
        <app-segmented-progress
          class="screen-footer"
          [total]="segmentedProgress().total"
          [activeIndex]="segmentedProgress().activeIndex"
          [ariaLabel]="stepLabel()"
          [labelledById]="progressLabel().show ? progressLabelId() : null"
        />
      }
    </section>
  `,
})
export class MultiSelectScreenComponent {
  readonly screen = input.required<QuizScreen>()
  protected readonly labels = inject(LabelsService)
  protected readonly quizState = inject(QuizStateService)
  private readonly progress = inject(ProgressService)

  readonly titleId = computed(() => getScreenTitleId(this.screen().id))
  readonly progressLabelId = computed(() => getProgressLabelId(this.screen().id))
  readonly segmentedProgress = computed(() => this.progress.getSegmentedProgress(this.screen()))
  readonly progressLabel = computed(() => this.progress.getProgressLabel(this.screen()))
  readonly stepLabel = computed(() =>
    getStepLabel(this.labels, this.segmentedProgress().activeIndex, this.segmentedProgress().total),
  )

  private readonly selectedOptions = computed((): string[] => {
    const answer = this.quizState.getAnswer(this.screen().id)
    return Array.isArray(answer) ? answer : []
  })

  protected readonly canContinue = computed(() => this.selectedOptions().length > 0)

  protected isSelected(optionId: string): boolean {
    return this.selectedOptions().includes(optionId)
  }

  protected optionTabIndex(index: number): number {
    return index === 0 ? 0 : -1
  }

  protected onOptionKeydown(event: KeyboardEvent, index: number): void {
    const options = this.screen().options ?? []
    const currentOption = options[index]

    if ((event.key === ' ' || event.key === 'Enter') && currentOption) {
      event.preventDefault()
      this.quizState.toggleMultiAnswer(this.screen().id, currentOption.id)
      return
    }

    if (!['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'].includes(event.key)) return

    event.preventDefault()
    const direction = event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : -1
    const nextIndex = (index + direction + options.length) % options.length
    const optionButtons = (event.currentTarget as HTMLElement)
      .closest('.options')
      ?.querySelectorAll<HTMLButtonElement>('button.option-card')
    optionButtons?.[nextIndex]?.focus()
  }
}
