import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core'
import { ArrowIconComponent } from '../../icons/arrow-icon.component'
import { IconComponent, IconName } from '../../icons/icon.component'
import { LoadingIconComponent } from '../../icons/loading-icon.component'

export type ButtonIconLeft = IconName | 'loading'
export type ButtonIconRight = 'arrow-right'

@Component({
  selector: 'app-primary-button',
  standalone: true,
  imports: [IconComponent, LoadingIconComponent, ArrowIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      class="primary-button"
      [class.muted]="variant() === 'muted'"
      [class.full-width]="fullWidth()"
      [disabled]="disabled()"
      (click)="pressed.emit()"
    >
      @if (iconLeft() === 'loading') {
        <app-loading-icon [size]="20" [spin]="false" />
      } @else if (leftIconName(); as iconName) {
        <app-icon [name]="iconName" [size]="18" />
      }
      <span>{{ label() }}</span>
      @if (iconRight() === 'arrow-right') {
        <app-arrow-icon direction="right" [size]="20" />
      }
    </button>
  `,
  styleUrl: './primary-button.component.scss',
})
export class PrimaryButtonComponent {
  readonly label = input.required<string>()
  readonly disabled = input(false)
  readonly fullWidth = input(true)
  readonly variant = input<'solid' | 'muted'>('solid')
  readonly iconLeft = input<ButtonIconLeft | null>(null)
  readonly iconRight = input<ButtonIconRight | null>(null)
  readonly pressed = output<void>()

  readonly leftIconName = computed((): IconName | null => {
    const left = this.iconLeft()
    return left && left !== 'loading' ? left : null
  })
}
