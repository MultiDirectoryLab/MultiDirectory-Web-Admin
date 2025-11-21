import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-password-condition-item',
  imports: [TranslocoPipe],
  templateUrl: './password-condition-item.component.html',
  styleUrls: ['./password-condition-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordConditionItemComponent {
  isOk = input.required<boolean>();
  translationKey = input.required<string>();
  translationParams = input<Record<string, any>>({});
}
