import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core'

@Component({
  selector: 'app-segmented-progress',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (total() > 0) {
      <div
        class="segmented-progress"
        [attr.data-segment-count]="total()"
        role="group"
        [attr.aria-label]="labelledById() ? null : ariaLabel()"
        [attr.aria-labelledby]="labelledById()"
      >
        @for (segment of segments(); track segment) {
          <span
            class="segment"
            [class.active]="segment === activeIndex()"
            aria-hidden="true"
          ></span>
        }
      </div>
    }
  `,
  styleUrl: './segmented-progress.component.scss',
})
export class SegmentedProgressComponent {
  readonly total = input.required<number>()
  readonly activeIndex = input.required<number>()
  readonly ariaLabel = input.required<string>()
  readonly labelledById = input<string | null>(null)

  readonly segments = computed(() => Array.from({ length: this.total() }, (_, index) => index))
}
