import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core'
import { LabelsService } from '../../core/i18n/labels.service'
import { AutofocusDirective } from '../../shared/directives/autofocus.directive'
import { BackButtonComponent } from '../../shared/components/back-button/back-button.component'
import { OptionCardComponent } from '../../shared/components/option-card/option-card.component'
import { SegmentedProgressComponent } from '../../shared/components/segmented-progress/segmented-progress.component'
import { QuizScreen } from '../models/quiz.types'
import { ProgressService } from '../services/progress.service'
import { QuizStateService } from '../services/quiz-state.service'
import { getProgressLabelId, getScreenTitleId, getStepLabel } from './quiz-screen.helpers'

@Component({
  selector: 'app-single-select-screen',
  standalone: true,
  imports: [
    AutofocusDirective,
    BackButtonComponent,
    OptionCardComponent,
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
      <div class="options" role="radiogroup" [attr.aria-labelledby]="titleId()">
        @for (option of screen().options; track option.id; let index = $index) {
          <app-option-card
            selectionRole="radio"
            [label]="labels.translate(option.labelKey)"
            [description]="
              option.descriptionKey ? labels.translate(option.descriptionKey) : undefined
            "
            [selected]="isSelected(option.id)"
            [tabIndex]="optionTabIndex(option.id, index)"
            (selectedChange)="select(option.id)"
            (optionKeydown)="onOptionKeydown($event, index)"
          />
        }
      </div>
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
export class SingleSelectScreenComponent {
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

  // Explicit narrowing — single-select answers are always string, never string[].
  private readonly selectedOptionId = computed((): string | undefined => {
    const answer = this.quizState.getAnswer(this.screen().id)
    return typeof answer === 'string' ? answer : undefined
  })

  protected isSelected(optionId: string): boolean {
    return this.selectedOptionId() === optionId
  }

  protected optionTabIndex(optionId: string, index: number): number {
    const selected = this.selectedOptionId()
    return selected === optionId || (selected === undefined && index === 0) ? 0 : -1
  }

  protected select(optionId: string): void {
    this.quizState.selectSingleAnswer(this.screen().id, optionId)
  }

  protected onOptionKeydown(event: KeyboardEvent, index: number): void {
    if (!['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'].includes(event.key)) return

    event.preventDefault()
    const options = this.screen().options ?? []
    const direction = event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : -1
    const nextOption = options[(index + direction + options.length) % options.length]
    if (nextOption) this.select(nextOption.id)
  }
}
