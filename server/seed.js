import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function seed() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is required');
    process.exit(1);
  }

  const { rows } = await pool.query('SELECT COUNT(*)::int AS c FROM products');
  if (rows[0].c > 0) {
    console.log('Products already seeded; skipping.');
    await pool.end();
    return;
  }

  const raw = fs.readFileSync(path.join(__dirname, 'seed', 'products.json'), 'utf8');
  const products = JSON.parse(raw);

  for (const p of products) {
    await pool.query(
      `INSERT INTO products (name, price, image, description, category, stars, old_price, discount, product_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        p.name,
        p.price,
        p.image || null,
        p.description || '',
        p.category || '',
        p.stars ?? 0,
        p.oldPrice ?? null,
        p.discount ?? null,
        p.date || null,
      ]
    );
  }

  console.log(`Seeded ${products.length} products.`);
  await pool.end();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
