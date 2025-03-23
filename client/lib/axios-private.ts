'use server';

import { auth, signIn } from '@/auth';
import axios, { AxiosError, CreateAxiosDefaults } from 'axios';
import { rotateRefreshToken } from './actions/auth.action';
import { GATEWAY_URL } from './configs';

const axiosPrivateInstance = axios.create({
  baseURL: GATEWAY_URL,
  withCredentials: true,
  id: 'private-instance'
} as CreateAxiosDefaults & { id: string });

axiosPrivateInstance.interceptors.request.use(async (request) => {
  const session = await auth();
  if (session?.accessToken) {
    request.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return request;
});

axiosPrivateInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      const session = await auth();
      if (!session?.refreshToken) return Promise.reject(error);
      const originalRequest = error.config! as typeof error.config & { _retry: boolean };
      if (originalRequest._retry) return Promise.reject(error);
      originalRequest._retry = true;
      try {
        const result = await rotateRefreshToken(session?.refreshToken!);
        if (!result) return Promise.reject(error);
        await signIn('credentials', {
          type: 'refresh-token',
          accessToken: result.accessToken,
          refreshToken: result.refreshToken
        });
        axiosPrivateInstance.defaults.headers.common['Authorization'] = `Bearer ${result.accessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${result.accessToken}`;
        return axiosPrivateInstance(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosPrivateInstance;
