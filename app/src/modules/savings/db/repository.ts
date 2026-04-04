import * as SQLite from 'expo-sqlite';
import { Deposit } from '../types';

export const getAllDeposits = async (db: SQLite.SQLiteDatabase): Promise<Deposit[]> => {
  const result = await db.getAllAsync<Deposit>(
    'SELECT * FROM deposits ORDER BY maturityDate ASC'
  );
  return result;
};

export const getDepositById = async (
  db: SQLite.SQLiteDatabase,
  id: string
): Promise<Deposit | null> => {
  const result = await db.getFirstAsync<Deposit>(
    'SELECT * FROM deposits WHERE id = ?',
    [id]
  );
  return result;
};

export const createDeposit = async (
  db: SQLite.SQLiteDatabase,
  deposit: Omit<Deposit, 'createdAt' | 'updatedAt'>
): Promise<void> => {
  const now = new Date().toISOString();
  await db.runAsync(
    `INSERT INTO deposits (
      id, bankName, accountLabel, principal, annualRate, termMonths, 
      startDate, maturityDate, interestType, compoundFrequency, status, notes, 
      createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      deposit.id,
      deposit.bankName,
      deposit.accountLabel || null,
      deposit.principal,
      deposit.annualRate,
      deposit.termMonths,
      deposit.startDate,
      deposit.maturityDate,
      deposit.interestType,
      deposit.compoundFrequency || null,
      deposit.status,
      deposit.notes || null,
      now,
      now,
    ]
  );
};

export const updateDeposit = async (
  db: SQLite.SQLiteDatabase,
  id: string,
  data: Partial<Deposit>
): Promise<void> => {
  const now = new Date().toISOString();
  const fields = Object.keys(data).filter(
    (key) => key !== 'id' && key !== 'createdAt' && key !== 'updatedAt'
  );
  
  if (fields.length === 0) return;

  const setClause = fields.map((f) => `${f} = ?`).join(', ');
  const values = fields.map((f) => (data as any)[f]);

  await db.runAsync(
    `UPDATE deposits SET ${setClause}, updatedAt = ? WHERE id = ?`,
    [...values, now, id]
  );
};

export const deleteDeposit = async (db: SQLite.SQLiteDatabase, id: string): Promise<void> => {
  await db.runAsync('DELETE FROM deposits WHERE id = ?', [id]);
};
