import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box, Typography, TextField, Button, Alert, CircularProgress,
  InputAdornment, IconButton,
} from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { useAuth } from '../hooks/useAuth';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register(email, password, name);
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
          Join DRAPE
        </Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', maxWidth: 280, position: 'relative' }}>
          Create your account and discover fashion curated for you
        </Typography>
      </Box>

      {/* Form panel */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: 4, md: 8 }, bgcolor: 'background.default' }}>
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          <Typography variant="h3" sx={{ mb: 1, fontSize: '2.5rem' }}>Create Account</Typography>
          <Typography color="text.secondary" sx={{ mb: 4, fontSize: '0.9rem' }}>
            Already have an account?{' '}
            <Box component={Link} to="/login" sx={{ color: 'primary.main', fontWeight: 500, textDecoration: 'underline' }}>
              Sign in
            </Box>
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              label="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
              InputProps={{
                startAdornment: <InputAdornment position="start"><PersonOutlineIcon sx={{ color: 'text.secondary', fontSize: '1.1rem' }} /></InputAdornment>,
              }}
            />
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
              helperText="At least 6 characters"
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
            <Button type="submit" variant="contained" size="large" disabled={loading} fullWidth sx={{ py: 1.5, mt: 1 }}>
              {loading ? <CircularProgress size={20} color="inherit" /> : 'Create Account'}
            </Button>
          </Box>

          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 3, textAlign: 'center' }}>
            By registering you agree to our Terms of Service and Privacy Policy.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
