import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
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
} from '../../../store/auth/selectors/signup.selectors';
import { SignupActions } from '../../../store/auth/actions/signup.actions';
import { Router, RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faQuoteLeft,
  faQuoteLeftAlt,
  faStar,
} from '@fortawesome/free-solid-svg-icons';
import { SvgIconComponent } from 'angular-svg-icon';
import { SignupRequestModel } from '../../../shared/models/signup.model';
import { PasswordValidatorDirective } from "../../../shared/directives/password-validator.directive";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

@Component({
  selector: 'app-signup',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    FontAwesomeModule,
    SvgIconComponent,
    PasswordValidatorDirective
],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  signupForm: FormGroup;
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;
  isRegistered$: Observable<boolean>;
  faQuoteRight = faQuoteLeft;
  faStar = faStar;
  faQuoteLeft = faQuoteLeftAlt;
  isBrowser = isPlatformBrowser(inject(PLATFORM_ID)); // Check if running in browser
  // role: string = 'user';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  roles: string[] = ['user', 'farmer'];

  constructor(
    private fb: FormBuilder,
    private store: Store,
  ) {
    this.signupForm = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        role: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );

    this.isLoading$ = this.store.select(selectSignupLoading);
    this.error$ = this.store.select(selectSignupError);
    this.isRegistered$ = this.store.select(selectIsRegistered);

    console.log(this.signupForm.value.role)
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const userData: SignupRequestModel = {
        name: this.signupForm.value.name.trim(),
        email: this.signupForm.value.email.trim(),
        phone: this.signupForm.value.phone.trim(),
        role: this.signupForm.value.role.trim(),
        password: this.signupForm.value.password,
      };
      this.store.dispatch(SignupActions.signup({ userData }));
    } else {
      console.error('Form is invalid', this.signupForm.errors);
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  //testimonials
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
