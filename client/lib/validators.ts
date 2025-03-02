import { z } from 'zod';

export const signinFormSchema = z.object({
  username: z.string().min(0, 'Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});
