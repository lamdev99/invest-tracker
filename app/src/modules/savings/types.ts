import Big from 'big.js';

export type InterestType = 'SIMPLE' | 'COMPOUND';
export type DepositStatus = 'ACTIVE' | 'MATURED' | 'WITHDRAWN';

export interface Deposit {
  id: string;
  bankName: string;
  accountLabel?: string;
  principal: string;     // Big.js compatible
  annualRate: string;    // Big.js compatible (e.g. "0.065" for 6.5%)
  termMonths: number;
  startDate: string;     // ISO8601 YYYY-MM-DD
  maturityDate: string;  // ISO8601 YYYY-MM-DD
  interestType: InterestType;
  compoundFrequency?: number; // n per year
  status: DepositStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
