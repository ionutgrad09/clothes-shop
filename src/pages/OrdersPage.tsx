import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Order } from '../types';
import './OrdersPage.css';

const STATUS_COLORS: Record<string, string> = {
  pending: '#c8a96e',
  processing: '#3498db',
  shipped: '#9b59b6',
  delivered: '#27ae60',
  cancelled: '#c0392b',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.orders.list()
      .then(({ orders }) => setOrders(orders || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{display:'flex',justifyContent:'center',padding:'80px'}}>
      <div className="spinner" />
    </div>
  );

  return (
    <div className="orders-page">
      <div className="container">
        <h1 className="orders-title">My Orders</h1>
        <p className="orders-subtitle">{orders.length} orders</p>

        {orders.length === 0 ? (
          <div className="orders-empty">
            <span>📦</span>
            <h3>No orders yet</h3>
            <p>When you place an order, it will appear here</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div>
                    <p className="order-id">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                    <p className="order-date">
                      {new Date(order.created_at).toLocaleDateString('en-US', {
                        year:'numeric', month:'long', day:'numeric'
                      })}
                    </p>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <span
                      className="order-status"
                      style={{background: STATUS_COLORS[order.status] + '20', color: STATUS_COLORS[order.status]}}
                    >
                      {order.status}
                    </span>
                    <p className="order-total">${order.total.toFixed(2)}</p>
                  </div>
                </div>

                <div className="order-items">
                  {order.items.map((item, i) => (
                    <div key={i} className="order-item">
                      <span className="order-item-name">{item.product_name}</span>
                      <span className="order-item-meta">{item.size} · {item.color} · ×{item.quantity}</span>
                      <span className="order-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <span>📍 {order.shipping_address}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
