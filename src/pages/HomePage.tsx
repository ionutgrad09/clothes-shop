import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box, Container, Typography, Button, Grid, Card, CardContent, Stack,
} from '@mui/material';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import EcoOutlinedIcon from '@mui/icons-material/EcoOutlined';

const categories = [
  { name: 'Tops', emoji: '👕', desc: 'Blouses, shirts & tees', slug: 'tops' },
  { name: 'Bottoms', emoji: '👖', desc: 'Trousers, skirts & more', slug: 'bottoms' },
  { name: 'Dresses', emoji: '👗', desc: 'From casual to couture', slug: 'dresses' },
  { name: 'Outerwear', emoji: '🧥', desc: 'Coats, jackets & blazers', slug: 'outerwear' },
  { name: 'Accessories', emoji: '👜', desc: 'Bags, scarves & more', slug: 'accessories' },
];

const values = [
  { icon: <EcoOutlinedIcon />, title: 'Sustainable', desc: 'Ethically sourced materials' },
  { icon: <AutorenewIcon />, title: 'Free Returns', desc: '30-day hassle-free returns' },
  { icon: <StarBorderIcon />, title: 'Quality First', desc: 'Garments made to last' },
  { icon: <LocalShippingOutlinedIcon />, title: 'Free Shipping', desc: 'On orders over $100' },
];

export default function HomePage() {
  return (
    <Box>
      {/* Hero */}
      <Box
        sx={{
          minHeight: 'calc(100vh - 72px)',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          overflow: 'hidden',
        }}
      >
        {/* Left content */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            px: { xs: 4, md: 10 },
            py: { xs: 8, md: 0 },
            bgcolor: 'background.default',
          }}
        >
          <Typography
            variant="overline"
            sx={{ color: 'secondary.main', letterSpacing: '0.25em', mb: 3, fontSize: '0.7rem', fontWeight: 600 }}
          >
            New Collection · 2025
          </Typography>
          <Typography
            variant="h1"
            sx={{ fontSize: { xs: '3rem', md: '5rem', lg: '6rem' }, lineHeight: 1, mb: 3 }}
          >
            Dress with{' '}
            <Box component="em" sx={{ color: 'secondary.main', fontStyle: 'italic' }}>
              intention.
            </Box>
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 380, lineHeight: 1.8, mb: 5, fontSize: '1rem' }}
          >
            Thoughtfully designed pieces for the modern wardrobe. Quality that lasts, style that endures.
          </Typography>
          <Stack direction="row" gap={2}>
            <Button
              component={Link}
              to="/products"
              variant="contained"
              size="large"
              sx={{ px: 5, py: 1.5 }}
            >
              Explore Collection
            </Button>
            <Button
              component={Link}
              to="/register"
              variant="outlined"
              size="large"
              sx={{ px: 5, py: 1.5 }}
            >
              Join Us
            </Button>
          </Stack>
        </Box>

        {/* Right visual */}
        <Box
          sx={{
            bgcolor: 'primary.main',
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative lines */}
          {Array.from({ length: 10 }).map((_, i) => (
            <Box
              key={i}
              sx={{
                position: 'absolute',
                left: 0, right: 0,
                top: `${10 + i * 9}%`,
                height: '1px',
                bgcolor: 'rgba(255,255,255,0.06)',
              }}
            />
          ))}
          <Box sx={{ position: 'relative', textAlign: 'center' }}>
            <Box
              sx={{
                width: 280, height: 280,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(200,150,60,0.25) 0%, transparent 70%)',
                mx: 'auto', mb: 4,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Typography sx={{ fontSize: '7rem' }}>👗</Typography>
            </Box>
            <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.4)', letterSpacing: '0.3em' }}>
              Est. 2025
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Categories */}
      <Container maxWidth="xl" sx={{ py: 10 }}>
        <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', mb: 5 }}>
          <Typography variant="h3" sx={{ fontSize: { xs: '2rem', md: '2.8rem' } }}>
            Shop by Category
          </Typography>
          <Button component={Link} to="/products" color="inherit" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
            View All →
          </Button>
        </Box>

        <Grid container spacing={2.5}>
          {categories.map((cat) => (
            <Grid item xs={6} sm={4} md key={cat.slug}>
              <Card
                component={Link}
                to={`/products?category=${cat.slug}`}
                sx={{
                  textDecoration: 'none',
                  p: 3,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    borderColor: 'primary.main',
                    boxShadow: '0 12px 40px rgba(26,26,46,0.1)',
                  },
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Typography sx={{ fontSize: '2.5rem', mb: 2 }}>{cat.emoji}</Typography>
                  <Typography variant="h6" sx={{ fontSize: '1.1rem', mb: 0.5 }}>{cat.name}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.78rem' }}>
                    {cat.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Values strip */}
      <Box sx={{ bgcolor: 'primary.main', py: 8 }}>
        <Container maxWidth="xl">
          <Grid container spacing={4}>
            {values.map((v) => (
              <Grid item xs={6} md={3} key={v.title}>
                <Box sx={{ textAlign: 'center', color: 'white' }}>
                  <Box sx={{ color: 'secondary.light', mb: 1.5, '& svg': { fontSize: '2rem' } }}>
                    {v.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontFamily: '"Playfair Display", serif', mb: 0.5, color: 'white', fontSize: '1.1rem' }}>
                    {v.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
                    {v.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
