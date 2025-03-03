import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatError(error: any) {
  if (error?.name === 'ZodError' && error?.errors) {
    const fieldErrors = Object.keys(error.errors).map((f) => error.errors[f].message);
    return `${fieldErrors.join('. ')}.`;
  }

  if (error?.name === 'AxiosError' && error?.response) {
    return error.response.data?.message || 'Something was wrong';
  }

  return typeof error.message === 'string' ? error.message : JSON.stringify(error.message);
}
