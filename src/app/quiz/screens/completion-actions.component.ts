import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core'
import { LabelsService } from '../../core/i18n/labels.service'
import { PrimaryButtonComponent } from '../../shared/components/primary-button/primary-button.component'
import { SubmissionStatus } from '../models/quiz.types'

@Component({
  selector: 'app-quiz-completion-actions',
  standalone: true,
  imports: [PrimaryButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="actions" [attr.aria-busy]="status() === 'submitting'">
      @switch (status()) {
        @case ('submitting') {
          <app-primary-button
            [label]="labels.translate('common.submitting')"
            variant="muted"
            [disabled]="true"
          />
        }
        @case ('success') {
          <p class="status-text" role="status" aria-live="polite">
            {{ labels.translate('common.submitted') }}
          </p>
        }
        @case ('error') {
          <app-primary-button
            [label]="labels.translate('common.submit')"
            (pressed)="submitQuiz.emit()"
          />
        }
        @default {
          <app-primary-button
            [label]="labels.translate('common.submit')"
            (pressed)="submitQuiz.emit()"
          />
        }
      }
      <app-primary-button
        [label]="labels.translate('common.startOver')"
        variant="muted"
        (pressed)="startOver.emit()"
      />
    </div>
  `,
  styleUrl: './completion-actions.component.scss',
})
export class QuizCompletionActionsComponent {
  protected readonly labels = inject(LabelsService)

  readonly status = input.required<SubmissionStatus>()
  readonly submitQuiz = output<void>()
  readonly startOver = output<void>()
}
