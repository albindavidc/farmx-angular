import { Component } from '@angular/core';
import { SignupComponent } from './auth/signup/signup.component';

@Component({
  selector: 'app-auth',
  imports: [SignupComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {

}
