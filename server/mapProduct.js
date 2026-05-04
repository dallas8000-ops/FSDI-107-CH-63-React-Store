/** Map DB row to API / client product shape */
export function rowToProduct(row) {
  const d = row.product_date;
  let dateStr;
  if (d instanceof Date) {
    dateStr = d.toISOString().slice(0, 10);
  } else if (typeof d === 'string') {
    dateStr = d.slice(0, 10);
  }

  return {
    id: row.id,
    name: row.name,
    price: row.price != null ? Number(row.price) : 0,
    image: row.image || '',
    description: row.description || '',
    category: row.category || '',
    stars: row.stars != null ? Number(row.stars) : 0,
    oldPrice: row.old_price != null ? Number(row.old_price) : null,
    discount: row.discount != null ? Number(row.discount) : null,
    date: dateStr,
  };
}
