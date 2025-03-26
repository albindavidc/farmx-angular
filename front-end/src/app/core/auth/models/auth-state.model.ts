export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  error: string | null;
  isLoading: boolean;
}

export interface SignupState {
  isRegistered: boolean;
  tempUser: User | null;
  error: string | null;
  isLoading: boolean;
}

export interface OTPState {
  isVerified: boolean;
  error: string | null;
  isLoading: boolean;
  remainingAttempts: number;
  resendAvailableIn: number;
  email: string;
  verificationType: 'email' | 'phone';
  tempUserId?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  phone?: string;
  roles: string[];
  isVerified: boolean;
}
