import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';

import { Router } from '@angular/router';
import { ForgotPasswordActions } from '../../../../store/auth/actions/forgot-password.actions';
import {
  selectChangePasswordSuccess,
  selectForgotPasswordEmail,
  selectGeneratePasswordSuccess,
  selectShowEmailForm,
  selectShowOtpForm,
  selectValidateOtpSuccess,
} from '../../../../store/auth/selectors/forgot-password.selectors';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  showEmailForm$: Observable<boolean>;
  showOtpForm$: Observable<boolean>;

  showEmailForm: boolean = true;
  showOtpForm: boolean = false;
  showChangePasswordForm: boolean = false;

  forgotPasswordEmail$: Observable<string>;
  generateOtpStatus$: Observable<boolean>;
  validatePasswordStatus$: Observable<boolean>;
  changePasswordStatus$: Observable<boolean>;

  constructor(private store: Store, private router: Router) {
    this.forgotPasswordEmail$ = this.store.select(selectForgotPasswordEmail);
    this.generateOtpStatus$ = this.store.select(selectGeneratePasswordSuccess);
    this.validatePasswordStatus$ = this.store.select(selectValidateOtpSuccess);
    this.changePasswordStatus$ = this.store.select(selectChangePasswordSuccess);

    this.showEmailForm$ = this.store.select(selectShowEmailForm);
    this.showOtpForm$ = this.store.select(selectShowOtpForm);
  }

  ngOnInit() {
    this.generateOtpStatus$.subscribe((state) => {
      console.log('Forgot Password State:', state);
    });

    this.store.subscribe((state) => {
      console.log('ENTIRE APPLICATION STATE:', state);
    });

    this.generateOtpStatus$.subscribe((success) => {
      console.log('this iss generating otp status', success);
      if (success) {
        this.showEmailForm = false;
        this.showOtpForm = true;
        this.showChangePasswordForm = false;
      }
    });

    this.validatePasswordStatus$.subscribe((success) => {
      if (success) {
        this.showEmailForm = false;
        this.showOtpForm = false;
        this.showChangePasswordForm = true;
      }
    });

    this.changePasswordStatus$.subscribe((success) => {
      if (success === true) {
        this.router.navigate(['/admin/login']);
      }
    });
  }

  onSubmitGenerateOtp(form: NgForm) {
    if (form.valid) {
      this.store.dispatch(
        ForgotPasswordActions.forgotPasswordGenerateOtp({
          email: form.value.email,
        })
      );
    }
  }

  resendOtp() {
    this.forgotPasswordEmail$.subscribe((email) => {
      this.store.dispatch(
        ForgotPasswordActions.forgotPasswordResendOtp({ email: email })
      );
    });
  }

  onSubmitValidateOtp(form: NgForm) {
    if (form.valid) {
      this.forgotPasswordEmail$.subscribe((email) => {
        console.log(
          email,
          form.value.otp,
          'these are the values from the front-end'
        );
        this.store.dispatch(
          ForgotPasswordActions.forgotPasswordValidateOtp({
            email: email,
            otp: form.value.otp,
          })
        );
      });
    }
  }

  onSubmitChangePassword(form: NgForm) {
    if (form.valid) {
      this.forgotPasswordEmail$.subscribe((email) => {
        this.store.dispatch(
          ForgotPasswordActions.changePassword({
            email: email,
            newPassword: form.value.newPassword,
            confirmPassword: form.value.confirmPassword,
          })
        );
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
