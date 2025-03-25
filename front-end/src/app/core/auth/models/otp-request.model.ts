export interface VerifyOTPRequest {
  otp: string;
  email: string;
  verificationType: 'email' | 'phone';
  deviceId?: string;
}

export interface ResendOTPRequest {
  email: string;
  verificationType: 'email' | 'phone';
  reason: 'signup' | 'login' | 'password-reset';
}
