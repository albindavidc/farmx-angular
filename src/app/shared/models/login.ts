import { User } from "./user/user.model";

export interface LoginRequest {
  email: string;
  password: string;
  verificationType: 'email';
}

export interface LoginResponse {
  data: User;
}
