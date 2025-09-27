import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Observable, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { Router, RouterLink } from '@angular/router';
import {
  selectLoginEmail,
  selectLoginError,
  selectLoginLoading,
  selectLoginUser,
} from '../../../store/auth/selectors/login.selectors';
import { LoginActions } from '../../../store/auth/actions/login.actions';
import { SvgIconComponent } from 'angular-svg-icon';
import {
  faQuoteLeft,
  faQuoteLeftAlt,
  faStar,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoginRequest } from '../../../shared/models/login';
import { User } from '../../../shared/models/auth-state.model';
import { PasswordValidatorDirective } from '../../../shared/directives/password-validator.directive';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule, 
    RouterLink,
    SvgIconComponent,
    FontAwesomeModule,
    PasswordValidatorDirective, 
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;
  user$: Observable<User | null>;
  showPassword: boolean = false;
  faQuoteRight = faQuoteLeft;
  faStar = faStar;
  faQuoteLeft = faQuoteLeftAlt;
  isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor(
    private store: Store,
    private router: Router,
    private fb: FormBuilder // Inject FormBuilder
  ) {
    this.isLoading$ = this.store.select(selectLoginLoading);
    this.error$ = this.store.select(selectLoginError);
    this.user$ = this.store.select(selectLoginUser);
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      verificationType: ['email'], 
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const request: LoginRequest = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
        verificationType: this.loginForm.value.verificationType || 'email',
      };
      this.store.dispatch(LoginActions.loadLogin({ request }));
    } else {
      // Mark all fields as touched to trigger validation messages
      this.markFormGroupTouched();
      console.error('The form is invalid');
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach((key) => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Helper methods for template access
  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }

  //Testimonials
  testimonials: Testimonial[] = [
    {
      quote:
        'Searching, finding and solving your day to day concerns regarding farming has become an ease. Just open the app and browse the related farming.',
      author: 'Rajesh',
      role: 'Cotton Farmer',
    },
    {
      quote:
        'This app has transformed how I manage my crops. The tips and community support are invaluable!',
      author: 'Anita',
      role: 'Vegetable Farmer',
    },
    {
      quote:
        'I never thought technology could make farming so efficient. The weather updates and market prices are spot-on.',
      author: 'Vikram',
      role: 'Wheat Farmer',
    },
    {
      quote:
        'Thanks to this platform, I connected with experts who helped me improve my yield significantly.',
      author: 'Priya',
      role: 'Rice Farmer',
    },
    {
      quote:
        "The app's simplicity makes it easy for me to access resources and learn new techniques every day.",
      author: 'Suresh',
      role: 'Organic Farmer',
    },
  ];
}
