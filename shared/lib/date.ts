/**
 * Date and time formatting utilities
 */

/**
 * Format a date to a user-friendly string
 * @param date The date to format
 * @returns Formatted date string (e.g., "Jan 1, 2023")
 */
export function formatDate(date: Date): string {
  if (!date) return '';
  
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

/**
 * Format a time to a user-friendly string
 * @param date The date containing the time to format
 * @returns Formatted time string (e.g., "4:00 PM")
 */
export function formatTime(date: Date): string {
  if (!date) return '';
  
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(date);
}

/**
 * Format a date range to a user-friendly string
 * @param startDate The start date
 * @param endDate The end date
 * @returns Formatted date range (e.g., "Jan 1 - Jan 2, 2023")
 */
export function formatDateRange(startDate: Date, endDate: Date): string {
  if (!startDate || !endDate) return '';
  
  const start = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric'
  }).format(startDate);
  
  const end = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(endDate);
  
  return `${start} - ${end}`;
}
