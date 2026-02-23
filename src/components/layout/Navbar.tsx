import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Box, IconButton, Badge, Menu, MenuItem,
  Avatar, Divider, Button, Tooltip, ListItemIcon, Container,
} from '@mui/material';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLogout = () => {
    setAnchorEl(null);
    logout();
    navigate('/');
  };

  const navLinks = [
    { label: 'Shop', to: '/products' },
    ...(user?.role === 'admin' ? [{ label: 'Admin', to: '/admin' }] : []),
  ];

  return (
    <AppBar position="sticky" color="transparent" sx={{ color: 'text.primary' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ height: 72, gap: 4 }}>
          {/* Logo */}
          <Typography
            component={Link}
            to="/"
            variant="h5"
            sx={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontWeight: 600,
              letterSpacing: '0.2em',
              color: 'text.primary',
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            DRAPE
          </Typography>

          {/* Nav links */}
          <Box sx={{ display: 'flex', gap: 3, flex: 1 }}>
            {navLinks.map((link) => (
              <Typography
                key={link.to}
                component={Link}
                to={link.to}
                sx={{
                  fontSize: '0.7rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                  color: location.pathname.startsWith(link.to) ? 'text.primary' : 'text.secondary',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                  '&:hover': { color: 'text.primary' },
                  borderBottom: location.pathname.startsWith(link.to) ? '1px solid' : '1px solid transparent',
                  borderColor: 'secondary.main',
                  pb: '2px',
                }}
              >
                {link.label}
              </Typography>
            ))}
          </Box>

          {/* Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Cart">
              <IconButton component={Link} to="/cart" sx={{ color: 'text.primary' }}>
                <Badge badgeContent={count} color="secondary" max={99}>
                  <ShoppingBagOutlinedIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            {user ? (
              <>
                <Tooltip title={user.name}>
                  <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ p: 0, ml: 1 }}>
                    <Avatar
                      sx={{
                        width: 36, height: 36,
                        bgcolor: 'primary.main',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                      }}
                    >
                      {user.name[0].toUpperCase()}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  PaperProps={{
                    elevation: 2,
                    sx: { mt: 1, minWidth: 200, border: '1px solid', borderColor: 'divider' },
                  }}
                >
                  <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography variant="subtitle2" fontWeight={600}>{user.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{user.email}</Typography>
                  </Box>
                  <Divider />
                  <MenuItem component={Link} to="/profile" onClick={() => setAnchorEl(null)}>
                    <ListItemIcon><PersonOutlineIcon fontSize="small" /></ListItemIcon>
                    Profile
                  </MenuItem>
                  <MenuItem component={Link} to="/orders" onClick={() => setAnchorEl(null)}>
                    <ListItemIcon><ReceiptLongIcon fontSize="small" /></ListItemIcon>
                    My Orders
                  </MenuItem>
                  {user.role === 'admin' && (
                    <MenuItem component={Link} to="/admin" onClick={() => setAnchorEl(null)}>
                      <ListItemIcon><AdminPanelSettingsIcon fontSize="small" /></ListItemIcon>
                      Admin Panel
                    </MenuItem>
                  )}
                  <Divider />
                  <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                    <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
                    Sign Out
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: 1, ml: 1 }}>
                <Button component={Link} to="/login" color="inherit" sx={{ fontSize: '0.7rem' }}>
                  Sign In
                </Button>
                <Button component={Link} to="/register" variant="contained" color="primary" sx={{ fontSize: '0.7rem' }}>
                  Register
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
