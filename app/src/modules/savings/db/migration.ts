import * as SQLite from 'expo-sqlite';
import { SAVINGS_SCHEMA } from './schema';

export const migrateSavings = async (db: SQLite.SQLiteDatabase) => {
  await db.execAsync(SAVINGS_SCHEMA);
  console.log('[SQLite] Savings schema verified/migrated.');
};
