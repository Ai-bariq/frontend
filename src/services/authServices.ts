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

export function loginUser(payload: LoginPayload) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: payload,
  });
}

export function signupUser(payload: SignupPayload) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: payload,
  });
}