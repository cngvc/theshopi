'use server';

import { auth, signIn, signOut } from '@/auth';
import axiosPrivateInstance from '@/lib/axios-private';
import { formatError } from '@/lib/utils';
import { signinSchema, signupClientSchema } from '@cngvc/shopi-types';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import axiosPublicInstance from '../axios-public';
import pages from '../constants/pages';
import { signinSSOFormSchema } from '../validators/auth-validator';

export async function signinWithCredentials(_prevState: unknown, formData: FormData) {
  try {
    const { error, value: user } = signinSchema.validate({
      username: formData.get('username'),
      password: formData.get('password')
    });
    if (error) {
      return { success: false, message: error.details[0].message };
    }
    await signIn('credentials', { ...user, type: 'credentials' });
    return { success: true, message: 'Signed in successfully' };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: formatError(error) };
  }
}

export async function signinWithSSO({ accessToken, refreshToken }: { accessToken: string; refreshToken: string }) {
  try {
    const { error, value: tokens } = signinSSOFormSchema.validate({
      accessToken,
      refreshToken
    });
    if (error) {
      return { success: false, message: error.details[0].message };
    }
    await signIn('credentials', { ...tokens, type: 'sso' });
    return { success: true, message: 'Signed in successfully' };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: formatError(error) };
  }
}

export async function signupWithCredentials(_prevState: unknown, formData: FormData) {
  try {
    const { error, value: user } = signupClientSchema.validate({
      username: formData.get('username'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
      email: formData.get('email')
    });
    if (error) {
      return { success: false, message: error.details[0].message };
    }
    await axiosPrivateInstance.post(`/auth/signup`, {
      username: user.username,
      password: user.password,
      email: user.email
    });
    await signIn('credentials', {
      type: 'credentials',
      username: user.username,
      password: user.password
    });
    return { success: true, message: 'User registered successfully' };
  } catch (error: any) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: formatError(error) };
  }
}

export async function signoutUser() {
  const session = await auth();
  if (session?.refreshToken) {
    try {
      await axiosPrivateInstance.post('/auth/signout', {
        refreshToken: session.refreshToken
      });
    } catch (error) {}
  }
  await signOut({ redirectTo: pages.home, redirect: true });
}

export async function rotateRefreshToken(refreshToken: string) {
  try {
    const { data } = await axiosPublicInstance.post('/auth/refresh-token', {
      refreshToken: refreshToken
    });
    return data.metadata as { accessToken: string; refreshToken: string };
  } catch (error) {
    await signOut({ redirect: true });
    return null;
  }
}
