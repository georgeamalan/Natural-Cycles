import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core'
import { LabelsService } from '../../core/i18n/labels.service'
import { AutofocusDirective } from '../../shared/directives/autofocus.directive'
import { BackButtonComponent } from '../../shared/components/back-button/back-button.component'
import { IconComponent } from '../../shared/icons/icon.component'
import { SuccessBadgeComponent } from '../../shared/icons/success-badge.component'
import { QuizScreen } from '../models/quiz.types'
import { ProfileSummaryService } from '../services/profile-summary.service'
import { QuizStateService } from '../services/quiz-state.service'
import { SubmitQuizService } from '../services/submit-quiz.service'
import { QuizCompletionActionsComponent } from './completion-actions.component'
import { getScreenSubtitle, getScreenTitleId } from './quiz-screen.helpers'

@Component({
  selector: 'app-completion-screen',
  standalone: true,
  imports: [
    AutofocusDirective,
    BackButtonComponent,
    SuccessBadgeComponent,
    IconComponent,
    QuizCompletionActionsComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="screen screen--completion" [attr.aria-labelledby]="titleId()">
      @if (screen().showBack) {
        <app-back-button (pressed)="quizState.goBack()" />
      }
      <div class="success-header">
        <app-success-badge [size]="48" [ariaLabel]="labels.translate('common.success')" />
        <h1 class="title title--center" [id]="titleId()" tabindex="-1" appAutofocus>
          {{ labels.translate(screen().titleKey) }}
        </h1>
        @if (subtitle(); as text) {
          <p class="subtitle subtitle--center">{{ text }}</p>
        }
      </div>

      <div class="summary-panel">
        <h2 class="summary-panel__title">
          <app-icon name="user" [size]="20" />
          <span>{{ labels.translate('screens.standardCompletion.summaryTitle') }}</span>
        </h2>
        <div class="summary-items">
          @for (field of summaryFields(); track field.label) {
            <div class="summary-item">
              <span class="summary-item__label">{{ field.label }}</span>
              <span class="summary-item__value">{{ field.value }}</span>
            </div>
          }
        </div>
      </div>

      <app-quiz-completion-actions
        [status]="quizState.submissionStatus()"
        (submitQuiz)="submitQuizService.submit()"
        (startOver)="quizState.startOver()"
      />
    </section>
  `,
})
export class CompletionScreenComponent {
  readonly screen = input.required<QuizScreen>()
  protected readonly labels = inject(LabelsService)
  protected readonly quizState = inject(QuizStateService)
  protected readonly submitQuizService = inject(SubmitQuizService)
  private readonly profileSummary = inject(ProfileSummaryService)

  readonly titleId = computed(() => getScreenTitleId(this.screen().id))
  readonly subtitle = computed(() => getScreenSubtitle(this.labels, this.screen()))
  readonly summaryFields = computed(() =>
    this.profileSummary.resolveSummaryFields(
      this.profileSummary.buildStandardSummary(this.quizState.currentState()),
    ),
  )
}
