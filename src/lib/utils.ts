// lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Add cron helper functions
export const calculateNextRun = (cronExpression: string | null): Date | null => {
  if (!cronExpression) return null;
  
  try {
    const now = new Date();
    return new Date(now.getTime() + 60000); // Simple estimation for demo
  } catch (error) {
    console.error('Calculate next run error:', error);
    return null;
  }
};