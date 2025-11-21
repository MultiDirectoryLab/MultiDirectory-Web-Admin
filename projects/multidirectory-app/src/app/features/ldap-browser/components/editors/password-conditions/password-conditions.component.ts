import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { PasswordPolicy } from '@core/password-policy/password-policy';
import { ValidationFunctions } from '@core/validators/validator-functions';
import { PasswordConditionItemComponent } from './password-condition-item/password-condition-item.component';

@Component({
  selector: 'app-password-conditions',
  imports: [PasswordConditionItemComponent],
  templateUrl: './password-conditions.component.html',
  styleUrls: ['./password-conditions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordConditionsComponent {
  policy = input.required<PasswordPolicy>();
  currentPassword = input.required<string>();

  protected passwordLengthOk = computed(
    () => this.currentPassword().length >= this.policy().minLength && this.currentPassword().length <= this.policy().maxLength,
  );
  protected minLowercaseLettersCountOk = computed(
    () => ValidationFunctions.loverCaseLettersCount(this.currentPassword()) >= this.policy().minLowercaseLettersCount,
  );
  protected minUppercaseLettersCountOk = computed(
    () => ValidationFunctions.upperCaseLettersCount(this.currentPassword()) >= this.policy().minUppercaseLettersCount,
  );
  protected minSpecialSymbolsCountOk = computed(
    () => ValidationFunctions.specialSymbolsCount(this.currentPassword()) >= this.policy().minSpecialSymbolsCount,
  );
  protected minDigitsCountOk = computed(() => ValidationFunctions.digitsCount(this.currentPassword()) >= this.policy().minDigitsCount);
  protected minUniqueSymbolsCountOk = computed(
    () => ValidationFunctions.uniqueSymbolsCount(this.currentPassword()) >= this.policy().minUniqueSymbolsCount,
  );
  protected maxRepeatingSymbolsInRowCountOk = computed(
    () => ValidationFunctions.repeatingSymbolsInRowCount(this.currentPassword()) <= this.policy().maxRepeatingSymbolsInRowCount,
  );
  protected notEndsWithSixDigitsOk = computed(() => !ValidationFunctions.endsWithSixDigits(this.currentPassword()));
}
