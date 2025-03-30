import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  selectIsRegistered,
  selectSignupError,
  selectSignupLoading,
} from '../../../core/auth/selectors/signup.selectors';
import { SignupRequestModel } from '../../../core/auth/models/signup-request.model';
import { SignupActions } from '../../../core/auth/actions/signup.actions';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  signupForm: FormGroup;
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;
  isRegistered$: Observable<boolean>;

  constructor(private fb: FormBuilder, private store: Store) {
    this.signupForm = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', Validators.required, Validators.email],
        phone: ['', Validators.required],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      { Validators: this.passwordMatchValidator }
    );

    this.isLoading$ = this.store.select(selectSignupLoading);
    this.error$ = this.store.select(selectSignupError);
    this.isRegistered$ = this.store.select(selectIsRegistered);
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const userData: SignupRequestModel = {
        name: this.signupForm.value.name,
        email: this.signupForm.value.email,
        phone: this.signupForm.value.phone,
        password: this.signupForm.value.password,
      };
      this.store.dispatch(SignupActions.signup({ userData }));
    }
  }
}
