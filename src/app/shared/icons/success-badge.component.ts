import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import { TICK_ICON_PATH, TICK_ICON_STROKE_WIDTH } from './tick-icon.constants'

@Component({
  selector: 'app-success-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      class="success-badge"
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      [attr.aria-label]="ariaLabel()"
    >
      <circle cx="24" cy="24" r="24" fill="var(--nc-color-success-bg)" />
      <path
        [attr.d]="tickPath"
        stroke="var(--nc-color-primary)"
        [attr.stroke-width]="tickStrokeWidth"
        stroke-linecap="round"
        stroke-linejoin="round"
        transform="translate(13, 16)"
      />
    </svg>
  `,
  styleUrl: './success-badge.component.scss',
})
export class SuccessBadgeComponent {
  readonly size = input(48)
  readonly ariaLabel = input.required<string>()

  protected readonly tickPath = TICK_ICON_PATH
  protected readonly tickStrokeWidth = TICK_ICON_STROKE_WIDTH
}
