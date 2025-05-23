import { HttpResponse } from './common';

export type LoginRequest = {
  identifier: string;
  password: string;
};

export type RegisterRequest = {
  fullName: string;
  phone_number: string;
  password: string;
};

export type LoginResponse = {
 tokens:{
   access: string;
   refresh: string;
 }
};

export type ResetPasswordRequest = {
  oldPassword: string;
  newPassword: string;
};

export type ForgotPasswordRequest = {
  password: string;
  token: string;
};

export type VerifyUsernameRequest = {
  username: string;
};

export type ResetPasswordResponse = Promise<HttpResponse<string>>;
