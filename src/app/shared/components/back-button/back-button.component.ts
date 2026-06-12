import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core'
import { LabelsService } from '../../../core/i18n/labels.service'
import { ArrowIconComponent } from '../../icons/arrow-icon.component'

@Component({
  selector: 'app-back-button',
  standalone: true,
  imports: [ArrowIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button type="button" class="back-button" (click)="pressed.emit()">
      <app-arrow-icon direction="left" [size]="20" />
      <span>{{ labels.translate('common.back') }}</span>
    </button>
  `,
  styleUrl: './back-button.component.scss',
})
export class BackButtonComponent {
  protected readonly labels = inject(LabelsService)
  readonly pressed = output<void>()
}
