import React, { useEffect, useState } from 'react';
import { getCatalog } from '../services/catalogService';
import Product from './Product';
import '../App.css';

export default function CatalogPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getCatalog().then(setItems);
  }, []);

  return (
    <div className="catalog-grid">
      {items.length
        ? items.map(p => <Product key={p.id} data={p} />)
        : <p className="no-results">Loading catalog…</p>
      }
    </div>
  );
}