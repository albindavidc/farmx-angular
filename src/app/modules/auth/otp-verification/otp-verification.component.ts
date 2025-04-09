import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';
import { OtpActions } from '../../../core/auth/actions/otp.actions';
import {
  VerifyOtpRequest,
  ResendOtpRequest,
} from '../../../core/auth/models/otp.model';
import { selectTempUserId } from '../../../core/auth/selectors/signup.selectors';
import {
  selectIsVerified,
  selectOtpError,
  selectOtpLoading,
  selectRemainingAttempts,
  selectResendAvailableIn,
  selectUserEmail,
  selectVerificationType,
} from '../../../core/auth/selectors/otp.selectors';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-otp-verification',
  imports: [ReactiveFormsModule, CommonModule],

  templateUrl: './otp-verification.component.html',
  styleUrls: ['./otp-verification.component.scss'],
})
export class OtpVerificationComponent implements OnInit {
  otpForm: FormGroup;
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;
  isVerified$: Observable<boolean>;
  remainingAttempts$: Observable<number>;
  resendAvailableIn$: Observable<number>;
  tempUserId$: Observable<string | undefined>;
  canResend$: Observable<boolean>;
  countdownInterval: any;
  email$!: Observable<string>;
  verificationType$!: Observable<string>;

  constructor(private fb: FormBuilder, private store: Store) {
    this.otpForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    });

    this.isLoading$ = this.store.select(selectOtpLoading);
    this.error$ = this.store.select(selectOtpError);
    this.isVerified$ = this.store.select(selectIsVerified);
    this.remainingAttempts$ = this.store.select(selectRemainingAttempts);
    this.resendAvailableIn$ = this.store.select(selectResendAvailableIn);
    this.tempUserId$ = this.store.select(selectTempUserId);
    this.canResend$ = this.resendAvailableIn$.pipe(map((time) => time === 0));
    this.email$ = this.store.select(selectUserEmail);
    this.verificationType$ = this.store.select(selectVerificationType);
  }

  ngOnInit(): void {
    // Start countdown timer for resend OTP
    this.countdownInterval = setInterval(() => {
      this.resendAvailableIn$.subscribe((time) => {
        if (time > 0) {
          // Normally we'd dispatch an action to decrement, but for simplicity:
          // In a real app, you'd manage this in state with effects
        }
      });
    }, 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.countdownInterval);
  }

  onSubmit() {
    if (this.otpForm.valid) {
      this.tempUserId$.subscribe((tempUserId) => {
        if (tempUserId) {
          const request: VerifyOtpRequest = {
            verificationType: 'email',
            otp: this.otpForm.value.code,
            email: this.otpForm.value.email,
          };
          this.store.dispatch(OtpActions.verifyOtp({ request }));
        }
      });
    }
  }

  onResendOtp() {
    combineLatest([
      this.tempUserId$,
      this.store.select(selectUserEmail), // Add this selector
      this.store.select(selectVerificationType), // Add this selector
    ])
      .pipe(
        take(1), // Only take the first emission
        filter(
          ([tempUserId, email, verificationType]) =>
            !!tempUserId && !!email && !!verificationType
        ),
        tap(([tempUserId, email, verificationType]) => {
          const request: ResendOtpRequest = {
            email,
            verificationType,
            reason: 'signup', // or get from state/store
          };
          this.store.dispatch(OtpActions.resendOtp({ request }));
        })
      )
      .subscribe();
  }
}
