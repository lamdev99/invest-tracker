import Big from 'big.js';

/**
 * Formats a number or Big object to VND currency string.
 * Format: 1.000.000,00 (dot for thousands, comma for decimal)
 */
export const formatVND = (amount: number | string | Big): string => {
  const value = new Big(amount);
  const formatted = value.toFixed(2);
  const [integerPart, decimalPart] = formatted.split('.');
  
  const withDots = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
  return `${withDots},${decimalPart}`;
};

/**
 * Calculates simple interest: P * r * t
 * @param principal Principal amount
 * @param annualRate Annual interest rate (e.g., 0.05 for 5%)
 * @param timeInYears Time in years
 */
export const calculateSimpleInterest = (
  principal: number | string | Big,
  annualRate: number | string | Big,
  timeInYears: number | string | Big
): Big => {
  return new Big(principal).times(annualRate).times(timeInYears);
};

/**
 * Calculates compound interest: P * (1 + r/n)^(n*t)
 * @param principal Principal amount
 * @param annualRate Annual interest rate
 * @param timesCompoundedPerYear n
 * @param timeInYears t
 */
export const calculateCompoundInterest = (
  principal: number | string | Big,
  annualRate: number | string | Big,
  timesCompoundedPerYear: number,
  timeInYears: number | string | Big
): Big => {
  const P = new Big(principal);
  const r = new Big(annualRate);
  const n = new Big(timesCompoundedPerYear);
  const t = new Big(timeInYears);

  // (1 + r/n)
  const base = new Big(1).plus(r.div(n));
  // (n * t)
  const exponent = n.times(t).toNumber();
  
  // Big.js doesn't have a native pow for non-integers, 
  // but n*t for compound interest is usually an integer (number of periods).
  // If not, we fall back to Math.pow for the ratio and wrap it back.
  const power = base.pow(Math.floor(exponent));
  
  return P.times(power);
};

/**
 * Calculate Unrealized P&L
 * (Current Price - Purchase Price) * Quantity
 */
export const calculatePnL = (
  currentPrice: number | string | Big,
  purchasePrice: number | string | Big,
  quantity: number | string | Big
): Big => {
  return new Big(currentPrice).minus(purchasePrice).times(quantity);
};
