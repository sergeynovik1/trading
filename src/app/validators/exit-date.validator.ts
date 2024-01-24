import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function exitDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const entryDate = control.parent?.get('entryDate')?.value;
    const exitDate = control.value;

    if (exitDate && entryDate && exitDate <= entryDate) {
      return { invalidExitDate: true };
    }

    return null;
  };
}
