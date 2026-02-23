import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Avatar, Button, Card, CardContent,
  Divider, Stack, Chip,
} from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../hooks/useAuth';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;

  const handleLogout = () => { logout(); navigate('/'); };

  const details = [
    { label: 'Full Name', value: user.name },
    { label: 'Email Address', value: user.email },
    { label: 'Account Type', value: user.role },
    { label: 'Member Since', value: new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) },
  ];

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: 'calc(100vh - 72px)' }}>
      {/* Header banner */}
      <Box sx={{ bgcolor: 'primary.main', pt: 8, pb: 12 }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar sx={{ width: 80, height: 80, bgcolor: 'secondary.main', fontSize: '2rem', fontWeight: 600 }}>
              {user.name[0].toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h3" sx={{ color: 'white', fontSize: { xs: '1.8rem', md: '2.5rem' } }}>
                {user.name}
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', mb: 1 }}>
                {user.email}
              </Typography>
              <Chip
                label={user.role === 'admin' ? '⚡ Admin' : '✦ Customer'}
                size="small"
                sx={{
                  bgcolor: user.role === 'admin' ? 'secondary.main' : 'rgba(255,255,255,0.15)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.65rem',
                  letterSpacing: '0.1em',
                }}
              />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Content cards pulled up over the banner */}
      <Container maxWidth="xl" sx={{ mt: -6 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 320px' }, gap: 3, alignItems: 'start' }}>
          {/* Details card */}
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" sx={{ mb: 3 }}>Account Details</Typography>
              {details.map(({ label, value }, idx) => (
                <Box key={label}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
                    <Typography variant="overline" sx={{ fontSize: '0.6rem', letterSpacing: '0.12em', color: 'text.secondary', fontWeight: 600 }}>
                      {label}
                    </Typography>
                    <Typography fontWeight={500} sx={{ textTransform: 'capitalize' }}>{value}</Typography>
                  </Box>
                  {idx < details.length - 1 && <Divider />}
                </Box>
              ))}
            </CardContent>
          </Card>

          {/* Actions card */}
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" sx={{ mb: 3 }}>Quick Links</Typography>
              <Stack spacing={1.5}>
                <Button component={Link} to="/orders" variant="outlined" startIcon={<ReceiptLongIcon />} fullWidth sx={{ justifyContent: 'flex-start', py: 1.25 }}>
                  My Orders
                </Button>
                <Button component={Link} to="/products" variant="outlined" startIcon={<StorefrontIcon />} fullWidth sx={{ justifyContent: 'flex-start', py: 1.25 }}>
                  Continue Shopping
                </Button>
                {user.role === 'admin' && (
                  <Button component={Link} to="/admin" variant="contained" color="secondary" startIcon={<AdminPanelSettingsIcon />} fullWidth sx={{ justifyContent: 'flex-start', py: 1.25 }}>
                    Admin Panel
                  </Button>
                )}
                <Divider />
                <Button onClick={handleLogout} color="error" startIcon={<LogoutIcon />} fullWidth sx={{ justifyContent: 'flex-start', py: 1.25 }}>
                  Sign Out
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
}
