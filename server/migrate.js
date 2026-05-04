import 'dotenv/config';
import { pool } from './db.js';

const sql = `
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  image TEXT,
  description TEXT DEFAULT '',
  category VARCHAR(120) DEFAULT '',
  stars NUMERIC(3, 1) DEFAULT 0 CHECK (stars >= 0 AND stars <= 5),
  old_price NUMERIC(10, 2),
  discount INT CHECK (discount IS NULL OR (discount >= 0 AND discount <= 100)),
  product_date DATE
);

CREATE TABLE IF NOT EXISTS coupons (
  id SERIAL PRIMARY KEY,
  code VARCHAR(64) NOT NULL UNIQUE,
  discount_percent INT NOT NULL CHECK (discount_percent >= 1 AND discount_percent <= 100)
);
`;

async function migrate() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is required');
    process.exit(1);
  }
  await pool.query(sql);
  console.log('Migrations applied.');
  await pool.end();
}

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
