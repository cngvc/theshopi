'use server';

import { signIn, signOut } from '@/auth';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { signinFormSchema } from '../validators';

export async function signinWithCredentials(_prevState: unknown, formData: FormData) {
  try {
    const user = signinFormSchema.parse({
      username: formData.get('username'),
      password: formData.get('password')
    });
    const result = await signIn('credentials', user);
    if (result) {
      throw Error();
    }
    return { success: true, message: 'Signed in successfully' };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: 'Invalid username or password' };
  }
}

export async function signoutUser() {
  await signOut();
}
