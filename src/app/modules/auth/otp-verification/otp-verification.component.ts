import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  combineLatest,
  interval,
  Observable,
  Subject,
  Subscription,
  timer,
} from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  scan,
  shareReplay,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { OtpActions } from '../../../store/auth/actions/otp.actions';

import { selectTempUserId } from '../../../store/auth/selectors/signup.selectors';
import {
  selectIsVerified,
  selectOtpError,
  selectOtpLoading,
  selectRemainingAttempts,
  selectResendAvailableIn,
  selectUserEmail,
  selectVerificationType,
} from '../../../store/auth/selectors/otp.selectors';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { selectUser } from '../../../store/auth/selectors/auth.selectors';
import { User } from '../../../shared/models/auth-state.model';
import {
  ResendOtpRequest,
  VerifyOtpRequest,
} from '../../../shared/models/otp.model';
import { subscribe } from 'diagnostics_channel';

@Component({
  selector: 'app-otp-verification',
  imports: [ReactiveFormsModule, CommonModule],

  templateUrl: './otp-verification.component.html',
  styleUrls: ['./otp-verification.component.scss'],
})
export class OtpVerificationComponent implements OnInit {
  otpForm: FormGroup;
  emailFromParams!: string;

  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;
  isVerified$: Observable<boolean>;
  remainingAttempts$: Observable<number>;
  tempUserId$: Observable<string | undefined>;
  countdownInterval: any;
  email$!: Observable<string>;
  verificationType$!: Observable<string>;
  user$: Observable<User | null>;
  canResend$: Observable<boolean>;
  resendAvailableIn$: Observable<number>;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router,
    private route: ActivatedRoute
  ) {
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
    this.user$ = this.store.select(selectUser);

    this.tempUserId$.pipe(take(1)).subscribe((id) => console.log('userid', id));
    this.email$.pipe(take(1)).subscribe((email) => console.log('email', email));
    this.verificationType$
      .pipe(take(1))
      .subscribe((type) => console.log('type', type));
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.emailFromParams = params['email'];

      if (!this.emailFromParams) {
        this.router.navigate(['/auth/signup']);
      }
    });

    this.startCountdown();
  }

  onSubmit() {
    if (this.otpForm.valid) {
      this.tempUserId$.subscribe((tempUserId) => {
        if (tempUserId) {
          const request: VerifyOtpRequest = {
            otp: this.otpForm.value.code,
            email: this.emailFromParams,
            verificationType: 'email',
          };
          this.store.dispatch(OtpActions.verifyOtp({ request }));
        }
      });
    }
  }

  /* Resend Otp - Counting Otp */
  onResendOtp() {
    this.tempUserId$.subscribe((tempUserId) => {
      if (tempUserId) {
        const request: ResendOtpRequest = {
          email: this.emailFromParams,
        };
        console.log(request, 'this is what we are sending to the back-end');
        this.store.dispatch(OtpActions.resendOtp({ request }));
      }
    });

    this.startCountdown();
  }

  private startCountdown(): void {
    this.resendAvailableIn$ = timer(0, 1000).pipe(
      takeUntil(this.destroy$),
      scan((acc) => (acc > 0 ? acc - 1 : 0), 60),
      shareReplay(1)
    );

    this.canResend$ = this.resendAvailableIn$.pipe(
      map((time) => time === 0),
      distinctUntilChanged()
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
