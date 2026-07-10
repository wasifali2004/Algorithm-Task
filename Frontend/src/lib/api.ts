// src/lib/api.ts
import axios, { AxiosError } from 'axios';
import { useAuthStore } from './store';

const baseURL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();

      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  },
);

export function getApiErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string | string[]; error?: string }
      | undefined;

    if (Array.isArray(data?.message)) {
      return data.message.join(', ');
    }

    return data?.message ?? data?.error ?? error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong';
}

