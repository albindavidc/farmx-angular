export interface VerifyOtpRequest {
  otp: string;
  email: string;
  verificationType: 'email' | 'phone';
  deviceId?: string;
}

export interface VerifyOtpResponse {
  user: any;
  accessToken: string;
  refreshToken: string;
}

export interface ResendOtpRequest {
  email: string;
  verificationType: 'email' | 'phone';
  reason: 'signup' | 'login' | 'password-reset';
}

export interface SendOtpResponse {
  success: boolean;
  message: string;
  data?: any;
}
