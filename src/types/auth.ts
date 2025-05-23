import { HttpResponse } from './common';

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
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
