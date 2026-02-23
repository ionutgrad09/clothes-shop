import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Tabs, Tab, Button, TextField, Select, MenuItem,
  FormControl, InputLabel, Chip, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, Alert, Snackbar, Skeleton, Stack, Checkbox, FormGroup,
  FormControlLabel, Grid, Avatar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import InventoryIcon from '@mui/icons-material/Inventory';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { api } from '../lib/api';
import { Product, Order } from '../types';

const CATEGORIES = ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Accessories'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const COLORS = ['Black', 'White', 'Navy', 'Gray', 'Beige', 'Red', 'Green', 'Blue'];

const emptyForm = {
  name: '', description: '', price: '', category: 'Tops',
  sizes: [] as string[], colors: [] as string[], image_url: '', stock: '',
};

const STATUS_COLOR: Record<string, 'default' | 'warning' | 'info' | 'secondary' | 'success' | 'error'> = {
  pending: 'warning', processing: 'info', shipped: 'secondary', delivered: 'success', cancelled: 'error',
};

export default function AdminPage() {
  const [tab, setTab] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [snack, setSnack] = useState('');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [{ products }, { orders }] = await Promise.all([api.products.list(), api.orders.adminList()]);
      setProducts(products || []);
      setOrders(orders || []);
    } finally {
      setLoading(false);
    }
  };

  const openNew = () => { setForm(emptyForm); setEditId(null); setError(''); setDialogOpen(true); };

  const openEdit = (p: Product) => {
    setForm({ name: p.name, description: p.description || '', price: String(p.price), category: p.category, sizes: p.sizes || [], colors: p.colors || [], image_url: p.image_url || '', stock: String(p.stock) });
    setEditId(p.id);
    setError('');
    setDialogOpen(true);
  };

  const toggleArr = (field: 'sizes' | 'colors', val: string) => {
    setForm((f) => ({ ...f, [field]: f[field].includes(val) ? f[field].filter((x) => x !== val) : [...f[field], val] }));
  };

  const handleSave = async () => {
    setError('');
    if (!form.name || !form.price || !form.stock) { setError('Name, price and stock are required'); return; }
    setSaving(true);
    try {
      const data = { ...form, price: parseFloat(form.price), stock: parseInt(form.stock) };
      if (editId) { await api.products.update(editId, data); setSnack('Product updated!'); }
      else { await api.products.create(data); setSnack('Product created!'); }
      setDialogOpen(false);
      fetchData();
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this product?')) return;
    await api.products.delete(id);
    setProducts((p) => p.filter((x) => x.id !== id));
    setSnack('Product deleted');
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: 'calc(100vh - 72px)' }}>
      <Box sx={{ bgcolor: 'primary.main', py: 6 }}>
        <Container maxWidth="xl">
          <Typography variant="h2" sx={{ color: 'white', fontSize: { xs: '2rem', md: '3rem' } }}>Admin Panel</Typography>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 4, borderBottom: 1, borderColor: 'divider' }}>
          <Tab icon={<InventoryIcon fontSize="small" />} iconPosition="start" label={`Products (${products.length})`} />
          <Tab icon={<ReceiptLongIcon fontSize="small" />} iconPosition="start" label={`Orders (${orders.length})`} />
        </Tabs>

        {/* Products tab */}
        {tab === 0 && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
              <Button variant="contained" startIcon={<AddIcon />} onClick={openNew}>Add Product</Button>
            </Box>

            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'background.default' }}>
                    {['Product', 'Category', 'Price', 'Stock', 'Actions'].map((h) => (
                      <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'text.secondary' }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 5 }).map((_, j) => (
                        <TableCell key={j}><Skeleton /></TableCell>
                      ))}
                    </TableRow>
                  )) : products.map((p) => (
                    <TableRow key={p.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar
                            src={p.image_url}
                            variant="rounded"
                            sx={{ width: 44, height: 56, bgcolor: '#f5f0e8', fontSize: '1.5rem' }}
                          >
                            👗
                          </Avatar>
                          <Box>
                            <Typography fontWeight={600} fontSize="0.85rem">{p.name}</Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {p.description || '—'}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell><Chip label={p.category} size="small" sx={{ fontSize: '0.65rem', fontWeight: 600 }} /></TableCell>
                      <TableCell><Typography fontFamily='"Playfair Display"' fontWeight={500}>${p.price.toFixed(2)}</Typography></TableCell>
                      <TableCell>
                        <Chip
                          label={p.stock}
                          size="small"
                          color={p.stock === 0 ? 'error' : p.stock <= 5 ? 'warning' : 'success'}
                          sx={{ fontWeight: 700 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.5}>
                          <IconButton size="small" onClick={() => openEdit(p)} color="primary"><EditOutlinedIcon fontSize="small" /></IconButton>
                          <IconButton size="small" onClick={() => handleDelete(p.id)} color="error"><DeleteOutlineIcon fontSize="small" /></IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {/* Orders tab */}
        {tab === 1 && (
          <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'background.default' }}>
                  {['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Date'].map((h) => (
                    <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'text.secondary' }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>{Array.from({ length: 6 }).map((_, j) => <TableCell key={j}><Skeleton /></TableCell>)}</TableRow>
                )) : orders.map((o: any) => (
                  <TableRow key={o.id} hover>
                    <TableCell><Typography fontFamily="monospace" fontSize="0.8rem" fontWeight={600}>#{o.id.slice(0, 8).toUpperCase()}</Typography></TableCell>
                    <TableCell>
                      <Typography fontWeight={600} fontSize="0.85rem">{o.users?.name || 'Unknown'}</Typography>
                      <Typography variant="caption" color="text.secondary">{o.users?.email}</Typography>
                    </TableCell>
                    <TableCell><Typography fontSize="0.85rem">{o.items?.length || 0} items</Typography></TableCell>
                    <TableCell><Typography fontFamily='"Playfair Display"' fontWeight={500}>${o.total.toFixed(2)}</Typography></TableCell>
                    <TableCell><Chip label={o.status} color={STATUS_COLOR[o.status] || 'default'} size="small" sx={{ fontWeight: 600, fontSize: '0.65rem', textTransform: 'capitalize' }} /></TableCell>
                    <TableCell><Typography fontSize="0.8rem" color="text.secondary">{new Date(o.created_at).toLocaleDateString()}</Typography></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>

      {/* Product Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontFamily: '"Playfair Display"', fontWeight: 400, fontSize: '1.5rem' }}>
          {editId ? 'Edit Product' : 'New Product'}
        </DialogTitle>
        <DialogContent dividers sx={{ pt: 3 }}>
          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField label="Product Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} fullWidth />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Category *</InputLabel>
                <Select value={form.category} label="Category *" onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <TextField label="Price *" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} inputProps={{ step: 0.01, min: 0 }} />
            </Grid>
            <Grid item xs={3}>
              <TextField label="Stock *" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} inputProps={{ min: 0 }} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} multiline rows={3} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="overline" sx={{ fontSize: '0.6rem', letterSpacing: '0.12em', color: 'text.secondary', fontWeight: 600, display: 'block', mb: 1 }}>Sizes</Typography>
              <FormGroup row>
                {SIZES.map((s) => (
                  <FormControlLabel key={s} control={<Checkbox checked={form.sizes.includes(s)} onChange={() => toggleArr('sizes', s)} size="small" />} label={<Typography fontSize="0.8rem">{s}</Typography>} />
                ))}
              </FormGroup>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="overline" sx={{ fontSize: '0.6rem', letterSpacing: '0.12em', color: 'text.secondary', fontWeight: 600, display: 'block', mb: 1 }}>Colors</Typography>
              <FormGroup row>
                {COLORS.map((c) => (
                  <FormControlLabel key={c} control={<Checkbox checked={form.colors.includes(c)} onChange={() => toggleArr('colors', c)} size="small" />} label={<Typography fontSize="0.8rem">{c}</Typography>} />
                ))}
              </FormGroup>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, gap: 1 }}>
          <Button onClick={() => setDialogOpen(false)} variant="outlined">Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={saving}>
            {saving ? 'Saving…' : editId ? 'Update Product' : 'Create Product'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!snack} autoHideDuration={3000} onClose={() => setSnack('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" onClose={() => setSnack('')} sx={{ borderRadius: 2 }}>{snack}</Alert>
      </Snackbar>
    </Box>
  );
}
