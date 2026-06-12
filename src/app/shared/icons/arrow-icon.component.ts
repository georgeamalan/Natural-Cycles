import { ChangeDetectionStrategy, Component, input } from '@angular/core'

@Component({
  selector: 'app-arrow-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (direction() === 'left') {
      <svg
        class="arrow-icon"
        [attr.width]="size()"
        [attr.height]="size()"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M9.99666 15.828L4.16528 9.99666L9.99666 4.16528"
          stroke="currentColor"
          stroke-width="1.66611"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M15.828 9.99664H4.16528"
          stroke="currentColor"
          stroke-width="1.66611"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    } @else {
      <svg
        class="arrow-icon"
        [attr.width]="size()"
        [attr.height]="size()"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M4.16528 9.99664H15.828"
          stroke="currentColor"
          stroke-width="1.66611"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M9.99658 4.16528L15.828 9.99666L9.99658 15.828"
          stroke="currentColor"
          stroke-width="1.66611"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    }
  `,
  styleUrl: './arrow-icon.component.scss',
})
export class ArrowIconComponent {
  readonly direction = input.required<'left' | 'right'>()
  readonly size = input(20)
}
