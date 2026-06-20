// src/services/authService.ts

import { apiRequest } from './api';

export type LoginPayload = {
  email: string;
  password: string;
};

export type SignupPayload = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

export type VerifySignupOtpPayload = {
  email: string;
  otp: string;
};

export function loginUser(payload: LoginPayload) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: payload,
  });
}

export function signupUser(payload: SignupPayload) {
  return apiRequest('/auth/signup/request-otp', {
    method: 'POST',
    body: payload,
  });
}

export function verifySignupOtp(payload: VerifySignupOtpPayload) {
  return apiRequest('/auth/signup/verify-otp', {
    method: 'POST',
    body: payload,
  })
}

export function resendSignupOtp(email: string) {
  return apiRequest('/auth/signup/resend-otp', {
    method: 'POST',
    body: { email },
  })
}
