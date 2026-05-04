// src/services/catalogService.js
// Service that retrieves the list of items from memory

import { products } from '../data/products';

// Convert products to catalog format
const catalog = products.map((product) => ({
  id: product.id,
  title: product.name,
  image: product.image,
  price: product.price,
  description: product.description,
  category: product.category
}));

// Service function that retrieves items from memory
export const getCatalog = () => Promise.resolve(catalog);