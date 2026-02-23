import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Product } from '../types';
import { useCart } from '../hooks/useCart';
import './ProductDetailPage.css';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    if (!id) return;
    api.products.get(id)
      .then(({ product }) => {
        setProduct(product);
        if (product.sizes?.length) setSelectedSize(product.sizes[0]);
        if (product.colors?.length) setSelectedColor(product.colors[0]);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!product || !selectedSize || !selectedColor) return;
    addItem(product, quantity, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return (
    <div style={{display:'flex',justifyContent:'center',padding:'80px'}}>
      <div className="spinner" />
    </div>
  );

  if (!product) return (
    <div style={{textAlign:'center',padding:'80px'}}>
      <h2>Product not found</h2>
      <Link to="/products" className="btn btn-outline" style={{marginTop:'16px',display:'inline-flex'}}>
        Back to shop
      </Link>
    </div>
  );

  return (
    <div className="product-detail-page">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">Home</Link> / <Link to="/products">Shop</Link> / {product.name}
        </div>

        <div className="detail-grid">
          {/* Image */}
          <div className="detail-image">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} />
            ) : (
              <div className="detail-placeholder"><span>👗</span></div>
            )}
          </div>

          {/* Info */}
          <div className="detail-info">
            <p className="detail-category">{product.category}</p>
            <h1 className="detail-title">{product.name}</h1>
            <p className="detail-price">${product.price.toFixed(2)}</p>

            {product.description && (
              <p className="detail-desc">{product.description}</p>
            )}

            {/* Size selector */}
            {product.sizes?.length > 0 && (
              <div className="selector-group">
                <label>Size: <strong>{selectedSize}</strong></label>
                <div className="size-options">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color selector */}
            {product.colors?.length > 0 && (
              <div className="selector-group">
                <label>Color: <strong>{selectedColor}</strong></label>
                <div className="color-options">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      className={`color-btn ${selectedColor === color ? 'active' : ''}`}
                      onClick={() => setSelectedColor(color)}
                      title={color}
                      style={{ background: color.toLowerCase() }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="selector-group">
              <label>Quantity</label>
              <div className="quantity-input">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
              </div>
            </div>

            {product.stock === 0 ? (
              <button className="btn btn-outline" disabled style={{width:'100%',padding:'16px'}}>
                Out of Stock
              </button>
            ) : (
              <button
                className={`btn ${added ? 'btn-accent' : 'btn-primary'}`}
                style={{width:'100%',padding:'16px'}}
                onClick={handleAddToCart}
                disabled={!selectedSize || !selectedColor}
              >
                {added ? '✓ Added to Cart' : 'Add to Cart'}
              </button>
            )}

            {product.stock > 0 && product.stock <= 5 && (
              <p style={{textAlign:'center',fontSize:'12px',color:'var(--accent-dark)',marginTop:'8px'}}>
                Only {product.stock} left in stock
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
