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
        width: '350px',
        m: 'auto',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderRadius: 0, // SHEIN uses sharp corners
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        },
        bgcolor: '#fff',
        border: '1px solid #e0e0e0',
      }}
    >
      {imageUrl && (
        <CardMedia
          component="img"
          height="220"
          image={imageUrl}
          alt={name}
          sx={{
            objectFit: 'cover',
            backgroundColor: '#f5f5f5', // Light gray background
            p: 0,
          }}
        />
      )}
      <CardContent sx={{ flexGrow: 1, pb: 0 }}>
        <Typography 
          gutterBottom 
          variant="h5" 
          component="div" 
          sx={{ 
            fontWeight: 700,
            fontSize: '1.25rem'
          }}
        >
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
            color: '#666', // Dark gray text
          }}
        >
          {description}
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#E71C4F' }}>
            ₱{price.toLocaleString()}
          </Typography>
        </Box>
      </CardContent>
      <CardActions sx={{ p: 2, pt: 1, justifyContent: 'center' }}>
        <Button
          size="large"
          component={Link}
          to={`/products/${_id}`}
          variant="contained"
          sx={{
            borderRadius: 0, // Sharp corners
            px: 3,
            fontWeight: 600,
            textTransform: 'uppercase', // SHEIN uses uppercase buttons
            boxShadow: 'none',
            width: '100%',
            backgroundColor: 'black',
            color: 'white',
            '&:hover': {
              backgroundColor: '#333',
            },
            letterSpacing: '1px',
            fontSize: '0.75rem'
          }}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
}