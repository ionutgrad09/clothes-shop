-- ===================================================
-- DRAPE Clothes Shop - Supabase Database Schema
-- Run this in Supabase SQL Editor
-- ===================================================

-- Users table (custom auth, NOT Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  category TEXT NOT NULL,
  sizes TEXT[] DEFAULT '{}',
  colors TEXT[] DEFAULT '{}',
  image_url TEXT,
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  items JSONB NOT NULL DEFAULT '[]',
  total NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  shipping_address TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_name ON products USING GIN (to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ===================================================
-- Disable RLS (we use JWT + service key in functions)
-- ===================================================
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;

-- ===================================================
-- Seed: Create admin user
-- Password: admin123 (bcrypt hash)
-- CHANGE THIS PASSWORD after first login!
-- ===================================================
INSERT INTO users (email, name, password_hash, role)
VALUES (
  'admin@drape.com',
  'Admin',
  '$2a$10$YxVPBtxCNUFiOGZEaVHmL.3E0mHC2JYuRPE3V3QgHqK8mGUWZvHMm',
  'admin'
) ON CONFLICT (email) DO NOTHING;

-- ===================================================
-- Seed: Sample products
-- ===================================================
INSERT INTO products (name, description, price, category, sizes, colors, image_url, stock) VALUES
(
  'Silk Wrap Blouse',
  'A luxurious silk wrap blouse with a flowing silhouette. Perfect for both casual and formal occasions.',
  189.00,
  'Tops',
  ARRAY['XS','S','M','L','XL'],
  ARRAY['Black','White','Navy'],
  'https://images.unsplash.com/photo-1594938298603-c8148c4b4283?w=800',
  45
),
(
  'Wide-Leg Trousers',
  'Elegant wide-leg trousers crafted from premium wool blend. A wardrobe essential.',
  245.00,
  'Bottoms',
  ARRAY['XS','S','M','L','XL','XXL'],
  ARRAY['Black','Beige','Gray'],
  'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800',
  30
),
(
  'Midi Wrap Dress',
  'A timeless midi wrap dress in lightweight crepe. Flattering on all body types.',
  320.00,
  'Dresses',
  ARRAY['XS','S','M','L','XL'],
  ARRAY['Black','Navy','Red'],
  'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800',
  20
),
(
  'Tailored Blazer',
  'A sharp, structured blazer with a modern slim fit. The cornerstone of any sophisticated wardrobe.',
  395.00,
  'Outerwear',
  ARRAY['XS','S','M','L','XL'],
  ARRAY['Black','Gray','Navy'],
  'https://images.unsplash.com/photo-1594938298603-c8148c4b4283?w=800',
  15
),
(
  'Linen Shirt',
  'Breathable linen shirt with a relaxed, airy feel. Perfect for warm weather.',
  125.00,
  'Tops',
  ARRAY['S','M','L','XL','XXL'],
  ARRAY['White','Beige','Blue'],
  'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800',
  60
),
(
  'Pleated Midi Skirt',
  'Elegant pleated midi skirt in flowing fabric. Pairs beautifully with tucked-in blouses.',
  175.00,
  'Bottoms',
  ARRAY['XS','S','M','L','XL'],
  ARRAY['Black','Beige'],
  'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800',
  25
),
(
  'Cashmere Coat',
  'A luxurious cashmere overcoat with a timeless silhouette. Investment dressing at its finest.',
  890.00,
  'Outerwear',
  ARRAY['XS','S','M','L','XL'],
  ARRAY['Camel','Black','Gray'],
  'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800',
  8
),
(
  'Slip Dress',
  'A minimalist slip dress in bias-cut satin. Effortlessly chic for evening wear.',
  265.00,
  'Dresses',
  ARRAY['XS','S','M','L'],
  ARRAY['Black','Champagne','Navy'],
  'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800',
  18
);
