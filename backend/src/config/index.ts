import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT ? Number(process.env.PORT) : 4000,
  databaseUrl: process.env.DATABASE_URL || 'file:./dev.db'
};
