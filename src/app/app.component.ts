import { ChangeDetectionStrategy, Component } from '@angular/core'
import { QuizComponent } from './quiz/quiz.component'

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [QuizComponent],
  template: '<app-quiz />',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
