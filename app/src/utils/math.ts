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
/**
 * Calculate the percentage of a value relative to a total.
 */
export const calculateAllocationPercent = (
  classValue: number | string | Big,
  total: number | string | Big
): Big => {
  const t = new Big(total);
  if (t.eq(0)) return new Big(0);
  return new Big(classValue).div(t).times(100);
};

/**
 * Aggregates multiple Big values into a single sum.
 */
export const sumBigs = (values: (number | string | Big)[]): Big => {
  return values.reduce((acc: Big, val) => acc.plus(new Big(val)), new Big(0));
};
/**
 * Calculate simple interest for a deposit: P * r * (termMonths / 12)
 * Uses Round Half Up (Big.RM = 1)
 */
export const calculateSimpleInterestForDeposit = (
  principal: number | string | Big,
  annualRate: number | string | Big,
  termMonths: number
): Big => {
  const P = new Big(principal);
  const r = new Big(annualRate);
  const t = new Big(termMonths).div(12);

  return P.times(r).times(t).round(2, 1); // 1 is Round Half Up
};

/**
 * Calculate compound interest for a deposit: P * (1 + r/n)^(n * t)
 * where t = termMonths / 12 and n = compoundFrequency
 * Uses Round Half Up (Big.RM = 1)
 */
export const calculateCompoundInterestForDeposit = (
  principal: number | string | Big,
  annualRate: number | string | Big,
  termMonths: number,
  compoundFrequency: number
): Big => {
  const P = new Big(principal);
  const r = new Big(annualRate);
  const n = new Big(compoundFrequency);
  const t = new Big(termMonths).div(12);

  const base = new Big(1).plus(r.div(n));
  const exponent = n.times(t).toNumber();
  
  // Power calculation with integer fallback where possible
  const power = base.pow(Math.floor(exponent));
  
  return P.times(power).round(2, 1);
};
import { Deposit } from '../modules/savings/types';

/**
 * Dispatches to simple or compound interest calculation based on deposit type.
 * Returns interest earned "to date" or at full maturity.
 */
export const calculateInterestEarned = (deposit: Deposit, asOfDate: Date = new Date()): Big => {
  const start = new Date(deposit.startDate);
  const maturity = new Date(deposit.maturityDate);
  const now = asOfDate > maturity ? maturity : asOfDate;
  
  if (now < start) return new Big(0);

  const diffTime = now.getTime() - start.getTime();
  const monthsElapsed = diffTime / (1000 * 60 * 60 * 24 * 30.44); // Approx months

  if (deposit.interestType === 'SIMPLE') {
    return calculateSimpleInterestForDeposit(
      deposit.principal,
      deposit.annualRate,
      monthsElapsed
    );
  } else {
    return calculateCompoundInterestForDeposit(
      deposit.principal,
      deposit.annualRate,
      monthsElapsed,
      deposit.compoundFrequency || 12
    );
  }
};

/**
 * Calculate total value at maturity (Principal + Total Interest)
 */
export const calculateMaturityValue = (deposit: Deposit): Big => {
  const interest = deposit.interestType === 'SIMPLE'
    ? calculateSimpleInterestForDeposit(deposit.principal, deposit.annualRate, deposit.termMonths)
    : calculateCompoundInterestForDeposit(
        deposit.principal, 
        deposit.annualRate, 
        deposit.termMonths, 
        deposit.compoundFrequency || 12
      );
  
  return new Big(deposit.principal).plus(interest);
};
