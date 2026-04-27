import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: Date, locale: string = 'en') => {
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

export const formatHijriDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-u-ca-islamic-uma', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};
