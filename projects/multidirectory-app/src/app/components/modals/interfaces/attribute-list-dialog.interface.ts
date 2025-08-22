import { ValidatorFn } from '@angular/forms';

export interface AttributeListDialogReturnData {}

export interface AttributeListDialogData {
  title: string;
  field: string;
  values: any[];
  valueValidator: ValidatorFn | null;
}
