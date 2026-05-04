// In-memory catalog + optional hydrate from API; images reconciled from live disk listing.
import { products } from '../data/products';
import { getAvailableImages, reconcileProductImages } from '../utils/imageScanner';
import { apiUrl } from '../config/apiBase';

function mapFromFile(product) {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image || null,
    description: product.description || '',
    category: product.category || '',
    stars: product.stars || 0,
    oldPrice: product.oldPrice ?? null,
    discount: product.discount ?? null,
    date: product.date,
  };
}

let items = products.map(mapFromFile);
let didTryApiHydrate = false;

/** Restores bundled seed + API re-fetch flag (for tests only). */
export function __resetItemServiceForTests() {
  items = products.map(mapFromFile);
  didTryApiHydrate = false;
}

async function tryHydrateFromApi() {
  if (didTryApiHydrate) return;
  didTryApiHydrate = true;
  try {
    const res = await fetch(apiUrl('/api/products'));
    if (!res.ok) return;
    const data = await res.json();
    if (Array.isArray(data)) {
      items = data.map((row) => ({
        ...row,
        date: row.date,
      }));
    }
  } catch {
    /* keep bundled list */
  }
}

async function applyImageReconciliation() {
  const map = await getAvailableImages();
  items = reconcileProductImages(items, map);
}

/**
 * @returns {Promise<Array<{
 *   id: number,
 *   name: string,
 *   price: number,
 *   image: string | null,
 *   description: string,
 *   category: string,
 *   stars: number,
 *   oldPrice: number | null,
 *   discount: number | null,
 *   date?: string
 * }>>}
 */
export async function getItems() {
  await tryHydrateFromApi();
  await applyImageReconciliation();
  return [...items];
}

export const addItem = (item) => {
  const newItem = { ...item, id: Math.max(0, ...items.map((i) => i.id)) + 1 };
  items.push(newItem);
  return Promise.resolve(newItem);
};

export const updateItem = (id, updates) => {
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) return Promise.resolve(null);
  items[idx] = { ...items[idx], ...updates };
  return Promise.resolve(items[idx]);
};

export const deleteItem = (id) => {
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) return Promise.resolve(false);
  items.splice(idx, 1);
  return Promise.resolve(true);
};

/** Re-sync products from API (if up) and re-scan images from disk / API manifest. */
export async function refreshItems() {
  didTryApiHydrate = false;
  await tryHydrateFromApi();
  await applyImageReconciliation();
  return [...items];
}
