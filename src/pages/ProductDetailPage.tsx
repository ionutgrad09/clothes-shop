import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Box, Container, Typography, Button, Chip, Breadcrumbs,
  ToggleButtonGroup, ToggleButton, Alert, Snackbar, Divider, Skeleton, Stack,
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import CheckIcon from '@mui/icons-material/Check';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { api } from '../lib/api';
import { Product } from '../types';
import { useCart } from '../hooks/useCart';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [snack, setSnack] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    if (!id) return;
    api.products.get(id).then(({ product }) => {
      setProduct(product);
      if (product.sizes?.length) setSelectedSize(product.sizes[0]);
      if (product.colors?.length) setSelectedColor(product.colors[0]);
    }).finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!product || !selectedSize || !selectedColor) return;
    addItem(product, quantity, selectedSize, selectedColor);
    setSnack(true);
  };

  if (loading) return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <Grid2 container spacing={8}>
        <Box sx={{ flex: 1 }}><Skeleton variant="rectangular" sx={{ aspectRatio: '3/4', borderRadius: 2 }} /></Box>
        <Box sx={{ flex: 1 }}>
          <Skeleton height={60} sx={{ mb: 2 }} />
          <Skeleton height={40} width="40%" sx={{ mb: 3 }} />
          <Skeleton height={20} sx={{ mb: 1 }} />
          <Skeleton height={20} sx={{ mb: 1 }} />
          <Skeleton height={20} width="70%" />
        </Box>
      </Grid2>
    </Container>
  );

  if (!product) return (
    <Container sx={{ py: 10, textAlign: 'center' }}>
      <Typography variant="h4" sx={{ mb: 2 }}>Product not found</Typography>
      <Button component={Link} to="/products" variant="outlined">Back to Shop</Button>
    </Container>
  );

  const toggleButtonSx = {
    '& .MuiToggleButton-root': {
      fontSize: '0.75rem', fontWeight: 600, borderRadius: '2px !important',
      minWidth: 48, border: '1px solid', borderColor: 'divider',
      '&.Mui-selected': { bgcolor: 'primary.main', color: 'white', borderColor: 'primary.main' },
    },
  };

  return (
    <Container maxWidth="xl" sx={{ py: 5 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 4 }}>
        <Box component={Link} to="/" sx={{ color: 'text.secondary', textDecoration: 'none', fontSize: '0.8rem', '&:hover': { color: 'text.primary' } }}>Home</Box>
        <Box component={Link} to="/products" sx={{ color: 'text.secondary', textDecoration: 'none', fontSize: '0.8rem', '&:hover': { color: 'text.primary' } }}>Shop</Box>
        <Typography sx={{ fontSize: '0.8rem', color: 'text.primary' }}>{product.name}</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: { xs: 4, md: 8 } }}>
        {/* Image */}
        <Box sx={{ position: { md: 'sticky' }, top: 96, alignSelf: 'start', borderRadius: 2, overflow: 'hidden', bgcolor: '#f5f0e8', aspectRatio: '3/4' }}>
          {product.image_url ? (
            <Box component="img" src={product.image_url} alt={product.name} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8rem' }}>👗</Box>
          )}
        </Box>

        {/* Info */}
        <Box>
          <Chip label={product.category} size="small" color="secondary" sx={{ mb: 2, fontWeight: 600 }} />
          <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '3rem' }, mb: 2, lineHeight: 1.1 }}>
            {product.name}
          </Typography>
          <Typography variant="h4" sx={{ fontFamily: '"DM Sans"', fontWeight: 600, mb: 3, color: 'primary.main' }}>
            ${product.price.toFixed(2)}
          </Typography>

          {product.description && (
            <>
              <Typography color="text.secondary" sx={{ lineHeight: 1.8, mb: 3 }}>{product.description}</Typography>
              <Divider sx={{ mb: 3 }} />
            </>
          )}

          {/* Size */}
          {product.sizes?.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="overline" sx={{ fontSize: '0.65rem', letterSpacing: '0.15em', color: 'text.secondary', fontWeight: 600, display: 'block', mb: 1.5 }}>
                Size — <strong style={{ color: '#1a1a2e' }}>{selectedSize}</strong>
              </Typography>
              <ToggleButtonGroup value={selectedSize} exclusive onChange={(_, v) => v && setSelectedSize(v)} sx={toggleButtonSx}>
                {product.sizes.map((s) => <ToggleButton key={s} value={s}>{s}</ToggleButton>)}
              </ToggleButtonGroup>
            </Box>
          )}

          {/* Color */}
          {product.colors?.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="overline" sx={{ fontSize: '0.65rem', letterSpacing: '0.15em', color: 'text.secondary', fontWeight: 600, display: 'block', mb: 1.5 }}>
                Color — <strong style={{ color: '#1a1a2e' }}>{selectedColor}</strong>
              </Typography>
              <Stack direction="row" spacing={1}>
                {product.colors.map((color) => (
                  <Box
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    title={color}
                    sx={{
                      width: 32, height: 32, borderRadius: '50%',
                      bgcolor: color.toLowerCase(),
                      cursor: 'pointer',
                      border: '2px solid',
                      borderColor: selectedColor === color ? 'primary.main' : 'transparent',
                      boxShadow: selectedColor === color ? '0 0 0 2px white, 0 0 0 4px #1a1a2e' : '0 0 0 1px rgba(0,0,0,0.15)',
                      transition: 'all 0.15s',
                    }}
                  />
                ))}
              </Stack>
            </Box>
          )}

          {/* Quantity */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="overline" sx={{ fontSize: '0.65rem', letterSpacing: '0.15em', color: 'text.secondary', fontWeight: 600, display: 'block', mb: 1.5 }}>
              Quantity
            </Typography>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Button onClick={() => setQuantity(Math.max(1, quantity - 1))} sx={{ minWidth: 40, p: 1, fontSize: '1.2rem', borderRadius: 0 }}>−</Button>
              <Typography sx={{ px: 2.5, fontWeight: 600, minWidth: 40, textAlign: 'center' }}>{quantity}</Typography>
              <Button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} sx={{ minWidth: 40, p: 1, fontSize: '1.2rem', borderRadius: 0 }}>+</Button>
            </Box>
          </Box>

          {product.stock === 0 ? (
            <Button variant="outlined" disabled fullWidth size="large" sx={{ py: 1.75 }}>Out of Stock</Button>
          ) : (
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleAddToCart}
              disabled={!selectedSize || !selectedColor}
              startIcon={<AddShoppingCartIcon />}
              sx={{ py: 1.75 }}
            >
              Add to Cart
            </Button>
          )}

          {product.stock > 0 && product.stock <= 5 && (
            <Alert severity="warning" sx={{ mt: 2, borderRadius: 2 }}>Only {product.stock} items left in stock</Alert>
          )}
        </Box>
      </Box>

      <Snackbar
        open={snack}
        autoHideDuration={2500}
        onClose={() => setSnack(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnack(false)} severity="success" icon={<CheckIcon />} sx={{ borderRadius: 2 }}>
          Added to cart!
        </Alert>
      </Snackbar>
    </Container>
  );
}

// Needed for the loading state
function Grid2({ children, container, spacing }: any) {
  return <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing * 8 }}>{children}</Box>;
}
