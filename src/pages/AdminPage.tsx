import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Product, Order } from '../types';
import './AdminPage.css';

const CATEGORIES = ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Accessories'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const COLORS = ['Black', 'White', 'Navy', 'Gray', 'Beige', 'Red', 'Green', 'Blue'];

const emptyForm = {
  name: '', description: '', price: '', category: 'Tops',
  sizes: [] as string[], colors: [] as string[],
  image_url: '', stock: '',
};

export default function AdminPage() {
  const [tab, setTab] = useState<'products' | 'orders'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [{ products }, { orders }] = await Promise.all([
        api.products.list(),
        api.orders.adminList(),
      ]);
      setProducts(products || []);
      setOrders(orders || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleSize = (s: string) => {
    setForm(f => ({
      ...f,
      sizes: f.sizes.includes(s) ? f.sizes.filter(x => x !== s) : [...f.sizes, s],
    }));
  };

  const toggleColor = (c: string) => {
    setForm(f => ({
      ...f,
      colors: f.colors.includes(c) ? f.colors.filter(x => x !== c) : [...f.colors, c],
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const data = {
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
      };
      if (editId) {
        await api.products.update(editId, data);
        setMsg('Product updated!');
      } else {
        await api.products.create(data);
        setMsg('Product created!');
      }
      setForm(emptyForm);
      setEditId(null);
      setShowForm(false);
      fetchData();
      setTimeout(() => setMsg(''), 3000);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (p: Product) => {
    setForm({
      name: p.name, description: p.description || '',
      price: String(p.price), category: p.category,
      sizes: p.sizes || [], colors: p.colors || [],
      image_url: p.image_url || '', stock: String(p.stock),
    });
    setEditId(p.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.products.delete(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <h1>Admin Panel</h1>
          <div className="admin-tabs">
            <button className={tab === 'products' ? 'active' : ''} onClick={() => setTab('products')}>
              Products ({products.length})
            </button>
            <button className={tab === 'orders' ? 'active' : ''} onClick={() => setTab('orders')}>
              Orders ({orders.length})
            </button>
          </div>
        </div>

        {tab === 'products' && (
          <>
            <div className="admin-toolbar">
              {msg && <div style={{color:'var(--success)',fontSize:'14px',fontWeight:500}}>{msg}</div>}
              <div style={{flex:1}} />
              <button
                className="btn btn-primary"
                onClick={() => { setForm(emptyForm); setEditId(null); setShowForm(!showForm); }}
              >
                {showForm ? 'Cancel' : '+ Add Product'}
              </button>
            </div>

            {showForm && (
              <form className="product-form" onSubmit={handleSave}>
                <h2>{editId ? 'Edit Product' : 'New Product'}</h2>
                {error && <div className="error-msg">{error}</div>}

                <div className="form-grid">
                  <div className="form-group">
                    <label>Product Name *</label>
                    <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required placeholder="e.g. Silk Blouse" />
                  </div>
                  <div className="form-group">
                    <label>Category *</label>
                    <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Price (USD) *</label>
                    <input type="number" step="0.01" min="0" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required placeholder="99.00" />
                  </div>
                  <div className="form-group">
                    <label>Stock Quantity *</label>
                    <input type="number" min="0" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} required placeholder="100" />
                  </div>
                  <div className="form-group" style={{gridColumn:'1/-1'}}>
                    <label>Image URL</label>
                    <input value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} placeholder="https://..." />
                  </div>
                  <div className="form-group" style={{gridColumn:'1/-1'}}>
                    <label>Description</label>
                    <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Describe the product..." />
                  </div>
                </div>

                <div className="form-group">
                  <label>Sizes</label>
                  <div className="toggle-group">
                    {SIZES.map(s => (
                      <button type="button" key={s} className={`toggle-btn ${form.sizes.includes(s) ? 'active' : ''}`} onClick={() => toggleSize(s)}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Colors</label>
                  <div className="toggle-group">
                    {COLORS.map(c => (
                      <button type="button" key={c} className={`toggle-btn ${form.colors.includes(c) ? 'active' : ''}`} onClick={() => toggleColor(c)}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{display:'flex',gap:'12px',marginTop:'8px'}}>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Saving...' : editId ? 'Update Product' : 'Create Product'}
                  </button>
                  <button type="button" className="btn btn-outline" onClick={() => { setShowForm(false); setEditId(null); setForm(emptyForm); }}>
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {loading ? (
              <div style={{textAlign:'center',padding:'60px'}}><div className="spinner" style={{margin:'0 auto'}} /></div>
            ) : (
              <div className="admin-products-table">
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.id}>
                        <td>
                          <div className="table-product">
                            {p.image_url ? (
                              <img src={p.image_url} alt={p.name} />
                            ) : (
                              <div className="table-product-placeholder">👗</div>
                            )}
                            <div>
                              <strong>{p.name}</strong>
                              <span>{p.description?.slice(0, 60) || '—'}</span>
                            </div>
                          </div>
                        </td>
                        <td><span className="tag">{p.category}</span></td>
                        <td className="price-cell">${p.price.toFixed(2)}</td>
                        <td>
                          <span className={`stock-badge ${p.stock === 0 ? 'out' : p.stock <= 5 ? 'low' : 'ok'}`}>
                            {p.stock}
                          </span>
                        </td>
                        <td>
                          <div style={{display:'flex',gap:'8px'}}>
                            <button className="btn btn-outline" style={{padding:'6px 14px',fontSize:'11px'}} onClick={() => handleEdit(p)}>
                              Edit
                            </button>
                            <button className="btn btn-danger" style={{padding:'6px 14px',fontSize:'11px'}} onClick={() => handleDelete(p.id)}>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {tab === 'orders' && (
          <div className="admin-orders">
            {loading ? (
              <div style={{textAlign:'center',padding:'60px'}}><div className="spinner" style={{margin:'0 auto'}} /></div>
            ) : orders.length === 0 ? (
              <div style={{textAlign:'center',padding:'80px',color:'var(--warm-gray)'}}>No orders yet</div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o: any) => (
                    <tr key={o.id}>
                      <td><code style={{fontSize:'12px'}}>#{o.id.slice(0,8).toUpperCase()}</code></td>
                      <td>
                        <div>
                          <strong>{o.users?.name || 'Unknown'}</strong>
                          <br />
                          <span style={{fontSize:'12px',color:'var(--warm-gray)'}}>{o.users?.email}</span>
                        </div>
                      </td>
                      <td>{o.items?.length || 0} items</td>
                      <td className="price-cell">${o.total.toFixed(2)}</td>
                      <td>
                        <span className="tag" style={{textTransform:'capitalize'}}>{o.status}</span>
                      </td>
                      <td style={{fontSize:'13px',color:'var(--warm-gray)'}}>
                        {new Date(o.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
