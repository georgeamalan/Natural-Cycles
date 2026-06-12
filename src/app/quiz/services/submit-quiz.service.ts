import { Injectable, inject } from '@angular/core'
import { take } from 'rxjs'
import { QuizStateService } from './quiz-state.service'
import { SubmissionService } from './submission.service'

@Injectable({ providedIn: 'root' })
export class SubmitQuizService {
  private readonly quizState = inject(QuizStateService)
  private readonly submissionService = inject(SubmissionService)

  submit(): void {
    if (this.quizState.submissionStatus() === 'submitting') return

    this.quizState.setSubmissionStatus('submitting')

    this.submissionService
      .submit(this.quizState.currentState())
      .pipe(take(1))
      .subscribe({
        next: () => this.quizState.setSubmissionStatus('success'),
        error: () => this.quizState.setSubmissionStatus('error'),
      })
  }
}
