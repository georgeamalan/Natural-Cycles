import { ChangeDetectionStrategy, Component, input } from '@angular/core'

@Component({
  selector: 'app-quiz-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="quiz-card">
      @if (showError()) {
        <div class="quiz-card__error" role="alert">{{ errorMessage() }}</div>
      }
      <div class="quiz-card__body">
        <ng-content />
      </div>
    </div>
  `,
  styleUrl: './quiz-card.component.scss',
})
export class QuizCardComponent {
  readonly showError = input(false)
  readonly errorMessage = input('')
}
