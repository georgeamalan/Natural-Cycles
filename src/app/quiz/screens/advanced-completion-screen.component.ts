import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core'
import { LabelsService } from '../../core/i18n/labels.service'
import { AutofocusDirective } from '../../shared/directives/autofocus.directive'
import { BackButtonComponent } from '../../shared/components/back-button/back-button.component'
import { SuccessBadgeSolidComponent } from '../../shared/icons/success-badge-solid.component'
import { QuizScreen } from '../models/quiz.types'
import { ProfileSummaryService } from '../services/profile-summary.service'
import { QuizStateService } from '../services/quiz-state.service'
import { SubmitQuizService } from '../services/submit-quiz.service'
import { QuizCompletionActionsComponent } from './completion-actions.component'
import { getScreenSubtitle, getScreenTitleId } from './quiz-screen.helpers'

@Component({
  selector: 'app-advanced-completion-screen',
  standalone: true,
  imports: [
    AutofocusDirective,
    BackButtonComponent,
    SuccessBadgeSolidComponent,
    QuizCompletionActionsComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="screen screen--completion" [attr.aria-labelledby]="titleId()">
      @if (screen().showBack) {
        <app-back-button (pressed)="quizState.goBack()" />
      }
      <div class="success-header">
        <app-success-badge-solid [size]="48" [ariaLabel]="labels.translate('common.success')" />
        <h1 class="title title--center" [id]="titleId()" tabindex="-1" appAutofocus>
          {{ labels.translate(screen().titleKey) }}
        </h1>
        @if (subtitle(); as text) {
          <p class="subtitle subtitle--center">{{ text }}</p>
        }
      </div>

      <div class="summary-panel summary-panel--expert">
        <h2 class="summary-panel__heading">
          {{ labels.translate('screens.advancedCompletion.resourcesTitle') }}
        </h2>
        <p class="summary-panel__intro">{{ advancedFocus() }}</p>
        @if (resourceBullets().length) {
          <ul class="bullet-list">
            @for (bulletKey of resourceBullets(); track bulletKey) {
              <li>{{ labels.translate(bulletKey) }}</li>
            }
          </ul>
        }
      </div>

      <app-quiz-completion-actions
        [status]="quizState.submissionStatus()"
        (submitQuiz)="submitQuizService.submit()"
        (startOver)="quizState.startOver()"
      />
    </section>
  `,
})
export class AdvancedCompletionScreenComponent {
  readonly screen = input.required<QuizScreen>()
  protected readonly labels = inject(LabelsService)
  protected readonly quizState = inject(QuizStateService)
  protected readonly submitQuizService = inject(SubmitQuizService)
  private readonly profileSummary = inject(ProfileSummaryService)

  readonly titleId = computed(() => getScreenTitleId(this.screen().id))
  readonly subtitle = computed(() => getScreenSubtitle(this.labels, this.screen()))
  readonly resourceBullets = computed(() => this.screen().resourceBulletKeys ?? [])
  readonly advancedFocus = computed(() => {
    const { focus, goal } = this.profileSummary.buildAdvancedSummary(this.quizState.currentState())
    return this.labels.translate('screens.advancedCompletion.resourcesIntro', { focus, goal })
  })
}
