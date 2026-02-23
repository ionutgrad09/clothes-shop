import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Card, CardContent, Chip,
  Accordion, AccordionSummary, AccordionDetails, Stack, Divider, Alert, Skeleton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import { api } from '../lib/api';
import { Order } from '../types';

const STATUS_CONFIG: Record<string, { color: 'default' | 'warning' | 'info' | 'secondary' | 'success' | 'error'; label: string }> = {
  pending: { color: 'warning', label: 'Pending' },
  processing: { color: 'info', label: 'Processing' },
  shipped: { color: 'secondary', label: 'Shipped' },
  delivered: { color: 'success', label: 'Delivered' },
  cancelled: { color: 'error', label: 'Cancelled' },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.orders.list()
      .then(({ orders }) => setOrders(orders || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box>
      <Box sx={{ bgcolor: 'primary.main', py: 8 }}>
        <Container maxWidth="xl">
          <Typography variant="h2" sx={{ color: 'white', fontSize: { xs: '2.5rem', md: '3.5rem' }, mb: 1 }}>My Orders</Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>{orders.length} orders</Typography>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 6 }}>
        {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}

        {loading ? (
          <Stack spacing={2}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={80} sx={{ borderRadius: 2 }} />
            ))}
          </Stack>
        ) : orders.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 12 }}>
            <InventoryOutlinedIcon sx={{ fontSize: '5rem', color: 'text.secondary', mb: 2 }} />
            <Typography variant="h4" sx={{ mb: 1 }}>No orders yet</Typography>
            <Typography color="text.secondary">When you place an order, it will appear here</Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {orders.map((order) => {
              const statusCfg = STATUS_CONFIG[order.status] || { color: 'default', label: order.status };
              return (
                <Accordion key={order.id} disableGutters elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '8px !important', overflow: 'hidden', '&:before': { display: 'none' } }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 3, py: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flex: 1, flexWrap: 'wrap' }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="overline" sx={{ fontSize: '0.6rem', letterSpacing: '0.12em', color: 'text.secondary', fontWeight: 600 }}>
                          Order #{order.id.slice(0, 8).toUpperCase()}
                        </Typography>
                        <Typography sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>
                          {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Chip label={statusCfg.label} color={statusCfg.color} size="small" sx={{ fontWeight: 600, fontSize: '0.65rem' }} />
                        <Typography fontWeight={700} sx={{ fontFamily: '"Playfair Display"', fontSize: '1.1rem' }}>
                          ${order.total.toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ px: 3, pb: 3 }}>
                    <Divider sx={{ mb: 2 }} />
                    <Stack spacing={1.5}>
                      {order.items.map((item, i) => (
                        <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography fontWeight={500} fontSize="0.9rem">{item.product_name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              Size: {item.size} · Color: {item.color} · Qty: {item.quantity}
                            </Typography>
                          </Box>
                          <Typography fontWeight={600} fontSize="0.9rem">
                            ${(item.price * item.quantity).toFixed(2)}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="caption" color="text.secondary">
                      📍 {order.shipping_address}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Stack>
        )}
      </Container>
    </Box>
  );
}
