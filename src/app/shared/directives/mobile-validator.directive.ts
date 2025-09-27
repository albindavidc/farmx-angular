import { Directive } from '@angular/core';
import { AbstractControl, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[appMobileValidator]',
})
export class MobileValidatorDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const regex = /^[0-9]{10}$/;
    if (regex.test(control.value)) {
      return null;
    }
    
    return { mobile: true };
  }
}
