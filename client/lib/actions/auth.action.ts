'use server';

import { signIn, signOut } from '@/auth';
import axiosInstance from '@/lib/axios';
import { formatError } from '@/lib/utils';
import { signinSchema, signupClientSchema } from '@cngvc/shopi-types';
import { isRedirectError } from 'next/dist/client/components/redirect-error';

export async function signinWithCredentials(_prevState: unknown, formData: FormData) {
  try {
    const { error, value: user } = signinSchema.validate({
      username: formData.get('username'),
      password: formData.get('password')
    });
    if (error) {
      return { success: false, message: error.details[0].message };
    }
    await signIn('credentials', user);
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
    await axiosInstance.post(`/auth/signup`, {
      username: user.username,
      password: user.password,
      email: user.email
    });
    await signIn('credentials', {
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
  await signOut({ redirect: true });
}
