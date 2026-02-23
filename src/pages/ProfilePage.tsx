import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-card">
          <div className="profile-avatar">
            {user.name[0].toUpperCase()}
          </div>
          <div className="profile-info">
            <h1>{user.name}</h1>
            <p className="profile-email">{user.email}</p>
            <span className={`profile-badge ${user.role}`}>{user.role}</span>
          </div>
        </div>

        <div className="profile-sections">
          <div className="profile-section">
            <h2>Account Details</h2>
            <div className="detail-rows">
              <div className="detail-row">
                <span>Full Name</span>
                <strong>{user.name}</strong>
              </div>
              <div className="detail-row">
                <span>Email</span>
                <strong>{user.email}</strong>
              </div>
              <div className="detail-row">
                <span>Account Type</span>
                <strong style={{textTransform:'capitalize'}}>{user.role}</strong>
              </div>
              <div className="detail-row">
                <span>Member Since</span>
                <strong>{new Date(user.created_at).toLocaleDateString('en-US', {year:'numeric',month:'long'})}</strong>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            <Link to="/orders" className="btn btn-outline">
              View Order History
            </Link>
            <Link to="/products" className="btn btn-primary">
              Continue Shopping
            </Link>
            {user.role === 'admin' && (
              <Link to="/admin" className="btn btn-accent">
                Admin Panel
              </Link>
            )}
            <button className="btn btn-ghost" onClick={logout}>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
