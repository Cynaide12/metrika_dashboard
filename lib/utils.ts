import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDateDays(add?: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + (add || 0));
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString()
}

export function getDateMonth(addMonth?: number): string {
  const d = new Date();
  d.setUTCMonth(d.getUTCMonth() + (addMonth || 0));
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString()
}
