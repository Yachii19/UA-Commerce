import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box
} from '@mui/material';
import { Link } from 'react-router-dom';

export default function Product(props) {
  const { data } = props;
  const { _id, name, description, price, imageUrl } = data;

  return (
    <Card
      sx={{
        maxWidth: 350,
        m: 'auto',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderRadius: 4,
        boxShadow: 6,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-6px) scale(1.02)',
          boxShadow: 12,
        },
        bgcolor: '#fff',
      }}
    >
      {imageUrl && (
        <CardMedia
          component="img"
          height="220"
          image={imageUrl}
          alt={name}
          sx={{
            objectFit: 'contain',
            backgroundColor: '#f5f9fd',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            p: 2,
          }}
        />
      )}
      <CardContent sx={{ flexGrow: 1, pb: 0 }}>
        <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 700 }}>
          <Link
            to={`/products/${_id}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            {name}
          </Link>
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            minHeight: 48,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {description}
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
            ₱{price.toLocaleString()}
          </Typography>
        </Box>
      </CardContent>
      <CardActions sx={{ p: 2, pt: 1, justifyContent: 'center' }}>
        <Button
          size="large"
          color="primary"
          component={Link}
          to={`/products/${_id}`}
          variant="contained"
          sx={{
            borderRadius: 3,
            px: 3,
            fontWeight: 600,
            textTransform: 'none',
            boxShadow: 2,
            width: '100%',
            background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
            transition: 'background 0.3s',
            '&:hover': {
              background: 'linear-gradient(90deg, #1565c0 0%, #42a5f5 100%)',
            },
          }}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
}