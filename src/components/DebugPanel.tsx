// src/components/DebugPanel.jsx
import React, { useState, useEffect } from 'react';
import { getAvailableImages } from '../utils/imageScanner';
import { refreshItems, getItems } from '../services/itemService';

const DebugPanel = () => {
  const [images, setImages] = useState({});
  const [items, setItems] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    getItems().then((itemsData) => {
      setItems(itemsData);
    });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      getAvailableImages().then(setImages);
    }, 0);
  }, []);

  const handleRefresh = () => {
    refreshItems().then((itemsData) => {
      setItems(itemsData);
      getAvailableImages().then(setImages);
    });
  };

  return (
    <div className={`debug-panel ${isExpanded ? 'expanded' : ''}`}>
      <button type="button" className="debug-toggle" onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? '🔧 Hide Debug' : '🔧 Show Debug'}
      </button>

      {isExpanded && (
        <div className="debug-content">
          <button type="button" onClick={handleRefresh} className="refresh-button">
            🔄 Refresh Items
          </button>

          <h4>Available Images:</h4>
          <pre>{JSON.stringify(images, null, 2)}</pre>

          <h4>Items with Image Paths:</h4>
          <pre>
            {JSON.stringify(
              items.map((item) => ({
                name: item.name,
                image: item.image,
              })),
              null,
              2
            )}
          </pre>
        </div>
      )}
    </div>
  );
};

export default DebugPanel;
