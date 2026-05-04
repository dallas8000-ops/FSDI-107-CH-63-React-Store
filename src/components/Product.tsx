import React from 'react';
import './Product.css';

export default function Product({ data }) {
  return (
    <div className="product-card">
      <img src={data.image} alt={data.title} />
      <h3>{data.title}</h3>
    </div>
  );
}