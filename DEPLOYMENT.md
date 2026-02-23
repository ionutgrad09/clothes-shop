# DRAPE — Full Deployment Guide
## React + Netlify Functions + Supabase PostgreSQL

---

## 📁 Project Structure

```
clotheshop/
├── netlify/
│   └── functions/              ← Serverless API functions
│       ├── _helpers.ts         ← Shared utilities
│       ├── auth-register.ts
│       ├── auth-login.ts
│       ├── auth-me.ts
│       ├── products-list.ts
│       ├── products-get.ts
│       ├── products-create.ts
│       ├── products-update.ts
│       ├── products-delete.ts
│       ├── orders-create.ts
│       ├── orders-list.ts
│       └── orders-admin-list.ts
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── layout/             ← Navbar
│   │   └── shop/               ← ProductCard
│   ├── hooks/
│   │   ├── useAuth.tsx         ← Auth context
│   │   └── useCart.tsx         ← Cart context
│   ├── lib/
│   │   ├── api.ts              ← API client
│   │   └── supabase.ts         ← Supabase client
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── ProductsPage.tsx
│   │   ├── ProductDetailPage.tsx
│   │   ├── CartPage.tsx
│   │   ├── OrdersPage.tsx
│   │   ├── ProfilePage.tsx
│   │   └── AdminPage.tsx
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── App.css
│   └── index.tsx
├── .env.example
├── .gitignore
├── netlify.toml
├── package.json
├── supabase-schema.sql         ← Run this in Supabase
└── tsconfig.json
```

---

## PART 1: Set Up Supabase (Database)

### Step 1 — Create a Supabase Account & Project

1. Go to **https://supabase.com** and click **Start your project**
2. Sign up (GitHub login is fastest)
3. Click **New Project**
4. Fill in:
   - **Organization**: Create one or use default
   - **Name**: `drape-shop` (or any name)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users
5. Click **Create new project** — wait ~2 minutes for it to initialize

### Step 2 — Run the Database Schema

1. In your Supabase dashboard, click **SQL Editor** in the left sidebar
2. Click **New query**
3. Open `supabase-schema.sql` from the project and paste the entire contents
4. Click **Run** (or press `Ctrl+Enter`)
5. You should see "Success. No rows returned" — tables and seed data are created

### Step 3 — Get Your API Keys

1. In the left sidebar, click **Project Settings** → **API**
2. Copy and save these values:
   - **Project URL** → e.g. `https://abcdefghijk.supabase.co`
   - **anon / public key** → long JWT string
   - **service_role key** → ⚠️ SECRET! Never expose publicly

---

## PART 2: Set Up Netlify (Frontend + Functions)

### Step 4 — Install Netlify CLI & Dependencies

```bash
# Install dependencies
npm install

# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login
```

### Step 5 — Create a GitHub Repository

```bash
# Initialize git in your project folder
cd clotheshop
git init
git add .
git commit -m "Initial commit: DRAPE clothes shop"

# Create a repo on GitHub (github.com → New repository)
# Then push:
git remote add origin https://github.com/YOUR_USERNAME/drape-shop.git
git branch -M main
git push -u origin main
```

### Step 6 — Deploy to Netlify

#### Option A: Via Netlify Dashboard (Recommended)

1. Go to **https://app.netlify.com**
2. Click **Add new site** → **Import an existing project**
3. Choose **GitHub**
4. Authorize Netlify and select your repository (`drape-shop`)
5. Configure build settings:
   - **Branch**: `main`
   - **Build command**: `npm run build`
   - **Publish directory**: `build`
6. Click **Deploy site**

#### Option B: Via CLI

```bash
netlify init
# Follow prompts: Create & configure a new site
# Build command: npm run build
# Directory to deploy: build

netlify deploy --prod
```

### Step 7 — Configure Environment Variables in Netlify

This is **critical** — your functions won't work without these.

1. In Netlify dashboard → your site → **Site configuration** → **Environment variables**
2. Click **Add a variable** for each of the following:

| Variable Name | Value | Description |
|---|---|---|
| `REACT_APP_SUPABASE_URL` | `https://xxx.supabase.co` | For React frontend |
| `REACT_APP_SUPABASE_ANON_KEY` | `eyJhbG...` (anon key) | For React frontend |
| `SUPABASE_URL` | `https://xxx.supabase.co` | For Netlify functions |
| `SUPABASE_SERVICE_KEY` | `eyJhbG...` (service role key) | For Netlify functions |
| `JWT_SECRET` | Any random 32+ char string | Signs auth tokens |

