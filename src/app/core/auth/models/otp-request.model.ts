export interface VerifyOtpRequest {
  otp: string;
  email: string;
  verificationType: 'email' | 'phone';
  deviceId?: string;
}

export interface ResendOtpRequest {
  email: string;
  verificationType: 'email' | 'phone';
  reason: 'signup' | 'login' | 'password-reset';
}
