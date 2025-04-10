import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { combineLatest, interval, Observable, Subscription } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
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
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../core/auth/models/auth-state.model';
import { selectUser } from '../../../core/auth/selectors/auth.selectors';
import { LoginService } from '../../../core/auth/services/login.service';
import { AuthActions } from '../../../core/auth/actions/auth.actions';

@Component({
  selector: 'app-otp-verification',
  imports: [ReactiveFormsModule, CommonModule],

  templateUrl: './otp-verification.component.html',
  styleUrls: ['./otp-verification.component.scss'],
})
export class OtpVerificationComponent implements OnInit {
  otpForm: FormGroup;
  emailFromParams!: string;

  countdown = 60;
  countdownSubscription!: Subscription;

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
  user$: Observable<User | null>;

  private loginService = inject(LoginService);

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
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.emailFromParams = params['email'];

      if (!this.emailFromParams) {
        this.router.navigate(['/auth/signup']);
      }
    });

    this.startCountdown();

    this.isVerified$
      .pipe(
        filter((isVerified) => isVerified),
        take(1),
        switchMap(() => this.user$),
        filter((user): user is User => !!user),
        take(1),
        tap((user) => {
          const otpPayload = {
            email: this.emailFromParams,
            otp: this.otpForm.value.code,
          };

          this.loginService.signup(otpPayload).subscribe({
            next: (res) => {
              this.store.dispatch(
                AuthActions.setAccessToken({ accessToken: res.accessToken })
              );

              this.store.dispatch(
                AuthActions.setUser({
                  id: user.id,
                  email: user.email,
                  name: user.name,
                  password: '',
                  phone: user.phone,
                  role: user.role,
                  isVerified: user.isVerified,
                })
              );

              switch (user.role) {
                case 'user':
                  this.router.navigate(['/user']);
                  break;
                case 'farmer':
                  this.router.navigate(['/farmer']);
                  break;
                case 'admin':
                  this.router.navigate(['/admin']);
                  break;
                default:
                  this.router.navigate(['/']);
              }
            },
            error: (err) => {
              console.error('Login failed after Otp Verification:', err);
            },
          });
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
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

  private startCountdown(): void {
    this.countdown = 60;
    if (this.countdownSubscription) this.countdownSubscription.unsubscribe();
    this.countdownSubscription = interval(1000).subscribe(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        this.countdownSubscription.unsubscribe();
      }
    });
  }
}
