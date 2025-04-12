import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Observable, takeUntil } from 'rxjs';
import { User } from '../../../core/auth/models/auth-state.model';
import { Store } from '@ngrx/store';
import { Router, RouterLink } from '@angular/router';
import {
  selectLoginEmail,
  selectLoginError,
  selectLoginLoading,
  selectLoginUser,
} from '../../../core/auth/selectors/login.selectors';
import { LoginRequest } from '../../../core/auth/models/login';
import { LoginActions } from '../../../core/auth/actions/login.actions';
import { SvgIconComponent } from 'angular-svg-icon';
import {
  faQuoteLeft,
  faQuoteLeftAlt,
  faStar,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    SvgIconComponent,
    FontAwesomeModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;
  user$: Observable<User | null>;
  showPassword: boolean = false;
  faQuoteRight = faQuoteLeft;
  faStar = faStar;
  faQuoteLeft = faQuoteLeftAlt;
  isBrowser = isPlatformBrowser(inject(PLATFORM_ID)); // Check if running in browser

  constructor(private store: Store, private router: Router) {
    this.isLoading$ = this.store.select(selectLoginLoading);
    this.error$ = this.store.select(selectLoginError);
    this.user$ = this.store.select(selectLoginUser);
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      const request: LoginRequest = {
        email: form.value.email,
        password: form.value.password,
        verificationType: form.value.verificationType || 'email',
      };
      this.store.dispatch(LoginActions.loadLogin({ request }));
    } else {
      console.error(`The form is invalid: ${form.errors}`);
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
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