3. After adding all variables, go to **Deploys** → **Trigger deploy** → **Deploy site**

> 💡 **Generate a JWT_SECRET**: Run this in terminal:
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

### Step 8 — Install Function Dependencies

The Netlify functions need `jsonwebtoken`, `bcryptjs`, and `@supabase/supabase-js`. Add them to package.json:

```bash
npm install jsonwebtoken bcryptjs @types/jsonwebtoken @types/bcryptjs
```

Commit and push — Netlify will auto-redeploy:
```bash
git add .
git commit -m "Add function dependencies"
git push
```

---

## PART 3: Test Your Deployment

### Step 9 — Verify Everything Works

1. Visit your Netlify URL (e.g. `https://drape-shop.netlify.app`)
2. Test these flows:
   - ✅ Register a new account
   - ✅ Log in
   - ✅ Browse products (sample data was seeded)
   - ✅ Add to cart, place order
   - ✅ View orders in profile
3. Test admin:
   - Email: `admin@drape.com`
   - Password: `admin123`
   - Navigate to `/admin` to add products

> ⚠️ **Change the admin password!** After first login, the default password is `admin123`. Update it by directly modifying the users table in Supabase with a new bcrypt hash, or add a password-change endpoint.

---

## PART 4: Local Development

### Step 10 — Run Locally

```bash
# Copy the example env file
cp .env.example .env

# Fill in your Supabase values in .env
# Then run both frontend and functions:
netlify dev
```

`netlify dev` starts:
- React app at `http://localhost:3000`
- Netlify functions at `http://localhost:8888`
- Proxies `/api/*` → `/.netlify/functions/*` automatically

---

## PART 5: Admin Setup

### Creating Additional Admins

To make a user an admin, run this SQL in Supabase SQL Editor:

```sql
UPDATE users
SET role = 'admin'
WHERE email = 'user@example.com';
```

---

## Architecture Overview

```
Browser (React)
    │
    │  HTTPS requests to /api/*
    ▼
Netlify CDN (serves build/)
    │
    │  Proxied to /.netlify/functions/*
    ▼
Netlify Functions (Node.js serverless)
    │  JWT verification, business logic
    │
    ▼
Supabase PostgreSQL
    │  users, products, orders tables
```

**Authentication Flow:**
1. User registers/logs in → function creates/verifies user in DB → returns JWT
2. JWT stored in `localStorage`
3. Every API request sends `Authorization: Bearer <token>`
4. Functions verify JWT, extract userId/role, then query DB

---

## Features Summary

| Feature | Route | Auth Required |
|---|---|---|
| View products | `GET /products` | No |
| Search products | `GET /products?search=silk` | No |
| Register | `POST /auth-register` | No |
| Login | `POST /auth-login` | No |
| View profile | `GET /auth-me` | Yes |
| Place order | `POST /orders-create` | Yes |
| View my orders | `GET /orders-list` | Yes |
| Create product | `POST /products-create` | Admin only |
| Edit product | `PUT /products-update` | Admin only |
| Delete product | `DELETE /products-delete` | Admin only |
| All orders | `GET /orders-admin-list` | Admin only |

---

## Troubleshooting

**Functions return 500 errors?**
- Check Netlify → Functions → Logs for error details
- Verify all 5 environment variables are set correctly
- Make sure Supabase service key (not anon key) is in `SUPABASE_SERVICE_KEY`

**"Cannot find module" in functions?**
- Run `npm install jsonwebtoken bcryptjs` and push again

**Products not loading?**
- Check if `supabase-schema.sql` was run successfully
- Verify `REACT_APP_SUPABASE_URL` is set (with `REACT_APP_` prefix)

**CORS errors?**
- The `_helpers.ts` cors() function handles this — ensure functions return the correct headers

**Admin login fails?**
- The default hash in the SQL is for `admin123`
- If it still fails, generate a new hash:
  ```bash
  node -e "const b=require('bcryptjs');b.hash('admin123',10).then(console.log)"
  ```
  Then update the SQL seed with the new hash.
