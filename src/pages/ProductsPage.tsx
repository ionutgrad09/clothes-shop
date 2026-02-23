import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box, Container, Typography, Grid, TextField, InputAdornment,
  ToggleButtonGroup, ToggleButton, Skeleton, Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { api } from '../lib/api';
import { Product } from '../types';
import ProductCard from '../components/shop/ProductCard';

const CATEGORIES = ['All', 'Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Accessories'];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'all');

  useEffect(() => {
    const timer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timer);
  }, [search, activeCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const cat = activeCategory === 'all' ? undefined : activeCategory;
      const { products } = await api.products.list(search || undefined, cat);
      setProducts(products || []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCategory = (_: any, val: string) => {
    if (!val) return;
    setActiveCategory(val);
    setSearchParams(val === 'all' ? {} : { category: val });
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 8 }}>
        <Container maxWidth="xl">
          <Typography variant="h2" sx={{ color: 'white', fontSize: { xs: '2.5rem', md: '3.5rem' }, mb: 1 }}>
            All Products
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', letterSpacing: '0.05em' }}>
            {products.length} pieces in collection
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 6 }}>
        {/* Toolbar */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 5, alignItems: 'center' }}>
          <TextField
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{ minWidth: 280, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'text.secondary', fontSize: '1.1rem' }} /></InputAdornment>,
            }}
          />
          <ToggleButtonGroup
            value={activeCategory}
            exclusive
            onChange={handleCategory}
            size="small"
            sx={{
              flexWrap: 'wrap',
              '& .MuiToggleButton-root': {
                fontSize: '0.65rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontWeight: 500,
                px: 2,
                py: 0.75,
                border: '1px solid',
                borderColor: 'divider',
                color: 'text.secondary',
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'white',
                  borderColor: 'primary.main',
                  '&:hover': { bgcolor: 'primary.light' },
                },
              },
            }}
          >
            {CATEGORIES.map((cat) => (
              <ToggleButton key={cat} value={cat.toLowerCase()}>{cat}</ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}

        {loading ? (
          <Grid container spacing={3}>
            {Array.from({ length: 8 }).map((_, i) => (
              <Grid item xs={6} sm={4} md={3} key={i}>
                <Skeleton variant="rectangular" sx={{ borderRadius: 1, aspectRatio: '3/4', width: '100%' }} />
                <Skeleton sx={{ mt: 1 }} />
                <Skeleton width="60%" />
              </Grid>
            ))}
          </Grid>
        ) : products.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 12 }}>
            <Typography sx={{ fontSize: '4rem', mb: 2 }}>🔍</Typography>
            <Typography variant="h4" sx={{ mb: 1 }}>No products found</Typography>
            <Typography color="text.secondary">Try adjusting your search or filter</Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {products.map((p) => (
              <Grid item xs={6} sm={4} md={3} key={p.id}>
                <ProductCard product={p} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
