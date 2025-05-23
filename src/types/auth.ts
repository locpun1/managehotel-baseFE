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

export type TokenObject = {
  token: string;
  expires: string;
};

export type LoginResponse = {
 tokens:{
   access: TokenObject;
   refresh: TokenObject;
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

export type LogoutResquest = {
  refreshToken: string;
};

export type ResetPasswordResponse = Promise<HttpResponse<string>>;
