import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function exitPriceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const entryPrice = control.parent?.get('entryPrice')?.value;
    const exitPrice = control.value;

    if (entryPrice && exitPrice && exitPrice < entryPrice) {
      return { lessThanEntryPrice: true };
    }

    return null;
  };
}
