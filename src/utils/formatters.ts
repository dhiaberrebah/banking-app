/**
 * Format a number as currency
 * @param amount - The amount to format
 * @param currency - The currency code (default: 'TND')
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency = 'TND'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount).replace('$', '') + ' ' + currency
}

/**
 * Format a date string
 * @param dateString - The date string to format
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}