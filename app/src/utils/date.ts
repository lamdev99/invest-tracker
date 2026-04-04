/**
 * Formats a date to DD/MM/YYYY string.
 */
export const formatDate = (date: Date | string | number): string => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid Date';
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  return `${day}/${month}/${year}`;
};

/**
 * Calculate days remaining until a target date.
 */
export const getDaysRemaining = (targetDate: Date | string | number): number => {
  const target = new Date(targetDate);
  const now = new Date();
  
  // Set to start of day for both
  target.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  
  const diffTime = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays > 0 ? diffDays : 0;
};
/**
 * Add months to a date string (YYYY-MM-DD) and return YYYY-MM-DD.
 */
export const addMonthsToDate = (dateStr: string, months: number): string => {
  const d = new Date(dateStr);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().split('T')[0];
};

/**
 * Alias for getDaysRemaining to match task naming.
 */
export const getDaysToMaturity = (maturityDate: string): number => {
  return getDaysRemaining(maturityDate);
};
