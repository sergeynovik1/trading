import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AccountService } from '@app/services/account.service';

export function entryPriceValidator(
  accountService: AccountService
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const actualBalance = accountService.getActualBalance();
    const entryPrice = control.value;

    if (entryPrice > actualBalance) {
      return { moreThanBalance: true };
    }

    return null;
  };
}
