import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core'
import { LabelsService } from '../../core/i18n/labels.service'
import { AutofocusDirective } from '../../shared/directives/autofocus.directive'
import { PrimaryButtonComponent } from '../../shared/components/primary-button/primary-button.component'
import { QuizScreen } from '../models/quiz.types'
import { QuizStateService } from '../services/quiz-state.service'
import { getScreenTitleId } from './quiz-screen.helpers'

@Component({
  selector: 'app-welcome-screen',
  standalone: true,
  imports: [PrimaryButtonComponent, AutofocusDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="screen screen--welcome" [attr.aria-labelledby]="titleId">
      <h1 class="title title--center" [id]="titleId" tabindex="-1" appAutofocus>
        <span>{{ labels.translate('screens.welcome.titleLine1') }}</span>
        <span>{{ labels.translate('screens.welcome.titleLine2') }}</span>
      </h1>
      <p class="subtitle subtitle--center">{{ labels.translate('screens.welcome.subtitle') }}</p>
      <app-primary-button
        class="welcome-cta"
        [label]="labels.translate(screen().continueLabelKey ?? 'common.getStarted')"
        iconRight="arrow-right"
        (pressed)="quizState.continueFromScreen(screen().id)"
      />
    </section>
  `,
})
export class WelcomeScreenComponent {
  readonly screen = input.required<QuizScreen>()
  protected readonly labels = inject(LabelsService)
  protected readonly quizState = inject(QuizStateService)

  readonly titleId = getScreenTitleId('welcome')
}
