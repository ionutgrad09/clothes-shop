import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const categories = [
  { name: 'Tops', emoji: '👕', desc: 'Blouses, shirts & tees' },
  { name: 'Bottoms', emoji: '👖', desc: 'Trousers, skirts & shorts' },
  { name: 'Dresses', emoji: '👗', desc: 'From casual to couture' },
  { name: 'Outerwear', emoji: '🧥', desc: 'Coats, jackets & blazers' },
  { name: 'Accessories', emoji: '👜', desc: 'Bags, scarves & more' },
];

export default function HomePage() {
  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <p className="hero-eyebrow">New Collection · 2025</p>
          <h1 className="hero-title">
            Dress with<br />
            <em>intention.</em>
          </h1>
          <p className="hero-desc">
            Thoughtfully designed pieces for the modern wardrobe.
            Quality that lasts, style that endures.
          </p>
          <Link to="/products" className="btn btn-primary hero-cta">
            Explore Collection
          </Link>
        </div>
        <div className="hero-visual">
          <div className="hero-orb" />
          <div className="hero-lines">
            {Array.from({length:8}).map((_,i) => (
              <div key={i} className="hero-line" style={{animationDelay: `${i*0.15}s`}} />
            ))}
          </div>
          <div className="hero-badge">
            <span>Est.</span>
            <strong>2025</strong>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories">
        <div className="container">
          <div className="section-header">
            <h2>Shop by Category</h2>
            <Link to="/products" className="see-all">View All →</Link>
          </div>
          <div className="category-grid">
            {categories.map(cat => (
              <Link
                key={cat.name}
                to={`/products?category=${cat.name.toLowerCase()}`}
                className="category-card"
              >
                <span className="category-emoji">{cat.emoji}</span>
                <h3>{cat.name}</h3>
                <p>{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="values">
        <div className="container">
          <div className="values-grid">
            {[
              { icon: '✦', title: 'Sustainable', desc: 'Ethically sourced materials' },
              { icon: '◈', title: 'Free Returns', desc: '30-day hassle-free returns' },
              { icon: '◉', title: 'Quality First', desc: 'Garments made to last' },
              { icon: '◊', title: 'Free Shipping', desc: 'On orders over $100' },
            ].map(v => (
              <div key={v.title} className="value-item">
                <span className="value-icon">{v.icon}</span>
                <h4>{v.title}</h4>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
