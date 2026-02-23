import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Chip, Card, CardActionArea, CardMedia, CardContent } from '@mui/material';
import { Product } from '../../types';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.25s ease',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '0 16px 48px rgba(26,26,46,0.12)',
          borderColor: 'primary.main',
        },
      }}
    >
      <CardActionArea component={Link} to={`/products/${product.id}`} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
        {/* Image */}
        <Box sx={{ position: 'relative', overflow: 'hidden', bgcolor: '#f5f0e8', aspectRatio: '3/4' }}>
          {product.image_url ? (
            <CardMedia
              component="img"
              image={product.image_url}
              alt={product.name}
              sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease', '&:hover': { transform: 'scale(1.06)' } }}
            />
          ) : (
            <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>
              👗
            </Box>
          )}
          {product.stock === 0 && (
            <Chip
              label="Out of Stock"
              size="small"
              sx={{ position: 'absolute', top: 12, left: 12, bgcolor: 'rgba(211,47,47,0.9)', color: 'white', fontWeight: 600 }}
            />
          )}
          {product.stock > 0 && product.stock <= 5 && (
            <Chip
              label={`Only ${product.stock} left`}
              size="small"
              color="warning"
              sx={{ position: 'absolute', top: 12, left: 12, fontWeight: 600 }}
            />
          )}
        </Box>

        {/* Info */}
        <CardContent sx={{ p: 2, pb: '16px !important', flex: 1 }}>
          <Typography
            variant="overline"
            sx={{ fontSize: '0.6rem', letterSpacing: '0.15em', color: 'secondary.main', fontWeight: 600 }}
          >
            {product.category}
          </Typography>
          <Typography
            variant="h6"
            sx={{ fontFamily: '"Playfair Display", serif', fontSize: '1rem', fontWeight: 400, mb: 1, lineHeight: 1.3 }}
          >
            {product.name}
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main', fontSize: '1rem' }}>
            ${product.price.toFixed(2)}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
