import { error } from 'console';
import { Directive, Input } from '@angular/core';
import { AbstractControl, ValidationErrors, Validator } from '@angular/forms';
import { min } from 'rxjs';

@Directive({
  selector: '[appPasswordValidator]',
})
export class PasswordValidatorDirective implements Validator {
  @Input() appPasswordValidator: {
    minLength?: number;
    requiredUpperCase?: boolean;
    requiredLowerCase?: boolean;
    requiredDigit?: boolean;
    requiredSpecialChar?: boolean;
  } = {};

  validate(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const errors: ValidationErrors = {};
    const value = control.value;

    const config = {
      minLengh: this.appPasswordValidator.minLength || 8,
      requiredUpperCase: this.appPasswordValidator.requiredUpperCase || false,
      requiredLowerCase: this.appPasswordValidator.requiredLowerCase || false,
      requiredDigit: this.appPasswordValidator.requiredDigit || false,
      requiredSpecialChar:
        this.appPasswordValidator.requiredSpecialChar || false,
    };

    if (value.length < config.minLengh) {
      errors['minLength'] = {
        requiredLength: config.minLengh,
        actualLength: value.length,
      };
    }

    if (config.requiredUpperCase && !/[A-Z]/.test(value)) {
      errors['requiredUpperCase'] = true;
    }

    if (config.requiredLowerCase && !/[a-z]/.test(value)) {
      errors['requiredLowerCase'] = true;
    }

    if (config.requiredDigit && !/[0-9]/.test(value)) {
      errors['requiredDigit'] = true;
    }

    if (config.requiredSpecialChar && !/[^A-Za-z0-9]/.test(value)) {
      errors['requiredSpecialChar'] = true;
    }

    return Object.keys(errors).length > 0 ? errors : null;
  }
}
