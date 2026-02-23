import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box, Typography, TextField, Button, Alert, CircularProgress,
  InputAdornment, IconButton, Divider,
} from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, minHeight: 'calc(100vh - 72px)' }}>
      {/* Visual panel */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'primary.main',
          position: 'relative',
          overflow: 'hidden',
          p: 6,
        }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <Box key={i} sx={{ position: 'absolute', left: 0, right: 0, top: `${12 + i * 11}%`, height: '1px', bgcolor: 'rgba(255,255,255,0.05)' }} />
        ))}
        <Typography variant="h2" sx={{ color: 'white', fontSize: '4rem', mb: 2, position: 'relative' }}>
          Welcome Back
        </Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', maxWidth: 280, position: 'relative' }}>
          Sign in to continue your style journey with DRAPE
        </Typography>
      </Box>

      {/* Form panel */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: 4, md: 8 }, bgcolor: 'background.default' }}>
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          <Typography variant="h3" sx={{ mb: 1, fontSize: '2.5rem' }}>Sign In</Typography>
          <Typography color="text.secondary" sx={{ mb: 4, fontSize: '0.9rem' }}>
            Don't have an account?{' '}
            <Box component={Link} to="/register" sx={{ color: 'primary.main', fontWeight: 500, textDecoration: 'underline' }}>
              Create one
            </Box>
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              InputProps={{
                startAdornment: <InputAdornment position="start"><EmailOutlinedIcon sx={{ color: 'text.secondary', fontSize: '1.1rem' }} /></InputAdornment>,
              }}
            />
            <TextField
              label="Password"
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              InputProps={{
                startAdornment: <InputAdornment position="start"><LockOutlinedIcon sx={{ color: 'text.secondary', fontSize: '1.1rem' }} /></InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPass(!showPass)} edge="end" size="small">
                      {showPass ? <VisibilityOffOutlinedIcon fontSize="small" /> : <VisibilityOutlinedIcon fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              fullWidth
              sx={{ py: 1.5, mt: 1 }}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : 'Sign In'}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }}>
            <Typography variant="caption" color="text.secondary">or</Typography>
          </Divider>
          <Button component={Link} to="/products" variant="outlined" fullWidth sx={{ py: 1.5 }}>
            Browse as Guest
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
