/**
 * Formatting utilities for currency and other values
 */

/**
 * Format a number as currency
 * @param value The number to format
 * @param currencyCode The currency code (default: USD)
 * @returns Formatted currency string (e.g., "$10.99")
 */
export function formatCurrency(value: number, currencyCode = 'USD'): string {
  if (value === undefined || value === null) return '';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

/**
 * Format a number with a specific number of decimal places
 * @param value The number to format
 * @param decimalPlaces The number of decimal places (default: 2)
 * @returns Formatted number string
 */
export function formatNumber(value: number, decimalPlaces = 2): string {
  if (value === undefined || value === null) return '';
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces
  }).format(value);
}
