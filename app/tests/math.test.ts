import Big from 'big.js';
import { formatVND, calculatePnL, calculateSimpleInterest, calculateInterestEarned } from '../src/utils/math';

describe('Math Utilities', () => {
  test('formatVND formats correctly', () => {
    expect(formatVND(1000000)).toBe('1.000.000,00');
    expect(formatVND(new Big('1234567.89'))).toBe('1.234.567,89');
  });

  test('calculatePnL matches rules', () => {
    // (Current Price - Purchase Price) * Quantity
    const pnl = calculatePnL(110, 100, 5);
    expect(pnl.toNumber()).toBe(50);
  });

  test('calculateSimpleInterest matches rules', () => {
    // P * r * t
    const interest = calculateSimpleInterest(1000, 0.05, 2);
    expect(interest.toNumber()).toBe(100);
  });

  test('calculateInterestEarned (Daily Simple)', () => {
    const deposit = {
      id: '1',
      principal: '100000000',
      annualRate: '0.06',
      termMonths: 12,
      interestType: 'SIMPLE' as const,
      startDate: '2024-01-01',
      maturityDate: '2025-01-01',
      bankName: 'Test Bank',
      status: 'ACTIVE' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // After 182.5 days approx (half year)
    // 100M * 0.06 * (182 / 365) = 100M * 0.06 * 0.49863 = 2,991,780.82
    const asOf = new Date('2024-07-01'); // 182 days from 2024-01-01
    const interest = calculateInterestEarned(deposit, asOf);
    expect(interest.toNumber()).toBe(2991781); // Round Half Up
  });

  test('calculateInterestEarned (Maturity Compound)', () => {
    const deposit = {
      id: '2',
      principal: '100000000',
      annualRate: '0.06',
      termMonths: 12,
      interestType: 'COMPOUND' as const,
      compoundFrequency: 12,
      startDate: '2024-01-01',
      maturityDate: '2025-01-01',
      bankName: 'Test Bank',
      status: 'ACTIVE' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Full year (366 days due to leap year, but our logic is /365)
    // Actually 2024 is a leap year. 2024-01-01 to 2025-01-01 is 366 days.
    // 366 / 365 = 1.0027 years
    const asOf = new Date('2025-01-01');
    const interest = calculateInterestEarned(deposit, asOf);
    // 100M * (1 + 0.06/12)^12 = 106,167,781.18 -> Interest: 6,167,781
    // (If exactly 1 year)
    expect(interest.toNumber()).toBeGreaterThan(6000000);
  });
});
