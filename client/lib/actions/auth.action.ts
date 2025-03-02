import { signIn, signOut } from 'next-auth/react';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { signinFormSchema } from '../validators';

export const signinWithCredentials = async (_prevState: unknown, formData: FormData) => {
  try {
    const user = signinFormSchema.parse({
      username: formData.get('username'),
      password: formData.get('password')
    });
    const result = await signIn('credentials', user);
    if (result?.error) {
      throw Error();
    }
    return { success: true, message: 'Signed in successfully' };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: 'Invalid username or password' };
  }
};

export const signoutOut = async () => {
  await signOut();
};
