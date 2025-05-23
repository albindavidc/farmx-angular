import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  selectChangePasswordState,
  selectForgotPasswordEmail,
  selectForgotPasswordSuccess,
  selectGeneratePasswordSuccess,
} from '../../../../store/settings/settings.selectors';
import { Router } from '@angular/router';
import { ForgotPasswordActions } from '../../../../store/auth/actions/forgot-password.actions';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent implements OnInit {
  showEmailForm: boolean = true;
  showOtpForm: boolean = false;
  showChangePasswordForm: boolean = false;
  forgotPasswordStatus$: Observable<boolean>;
  forgotPasswordEmail$: Observable<string>;

  generateOtpStatus$: Observable<boolean>;
  changePasswordStatus$: Observable<boolean>;

  constructor(private store: Store, private router: Router) {
    this.forgotPasswordStatus$ = this.store.select(selectForgotPasswordSuccess);
    this.forgotPasswordEmail$ = this.store.select(selectForgotPasswordEmail);

    this.generateOtpStatus$ = this.store.select(selectGeneratePasswordSuccess);
    this.changePasswordStatus$ = this.store.select(selectChangePasswordState);
  }

  ngOnInit() {
    this.forgotPasswordStatus$.subscribe((success) => {
      if (success === true) {
        this.showEmailForm = false;
        this.showOtpForm = true;
        this.showChangePasswordForm = false;
      }
    });

    this.generateOtpStatus$.subscribe((success) => {
      if (success === true) {
        this.showEmailForm = false;
        this.showOtpForm = true;
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
      this.store.dispatch(
        ForgotPasswordActions.changePassword({
          newPassword: form.value.newPassword,
          confirmPassword: form.value.confirmPassword,
        })
      );
    }
  }
}
