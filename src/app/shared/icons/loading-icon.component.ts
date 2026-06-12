import { ChangeDetectionStrategy, Component, input } from '@angular/core'

@Component({
  selector: 'app-loading-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      class="loading-icon"
      [class.loading-icon--spin]="spin()"
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 29 29"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g clip-path="url(#loading-icon-clip)">
        <path
          d="M19.8812 18.7905C18.6272 20.3337 16.8115 21.3156 14.8336 21.5201C12.8557 21.7246 10.8776 21.1351 9.33435 19.8811C7.71263 18.5532 6.66705 16.6498 6.41621 14.5688L6.14234 11.9204"
          stroke="currentColor"
          stroke-width="1.66611"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M3.5156 15.1531L6.14232 11.9204L9.37494 14.5472"
          stroke="currentColor"
          stroke-width="1.66611"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M8.24371 9.3343C9.49768 7.79108 11.3133 6.8092 13.2912 6.60467C15.2691 6.40013 17.2473 6.98969 18.7905 8.24366C20.4122 9.57157 21.4578 11.475 21.7087 13.5559L21.9825 16.2044"
          stroke="currentColor"
          stroke-width="1.66611"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M18.7499 13.5777L21.9825 16.2044L24.6092 12.9718"
          stroke="currentColor"
          stroke-width="1.66611"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
      <defs>
        <clipPath id="loading-icon-clip">
          <rect
            width="19.9933"
            height="19.9933"
            fill="white"
            transform="translate(15.5166 28.1248) rotate(-140.904)"
          />
        </clipPath>
      </defs>
    </svg>
  `,
  styleUrl: './loading-icon.component.scss',
})
export class LoadingIconComponent {
  readonly size = input(28)
  readonly spin = input(true)
}
