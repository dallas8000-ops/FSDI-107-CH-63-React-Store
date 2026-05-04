import React from 'react';
import { IconTrash } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import '../styles/Cart.css'; 

export default function Cart({ cartItems, onUpdateQuantity, onRemoveFromCart, onClearCart }) {
  console.log('[Cart Debug] cartItems:', cartItems);
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  if (cartItems.length === 0) {
    return (
      <div className="cart-summary empty-cart">
        <h2>🛒 Cart is Empty</h2>
        <p>Your shopping cart is currently empty. Add items from the catalog!</p>
      </div>
    );
  }

  return (
    <div className="cart-summary">
      <div className="cart-header">
        <h2>🛒 Shopping Cart ({totalItems} items)</h2>
        <button className="clear-cart-btn" onClick={onClearCart}>
          Clear Cart
        </button>
        <button style={{marginLeft: '1rem', background: '#eee', color: '#333', border: '1px solid #ccc', borderRadius: '6px', padding: '0.5rem 1rem'}}
          onClick={() => console.log('Current cart items:', cartItems)}>
          Log Cart Items
        </button>
      </div>
      <div className="cart-items-list">
        {cartItems.map(item => {
          console.log('Cart item:', item);
          return (
            <div key={item.id} className="cart-item">
              {/* Debug: Warn if image property is missing or empty */}
              {(!item.image || item.image === "") && console.warn(`Cart item with id ${item.id} is missing image property!`, item)}
              {/* Hardcoded test image to diagnose image loading */}
              <img
                src="/images/keyboard.jpg"
                alt="Test Keyboard"
                style={{ width: 100, height: 100, border: '2px solid red' }}
              />
              {/* Debug: Show image path under image */}
              <div style={{ fontSize: '0.7em', color: '#888', wordBreak: 'break-all' }}>
                image: {item.image ? (item.image.startsWith('/') ? item.image : `/images/${item.image}`) : '/images/Placeholder.jpg'}
              </div>
              <div className="cart-item-details">
                <span className="item-name">{item.name}</span>
                <span className="item-unit-price">${item.price.toFixed(2)} each</span>
              </div>
              <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
              <div className="item-controls">
                {/* Decrease Quantity Button */}
                <button 
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1} 
                  className="qty-btn"
                >
                  −
                </button>
                {/* Quantity Input */}
                <input 
                  type="number" 
                  value={item.quantity} 
                  min="1"
                  onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                  className="qty-input"
                />
                {/* Increase Quantity Button */}
                <button 
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  className="qty-btn"
                >
                  +
                </button>
                {/* Remove Button */}
                <button 
                  className="remove-btn"
                  onClick={() => onRemoveFromCart(item.id, 0)}
                  title="Remove from cart"
                  style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <IconTrash size={18} color="#E94F37" /> Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="cart-total">
        <strong>Total: ${cartTotal.toFixed(2)}</strong>
        <Link to="/shipping" className="checkout-btn">Proceed to Shipping →</Link>
      </div>
    </div>
  );
}