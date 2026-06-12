import { ChangeDetectionStrategy, Component, computed, inject, isDevMode } from '@angular/core'
import { LabelsService } from '../core/i18n/labels.service'
import { QuizCardComponent } from '../shared/components/quiz-card/quiz-card.component'
import { AdvancedCompletionScreenComponent } from './screens/advanced-completion-screen.component'
import { CompletionScreenComponent } from './screens/completion-screen.component'
import { InspirationScreenComponent } from './screens/inspiration-screen.component'
import { MultiSelectScreenComponent } from './screens/multi-select-screen.component'
import { SingleSelectScreenComponent } from './screens/single-select-screen.component'
import { WelcomeScreenComponent } from './screens/welcome-screen.component'
import { QuizStateService } from './services/quiz-state.service'

@Component({
  selector: 'app-quiz',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    QuizCardComponent,
    WelcomeScreenComponent,
    SingleSelectScreenComponent,
    MultiSelectScreenComponent,
    InspirationScreenComponent,
    CompletionScreenComponent,
    AdvancedCompletionScreenComponent,
  ],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.scss',
})
export class QuizComponent {
  protected readonly labels = inject(LabelsService)
  private readonly quizState = inject(QuizStateService)

  readonly screen = this.quizState.currentScreen
  readonly showErrorBanner = computed(() => this.quizState.submissionStatus() === 'error')

  protected readonly isDevMode = isDevMode
}
