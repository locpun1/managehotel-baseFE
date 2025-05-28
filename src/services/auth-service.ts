import {
  ForgotPasswordRequest,
  LoginRequest,
  LoginResponse,
  LogoutResquest,
  RegisterRequest,
  ResetPasswordRequest,
  ResetPasswordResponse,
  VerifyUsernameRequest,
} from '@/types/auth';
import type { HttpResponse } from '@/types/common';
import HttpClient from '@/utils/HttpClient';

console.log('[SERVICE_INIT] VITE_API_BASE_URL from import.meta.env:', import.meta.env.VITE_API_BASE_URL);
console.log('[SERVICE_INIT] Full import.meta.env object:', import.meta.env);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'; 
const prefix = `${API_BASE_URL}/api/v1/auth`;

export const signIn = (params: LoginRequest) => {
  return HttpClient.post<typeof params, HttpResponse<LoginResponse>>(`${prefix}/login`, params);
};

export const signUp = (params: RegisterRequest) => {
  return HttpClient.post<RegisterRequest, HttpResponse>(`${prefix}/phone-register`, params);
};

export const signOut = (params: LogoutResquest) => {
  return HttpClient.post<LogoutResquest, HttpResponse>(`${prefix}/logout`,params);
};

export const verifyEmail = (params: VerifyUsernameRequest) => {
  return HttpClient.post<VerifyUsernameRequest, HttpResponse<ResetPasswordResponse>>(
    `${prefix}/verify-email`,
    params,
  );
};

export const resetPassword = (params: ResetPasswordRequest) => {
  return HttpClient.post<ResetPasswordRequest, HttpResponse<ResetPasswordResponse>>(
    `${prefix}/reset-password`,
    params,
  );
};

export const forgotPassword = (params: ForgotPasswordRequest) => {
  return HttpClient.post<ForgotPasswordRequest, HttpResponse<ResetPasswordResponse>>(
    `${prefix}/forgot-password`,
    params,
  );
};
