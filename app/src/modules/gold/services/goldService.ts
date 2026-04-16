import { GoldHolding } from '../types';

export const MOCK_HOLDINGS: GoldHolding[] = [
    {
        id: '1',
        type: 'SJC',
        weight: '2.5',
        unit: 'TAEL',
        purchasePrice: '78000000',
        purchaseDate: '2024-01-15T00:00:00Z',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '2',
        type: '9999',
        weight: '0.5',
        unit: 'TAEL',
        purchasePrice: '68500000',
        purchaseDate: '2023-11-20T00:00:00Z',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

export const getGoldHoldings = async (): Promise<GoldHolding[]> => {
    // Simulate API/DB call
    return new Promise((resolve) => {
        setTimeout(() => resolve(MOCK_HOLDINGS), 500);
    });
};
