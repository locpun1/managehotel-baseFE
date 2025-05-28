import type { HttpResponse } from '@/types/common';
import { UserProfile } from '@/types/users';
import HttpClient from '@/utils/HttpClient';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'; 
const prefix = `${API_BASE_URL}/auth`;

export const getCurrentUser = () => {
  return HttpClient.get<HttpResponse<UserProfile>>(`${prefix}/me`);
};
