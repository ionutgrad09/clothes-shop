import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import './ProductCard.css';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <div className="product-image">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} loading="lazy" />
        ) : (
          <div className="product-placeholder">
            <span>👗</span>
          </div>
        )}
        <div className="product-overlay">
          <span className="view-btn">View Details</span>
        </div>
      </div>
      <div className="product-info">
        <div className="product-category">{product.category}</div>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-footer">
          <span className="product-price">${product.price.toFixed(2)}</span>
          {product.stock === 0 && <span className="out-of-stock">Out of stock</span>}
          {product.stock > 0 && product.stock <= 5 && (
            <span className="low-stock">Only {product.stock} left</span>
          )}
        </div>
      </div>
    </Link>
  );
}
