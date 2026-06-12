import { ChangeDetectionStrategy, Component, input } from '@angular/core'

export type IconName = 'check' | 'user'

@Component({
  selector: 'app-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      class="icon"
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      @switch (name()) {
        @case ('check') {
          <path
            d="M6 12.5 9.5 16 18 8"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        }
        @case ('user') {
          <circle cx="12" cy="8" r="3.25" stroke="currentColor" stroke-width="1.5" />
          <path
            d="M5.5 18.5c1.4-2.8 3.6-4 6.5-4s5.1 1.2 6.5 4"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          />
        }
      }
    </svg>
  `,
  styleUrl: './icon.component.scss',
})
export class IconComponent {
  readonly name = input.required<IconName>()
  readonly size = input(20)
}
