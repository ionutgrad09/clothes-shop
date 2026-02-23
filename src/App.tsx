import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { CartProvider } from './hooks/useCart';
import Navbar from './components/layout/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import AdminPage from './pages/AdminPage';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1a1a2e', light: '#16213e', dark: '#0f0f1a', contrastText: '#ffffff' },
    secondary: { main: '#c8963c', light: '#e0b96a', dark: '#a67a2e', contrastText: '#ffffff' },
    background: { default: '#fafaf8', paper: '#ffffff' },
    text: { primary: '#1a1a2e', secondary: '#6b6b80' },
    error: { main: '#d32f2f' },
    success: { main: '#2e7d32' },
    divider: '#e8e4dc',
  },
  typography: {
    fontFamily: '"DM Sans", "Helvetica Neue", Arial, sans-serif',
    h1: { fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 400 },
    h2: { fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 400 },
    h3: { fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 400 },
    h4: { fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 500 },
    h5: { fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 500 },
    h6: { fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 500 },
    button: { fontWeight: 500, letterSpacing: '0.06em' },
  },
  shape: { borderRadius: 4 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em', padding: '10px 24px', borderRadius: 2 },
        containedPrimary: { background: '#1a1a2e', '&:hover': { background: '#2d2d4e' } },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined', fullWidth: true },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            '& fieldset': { borderColor: '#e8e4dc' },
            '&:hover fieldset': { borderColor: '#1a1a2e' },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: { root: { borderRadius: 4, boxShadow: 'none', border: '1px solid #e8e4dc' } },
    },
    MuiChip: {
      styleOverrides: { root: { borderRadius: 2, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.08em' } },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { background: 'rgba(250,250,248,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #e8e4dc', boxShadow: 'none' },
      },
    },
    MuiCssBaseline: {
      styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        body { background-color: #fafaf8; }
      `,
    },
  },
});

function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
