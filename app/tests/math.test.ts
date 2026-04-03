import Big from 'big.js';
import { formatVND, calculatePnL, calculateSimpleInterest } from '../src/utils/math';

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
});
