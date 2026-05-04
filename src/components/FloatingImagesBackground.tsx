import React, { useEffect, useState } from 'react';
import { getItems } from '../services/itemService';
import '../styles/FloatingImages.css';

export default function FloatingImagesBackground() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    getItems().then(items => {
      setImages(items.filter(i => i.image).map(i => i.image.startsWith('/') ? i.image : `/images/${i.image}`));
    });
  }, []);

  return (
    <div className="floating-images-bg">
      {images.map((img, idx) => (
        <img
          key={idx}
          src={img}
          alt="catalog product"
          className={`floating-img floating-img-${idx % 8}`}
          draggable="false"
        />
      ))}
    </div>
  );
}
