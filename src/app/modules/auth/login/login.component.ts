import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Observable, takeUntil } from 'rxjs';
import { User } from '../../../core/auth/models/auth-state.model';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import {
  selectLoginEmail,
  selectLoginError,
  selectLoginLoading,
  selectLoginUser,
} from '../../../core/auth/selectors/login.selectors';
import { LoginRequest } from '../../../core/auth/models/login';
import { LoginActions } from '../../../core/auth/actions/login.actions';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;
  user$: Observable<User | null>;
  showPassword: boolean = false;

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

  toggelPasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
