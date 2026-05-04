import React from 'react';
import '../styles/QuantityPicker.css';

const QuantityPicker = ({ value = 0, onChange }) => {
  const set = (v) => onChange(Math.max(0, v));

  return (
    <div className="qty-picker">
      <button type="button" onClick={() => set(value - 1)} disabled={value <= 0}>
        −
      </button>
      <input
        type="number"
        value={value}
        onChange={(e) => {
          const num = parseInt(e.target.value, 10);
          set(isNaN(num) ? 0 : Math.max(0, num));
        }}
        min="0"
      />
      <button type="button" onClick={() => set(value + 1)}>
        +
      </button>
    </div>
  );
};

export default QuantityPicker;