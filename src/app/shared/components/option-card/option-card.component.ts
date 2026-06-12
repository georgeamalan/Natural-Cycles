import { ChangeDetectionStrategy, Component, input, output } from '@angular/core'
import { IconComponent } from '../../icons/icon.component'

export type OptionSelectionRole = 'radio' | 'checkbox'

@Component({
  selector: 'app-option-card',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      class="option-card"
      [class.selected]="selected()"
      [class.with-checkbox]="showCheckbox()"
      [attr.role]="selectionRole()"
      [attr.aria-checked]="selected()"
      [tabIndex]="tabIndex()"
      (click)="selectedChange.emit()"
      (keydown)="optionKeydown.emit($event)"
    >
      @if (showCheckbox()) {
        <span class="checkbox" [class.checked]="selected()" aria-hidden="true">
          @if (selected()) {
            <app-icon name="check" [size]="12" />
          }
        </span>
      }
      <span class="option-content">
        <span class="option-label">{{ label() }}</span>
        @if (description()) {
          <span class="option-description">{{ description() }}</span>
        }
      </span>
    </button>
  `,
  styleUrl: './option-card.component.scss',
})
export class OptionCardComponent {
  readonly label = input.required<string>()
  readonly description = input<string>()
  readonly selected = input(false)
  readonly showCheckbox = input(false)
  readonly selectionRole = input.required<OptionSelectionRole>()
  readonly tabIndex = input(0)
  readonly selectedChange = output<void>()
  readonly optionKeydown = output<KeyboardEvent>()
}
