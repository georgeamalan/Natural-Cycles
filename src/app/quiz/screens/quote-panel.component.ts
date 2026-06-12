import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { LabelsService } from '../../core/i18n/labels.service'
import { LoadingIconComponent } from '../../shared/icons/loading-icon.component'
import { QuoteService } from '../services/quote.service'

@Component({
  selector: 'app-quote-panel',
  standalone: true,
  imports: [LoadingIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="quote-panel"
      aria-live="polite"
      [attr.aria-busy]="loading()"
      role="region"
      [attr.aria-label]="labels.translate('screens.inspiration.title')"
    >
      @if (loading()) {
        <div class="loader-row">
          <app-loading-icon />
          <p>{{ labels.translate('common.loadingQuote') }}</p>
        </div>
      } @else if (error()) {
        <p role="alert">{{ labels.translate('common.quoteLoadFailed') }}</p>
        <button type="button" class="retry" (click)="loadQuote()">
          {{ labels.translate('common.retry') }}
        </button>
      } @else {
        <blockquote>{{ quote() }}</blockquote>
      }
    </div>
  `,
  styleUrl: './quote-panel.component.scss',
})
export class QuotePanelComponent implements OnInit {
  private readonly quoteService = inject(QuoteService)
  private readonly destroyRef = inject(DestroyRef)
  protected readonly labels = inject(LabelsService)

  readonly loading = signal(true)
  readonly quote = signal<string | null>(null)
  readonly error = signal(false)

  ngOnInit(): void {
    this.loadQuote()
  }

  protected loadQuote(): void {
    this.loading.set(true)
    this.error.set(false)
    this.quote.set(null)

    this.quoteService
      .fetchRandomQuote()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: text => {
          this.quote.set(text)
          this.loading.set(false)
        },
        error: () => {
          this.error.set(true)
          this.loading.set(false)
        },
      })
  }
}
