import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { filter, Observable, take } from 'rxjs';
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
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;
  isRegistered$: Observable<boolean>;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router
  ) {
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

  ngOnInit() {
    this.isRegistered$
      .pipe(
        filter((isRegistered) => isRegistered),
        take(1)
      )
      .subscribe(() => {
        const email = this.signupForm.get('email')?.value;
        this.router.navigate(['/auth/otp-verification'], {
          queryParams: { email },
        });
      });
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
