import { z } from 'zod';

export const signinFormSchema = z.object({
  username: z.string().min(0, 'Username is required'),
  password: z.string().min(8, 'Password must be at least 6 characters')
});

export const signupFormSchema = z
  .object({
    username: z.string().min(0, 'Username is required'),
    password: z.string().min(8, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(8, 'Confirm password must be at least 6 characters'),
    email: z.string().email('Invalid email address')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password don't match",
    path: ['confirmPassword']
  });
