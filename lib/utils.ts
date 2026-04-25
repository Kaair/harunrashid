import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { nanoid } from "nanoid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateTrackingId(): string {
  return `MG${nanoid(8).toUpperCase()}`;
}

export function formatBanglaDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return date.toLocaleDateString('bn-BD', options);
}

export function getStatusBangla(status: string): string {
  const statusMap: Record<string, string> = {
    pending: 'নতুন',
    'in-progress': 'চলমান',
    solved: 'সমাধান হয়েছে',
  };
  return statusMap[status] || status;
}

export function getCategoryBangla(category: string): string {
  const categoryMap: Record<string, string> = {
    road: 'রাস্তা',
    water: 'পানি',
    electricity: 'বিদ্যুৎ',
    sanitation: 'স্যানিটেশন',
    light: 'আলো',
    other: 'অন্যান্য',
  };
  return categoryMap[category] || category;
}
