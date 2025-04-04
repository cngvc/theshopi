import { clsx, type ClassValue } from 'clsx';
import { differenceInHours, differenceInMinutes, format, isToday, isValid, isYesterday, parseISO } from 'date-fns';
import { twMerge } from 'tailwind-merge';
import pages from './constants/pages';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (isoString?: string) => {
  if (!isoString || isValid(isoString)) return '-';
  const date = parseISO(isoString);
  const now = new Date();
  if (isToday(date)) {
    const diffHours = differenceInHours(now, date);
    const diffMinutes = differenceInMinutes(now, date);
    if (diffHours > 0) return `${diffHours} hrs ago`;
    if (diffMinutes > 0) return `${diffMinutes} mins ago`;
    return 'Just now';
  }
  if (isYesterday(date)) {
    return 'Yesterday';
  }
  return format(date, 'dd/MM/yyyy');
};

const currencyFormat = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  style: 'currency',
  minimumFractionDigits: 2
});

export function formatCurrency(amount: number | string | null) {
  if (typeof amount === 'number') {
    return currencyFormat.format(amount);
  } else if (typeof amount === 'string') {
    return currencyFormat.format(Number(amount));
  } else {
    return 'NaN';
  }
}

export function productUrl(slug: string, productPublicId: string) {
  return `${pages.products}/${slug}-i.${productPublicId}`;
}
