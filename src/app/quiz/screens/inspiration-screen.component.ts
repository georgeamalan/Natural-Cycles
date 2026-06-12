import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core'
import { LabelsService } from '../../core/i18n/labels.service'
import { AutofocusDirective } from '../../shared/directives/autofocus.directive'
import { BackButtonComponent } from '../../shared/components/back-button/back-button.component'
import { PrimaryButtonComponent } from '../../shared/components/primary-button/primary-button.component'
import { SegmentedProgressComponent } from '../../shared/components/segmented-progress/segmented-progress.component'
import { QuizScreen } from '../models/quiz.types'
import { ProgressService } from '../services/progress.service'
import { QuizStateService } from '../services/quiz-state.service'
import { QuotePanelComponent } from './quote-panel.component'
import { getScreenTitleId, getStepLabel } from './quiz-screen.helpers'

@Component({
  selector: 'app-inspiration-screen',
  standalone: true,
  imports: [
    AutofocusDirective,
    BackButtonComponent,
    PrimaryButtonComponent,
    QuotePanelComponent,
    SegmentedProgressComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="screen screen--with-footer" [attr.aria-labelledby]="titleId()">
      @if (screen().showBack) {
        <app-back-button (pressed)="quizState.goBack()" />
      }
      <h1 class="title" [id]="titleId()" tabindex="-1" appAutofocus>
        {{ labels.translate(screen().titleKey) }}
      </h1>
      <app-quote-panel />
      <app-primary-button
        [label]="labels.translate(screen().continueLabelKey ?? 'common.continue')"
        iconRight="arrow-right"
        (pressed)="quizState.continueFromScreen(screen().id)"
      />
      @if (segmentedProgress().show) {
        <app-segmented-progress
          class="screen-footer"
          [total]="segmentedProgress().total"
          [activeIndex]="segmentedProgress().activeIndex"
          [ariaLabel]="stepLabel()"
        />
      }
    </section>
  `,
})
export class InspirationScreenComponent {
  readonly screen = input.required<QuizScreen>()
  protected readonly labels = inject(LabelsService)
  protected readonly quizState = inject(QuizStateService)
  private readonly progress = inject(ProgressService)

  readonly titleId = computed(() => getScreenTitleId(this.screen().id))
  readonly segmentedProgress = computed(() => this.progress.getSegmentedProgress(this.screen()))
  readonly stepLabel = computed(() =>
    getStepLabel(this.labels, this.segmentedProgress().activeIndex, this.segmentedProgress().total),
  )
}
