// src/components/ImageViewer.jsx
import React, { useEffect, useState } from 'react';
import { getAvailableImages } from '../utils/imageScanner';

const ImageViewer = () => {
  const [availableImages, setAvailableImages] = useState({});

  useEffect(() => {
    getAvailableImages().then(setAvailableImages);
  }, []);

  return (
    <div className="image-viewer">
      <h3>Available Images in /public/images/</h3>
      <p className="text-muted small">
        List comes from the API when the server is running (live folder scan); otherwise from the Vite build scan.
      </p>
      <div className="image-grid">
        {Object.entries(availableImages).map(([name, path]) => (
          <div key={name} className="image-item">
            <img src={path} alt={name} />
            <p>{name}</p>
            <small>{path}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageViewer;
