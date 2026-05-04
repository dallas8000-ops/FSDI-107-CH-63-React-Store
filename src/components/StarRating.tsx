// src/components/StarRating.jsx

import React from 'react';

export default function StarRating({ rating }) {
  const maxStars = 5;
  const fullStars = Math.floor(rating);
  const remainingStars = maxStars - fullStars;

  // Use a star character (★) for simplicity
  const fullStarChar = "★";
  const emptyStarChar = "☆";

  const stars = [];

  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <span key={`full-${i}`} style={{ color: '#ffa500' }}>
        {fullStarChar}
      </span>
    );
  }

  // Add empty stars (or half-star logic can be more complex)
  for (let i = 0; i < remainingStars; i++) {
    stars.push(
      <span key={`empty-${i}`} style={{ color: '#ccc' }}>
        {emptyStarChar}
      </span>
    );
  }

  return (
    <div title={`Rated ${rating} out of 5 stars`} style={{ display: 'inline-block' }}>
      {stars}
    </div>
  );
}