import Big from 'big.js';

export type GoldUnit = 'TAEL' | 'GRAM'; // Tael = Lượng
export type GoldType = 'SJC' | '9999';

export interface GoldHolding {
  id: string;
  type: GoldType;
  weight: string; // Big string
  unit: GoldUnit;
  purchasePrice: string; // Big string (VND per unit)
  purchaseDate: string; // ISO date
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GoldPrice {
  type: GoldType;
  buy: string; // Big string
  sell: string; // Big string
  updatedAt: string;
}
