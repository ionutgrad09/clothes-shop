import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Button, TextField, Divider,
  Alert, Card, CardContent, IconButton, Chip, Stack, Paper,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { api } from '../lib/api';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, total, count } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [ordering, setOrdering] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const shipping = total >= 100 ? 0 : 9.99;
  const grandTotal = total + shipping;

  const handleOrder = async () => {
    if (!user) { navigate('/login'); return; }
    if (!address.trim()) { setError('Please enter a shipping address'); return; }
    setOrdering(true);
    setError('');
    try {
      const orderItems = items.map((i) => ({
        product_id: i.product.id,
        product_name: i.product.name,
        quantity: i.quantity,
        price: i.product.price,
        size: i.size,
        color: i.color,
      }));
      await api.orders.create(orderItems, address);
      clearCart();
      setSuccess(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setOrdering(false);
    }
  };

  if (success) return (
    <Container maxWidth="sm" sx={{ py: 12, textAlign: 'center' }}>
      <CheckCircleOutlineIcon sx={{ fontSize: '5rem', color: 'success.main', mb: 3 }} />
      <Typography variant="h3" sx={{ mb: 2 }}>Order Placed!</Typography>
      <Typography color="text.secondary" sx={{ mb: 5 }}>
        Thank you for your order. We'll send you a confirmation shortly.
      </Typography>
      <Stack direction="row" spacing={2} justifyContent="center">
        <Button component={Link} to="/orders" variant="contained">View Orders</Button>
        <Button component={Link} to="/products" variant="outlined">Continue Shopping</Button>
      </Stack>
    </Container>
  );

  if (count === 0) return (
    <Container maxWidth="sm" sx={{ py: 12, textAlign: 'center' }}>
      <ShoppingBagOutlinedIcon sx={{ fontSize: '5rem', color: 'text.secondary', mb: 3 }} />
      <Typography variant="h3" sx={{ mb: 2 }}>Your cart is empty</Typography>
      <Typography color="text.secondary" sx={{ mb: 5 }}>Add some items to get started</Typography>
      <Button component={Link} to="/products" variant="contained" size="large">Shop Now</Button>
    </Container>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 5 }}>
      <Typography variant="h3" sx={{ mb: 0.5 }}>Shopping Basket</Typography>
      <Typography color="text.secondary" sx={{ mb: 5, fontSize: '0.85rem' }}>
        {count} {count === 1 ? 'item' : 'items'}
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 380px' }, gap: 5, alignItems: 'start' }}>
        {/* Cart items */}
        <Stack spacing={2}>
          {items.map((item) => (
            <Card key={`${item.product.id}-${item.size}-${item.color}`}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: 2.5 }}>
                  {/* Image */}
                  <Box sx={{ borderRadius: 1, overflow: 'hidden', bgcolor: '#f5f0e8', aspectRatio: '3/4' }}>
                    {item.product.image_url ? (
                      <Box component="img" src={item.product.image_url} alt={item.product.name} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>👗</Box>
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="overline" sx={{ fontSize: '0.6rem', color: 'secondary.main', fontWeight: 600 }}>
                          {item.product.category}
                        </Typography>
                        <Typography variant="h6" sx={{ fontFamily: '"Playfair Display"', fontSize: '1rem', fontWeight: 400, lineHeight: 1.2 }}>
                          {item.product.name}
                        </Typography>
                        <Stack direction="row" spacing={0.75} sx={{ mt: 0.75 }}>
                          <Chip label={`Size: ${item.size}`} size="small" sx={{ fontSize: '0.65rem', height: 20 }} />
                          <Chip label={`Color: ${item.color}`} size="small" sx={{ fontSize: '0.65rem', height: 20 }} />
                        </Stack>
                      </Box>
                      <IconButton size="small" onClick={() => removeItem(item.product.id, item.size, item.color)} sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'inline-flex', alignItems: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                        <Button onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)} sx={{ minWidth: 32, p: 0.5, fontSize: '1rem' }}>−</Button>
                        <Typography sx={{ px: 1.5, fontWeight: 600, fontSize: '0.85rem' }}>{item.quantity}</Typography>
                        <Button onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)} sx={{ minWidth: 32, p: 0.5, fontSize: '1rem' }}>+</Button>
                      </Box>
                      <Typography variant="h6" sx={{ fontFamily: '"Playfair Display"', fontWeight: 500, fontSize: '1.1rem' }}>
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>

        {/* Order summary */}
        <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 3, position: { lg: 'sticky' }, top: 96 }}>
          <Typography variant="h5" sx={{ mb: 3 }}>Order Summary</Typography>

          <Stack spacing={1.5} sx={{ mb: 3 }}>
            {[
              { label: 'Subtotal', value: `$${total.toFixed(2)}` },
              { label: 'Shipping', value: shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}` },
            ].map(({ label, value }) => (
              <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary" fontSize="0.9rem">{label}</Typography>
                <Typography fontSize="0.9rem">{value}</Typography>
              </Box>
            ))}
            <Divider />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography fontWeight={700}>Total</Typography>
              <Typography fontWeight={700} fontSize="1.1rem">${grandTotal.toFixed(2)}</Typography>
            </Box>
          </Stack>

          {total < 100 && (
            <Alert severity="info" sx={{ mb: 3, borderRadius: 2, fontSize: '0.78rem' }}>
              Add ${(100 - total).toFixed(2)} more for free shipping!
            </Alert>
          )}

          <TextField
            label="Shipping Address"
            multiline
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your full shipping address..."
            sx={{ mb: 2 }}
          />

          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

          {!user ? (
            <Stack spacing={1}>
              <Button component={Link} to="/login" variant="contained" fullWidth size="large">Sign In to Checkout</Button>
              <Button component={Link} to="/register" variant="outlined" fullWidth>Create Account</Button>
            </Stack>
          ) : (
            <Button variant="contained" fullWidth size="large" onClick={handleOrder} disabled={ordering} sx={{ py: 1.5 }}>
              {ordering ? 'Placing Order…' : 'Place Order'}
            </Button>
          )}
        </Paper>
      </Box>
    </Container>
  );
}
