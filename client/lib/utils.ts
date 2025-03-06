import { clsx, type ClassValue } from 'clsx';
import { differenceInHours, differenceInMinutes, format, isToday, isYesterday, parseISO } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatError(error: any) {
  if (error?.name === 'AxiosError' && error?.response) {
    return error.response.data?.message || 'Something was wrong';
  }

  return typeof error.message === 'string' ? error.message : JSON.stringify(error.message);
}

export const formatDate = (isoString: string) => {
  const date = parseISO(isoString);
  const now = new Date();

  if (isToday(date)) {
    const diffHours = differenceInHours(now, date);
    const diffMinutes = differenceInMinutes(now, date);
    if (diffHours > 0) return `${diffHours} hours ago`;
    if (diffMinutes > 0) return `${diffMinutes} minutes ago`;
    return 'Just now';
  }
  if (isYesterday(date)) {
    return 'Yesterday';
  }
  return format(date, 'dd/MM/yyyy');
};
