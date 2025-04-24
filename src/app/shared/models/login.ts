import { User } from './auth-state.model';

export interface LoginRequest {
  email: string;
  password: string;
  verificationType: 'email';
}

export interface LoginResponse {
  data: User;
}
