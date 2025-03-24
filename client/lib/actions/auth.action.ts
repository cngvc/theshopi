'use server';

import { auth, signIn, signOut } from '@/auth';
import axiosPrivateInstance from '@/lib/axios-private';
import { signinSchema, signupClientSchema } from '@cngvc/shopi-types';
import { redirect } from 'next/navigation';
import { safeAuthCall, unsafeApiCall } from '../axios-helper';
import axiosPublicInstance from '../axios-public';
import pages from '../constants/pages';
import { signinSSOFormSchema } from '../validators/auth-validator';

export async function signinWithCredentials(_prevState: unknown, formData: FormData) {
  return safeAuthCall(async () => {
    const { error, value: user } = signinSchema.validate({
      username: formData.get('username'),
      password: formData.get('password')
    });
    if (error) throw new Error(error.details[0].message);
    await signIn('credentials', { ...user, type: 'credentials', fingerprint: formData.get('fingerprint') });
    return { success: true, message: 'Signed in successfully' };
  });
}

export async function signinWithSSO({
  accessToken,
  refreshToken,
  fingerprint
}: {
  accessToken: string;
  refreshToken: string;
  fingerprint?: string;
}) {
  return safeAuthCall(async () => {
    const { error, value: tokens } = signinSSOFormSchema.validate({
      accessToken,
      refreshToken
    });
    if (error) throw new Error(error.details[0].message);
    await signIn('credentials', { ...tokens, type: 'sso', fingerprint });
    return { success: true, message: 'Signed in successfully' };
  });
}

export async function signupWithCredentials(_prevState: unknown, formData: FormData) {
  return safeAuthCall(async () => {
    const { error, value: user } = signupClientSchema.validate({
      username: formData.get('username'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
      email: formData.get('email')
    });
    if (error) throw new Error(error.details[0].message);
    await axiosPrivateInstance.post('/auth/signup', {
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
  });
}

export async function signoutUser() {
  const session = await auth();
  const refreshToken = session?.refreshToken;
  if (refreshToken) {
    await unsafeApiCall(async () => {
      await axiosPrivateInstance.post('/auth/signout', {
        refreshToken: refreshToken
      });
    });
  }
  try {
    await signOut();
  } catch (error) {
  } finally {
    redirect(pages.signin);
  }
}

export async function rotateRefreshToken(refreshToken: string) {
  const result = await unsafeApiCall(async () => {
    const { data } = await axiosPublicInstance.post('/auth/refresh-token', {
      refreshToken: refreshToken
    });
    return data.metadata as { accessToken: string; refreshToken: string };
  });

  try {
    await signOut();
  } catch (error) {
  } finally {
    redirect(pages.signin);
  }

  return result;
}
