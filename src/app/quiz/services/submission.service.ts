import { Injectable, inject } from '@angular/core'
import { Observable, from } from 'rxjs'
import { map } from 'rxjs/operators'
import { ENVIRONMENT } from '../../../environments/environment.token'
import { QuizPersistedState, SubmissionPayload } from '../models/quiz.types'
import { ProfileSummaryService } from './profile-summary.service'

@Injectable({ providedIn: 'root' })
export class SubmissionService {
  private readonly env = inject(ENVIRONMENT)
  private readonly profileSummary = inject(ProfileSummaryService)

  submit(state: QuizPersistedState): Observable<void> {
    const summaryFields = this.profileSummary.buildStandardSummary(state)

    const payload: SubmissionPayload = {
      track: state.track,
      path: state.path,
      answers: state.answers,
      profileSummary: this.profileSummary.resolveSummaryFields(summaryFields),
      submittedAt: new Date().toISOString(),
      ...(state.track === 'advanced' && {
        advancedProfile: this.profileSummary.buildAdvancedSummary(state),
      }),
    }

    // no-cors: webhook.site does not expose CORS headers
    return from(
      fetch(this.env.webhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
        body: JSON.stringify(payload),
      }),
    ).pipe(map(() => undefined))
  }
}
