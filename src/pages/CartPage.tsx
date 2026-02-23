import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { api } from '../lib/api';
import './CartPage.css';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, total, count } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [ordering, setOrdering] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleOrder = async () => {
    if (!user) { navigate('/login'); return; }
    if (!address.trim()) { setError('Please enter a shipping address'); return; }
    setOrdering(true);
    setError('');
    try {
      const orderItems = items.map(i => ({
        product_id: i.product.id,
        product_name: i.product.name,
        quantity: i.quantity,
        price: i.product.price,
        size: i.size,
        color: i.color,
      }));
      await api.orders.create(orderItems, address);
      clearCart();
      setSuccess(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setOrdering(false);
    }
  };

  if (success) return (
    <div className="cart-success">
      <div className="success-icon">✓</div>
      <h2>Order Placed!</h2>
      <p>Thank you for your order. We'll send you a confirmation shortly.</p>
      <div style={{display:'flex',gap:'16px',marginTop:'32px'}}>
        <Link to="/orders" className="btn btn-primary">View Orders</Link>
        <Link to="/products" className="btn btn-outline">Continue Shopping</Link>
      </div>
    </div>
  );

  if (count === 0) return (
    <div className="cart-empty">
      <span>🛍️</span>
      <h2>Your cart is empty</h2>
      <p>Add some items to get started</p>
      <Link to="/products" className="btn btn-primary" style={{marginTop:'24px'}}>
        Shop Now
      </Link>
    </div>
  );

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="cart-title">Shopping Basket</h1>
        <p className="cart-subtitle">{count} {count === 1 ? 'item' : 'items'}</p>

        <div className="cart-layout">
          {/* Items */}
          <div className="cart-items">
            {items.map(item => (
              <div key={`${item.product.id}-${item.size}-${item.color}`} className="cart-item">
                <div className="cart-item-image">
                  {item.product.image_url ? (
                    <img src={item.product.image_url} alt={item.product.name} />
                  ) : (
                    <span style={{fontSize:'32px'}}>👗</span>
                  )}
                </div>
                <div className="cart-item-info">
                  <div className="cart-item-top">
                    <div>
                      <p className="cart-item-category">{item.product.category}</p>
                      <h3 className="cart-item-name">{item.product.name}</h3>
                      <p className="cart-item-meta">
                        Size: {item.size} · Color: {item.color}
                      </p>
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => removeItem(item.product.id, item.size, item.color)}
                    >
                      ✕
                    </button>
                  </div>
                  <div className="cart-item-bottom">
                    <div className="qty-control">
                      <button onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}>+</button>
                    </div>
                    <span className="cart-item-price">${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="cart-summary">
            <h2>Order Summary</h2>

            <div className="summary-lines">
              <div className="summary-line">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="summary-line">
                <span>Shipping</span>
                <span>{total >= 100 ? 'Free' : '$9.99'}</span>
              </div>
              <div className="summary-line total">
                <span>Total</span>
                <span>${(total >= 100 ? total : total + 9.99).toFixed(2)}</span>
              </div>
            </div>

            <div className="shipping-field">
              <label>Shipping Address</label>
              <textarea
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Enter your full shipping address..."
                rows={3}
              />
            </div>

            {error && <div className="error-msg">{error}</div>}

            {!user ? (
              <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                <Link to="/login" className="btn btn-primary" style={{width:'100%'}}>
                  Sign In to Checkout
                </Link>
                <Link to="/register" className="btn btn-outline" style={{width:'100%',textAlign:'center'}}>
                  Create Account
                </Link>
              </div>
            ) : (
              <button
                className="btn btn-primary"
                style={{width:'100%',padding:'16px'}}
                onClick={handleOrder}
                disabled={ordering}
              >
                {ordering ? 'Placing Order...' : 'Place Order'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
