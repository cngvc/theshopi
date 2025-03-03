'use server';

import { signIn, signOut } from '@/auth';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import axiosInstance from '../axios';
import { formatError } from '../utils';
import { signinFormSchema, signupFormSchema } from '../validators/auth-validator';

export async function signinWithCredentials(_prevState: unknown, formData: FormData) {
  try {
    const user = signinFormSchema.parse({
      username: formData.get('username'),
      password: formData.get('password')
    });
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
    const user = signupFormSchema.parse({
      username: formData.get('username'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
      email: formData.get('email')
    });
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
    console.log(error?.name);
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: formatError(error) };
  }
}

export async function signoutUser() {
  await signOut();
}
