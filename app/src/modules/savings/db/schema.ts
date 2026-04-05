export const SAVINGS_SCHEMA = `
  CREATE TABLE IF NOT EXISTS deposits (
    id TEXT PRIMARY KEY NOT NULL,
    bankName TEXT NOT NULL,
    accountLabel TEXT,
    principal TEXT NOT NULL,
    annualRate TEXT NOT NULL,
    termMonths INTEGER NOT NULL,
    startDate TEXT NOT NULL,
    maturityDate TEXT NOT NULL,
    interestType TEXT NOT NULL,
    compoundFrequency INTEGER,
    status TEXT NOT NULL,
    notes TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );
`;
