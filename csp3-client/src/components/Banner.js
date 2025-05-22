import React from 'react';
import { Container, Typography, Button, Box, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import '../App.css'

export default function Banner({ data }) {
  const { title, content, destination, label } = data;

  return (
    <div className='banner-container'>
      <Stack 
        alignItems="center" 
        spacing={2}
        position="relative" // makes it appear above the pseudo-element
        sx={{
          maxWidth: '800px',
          mx: 'auto',
          textAlign: 'center',
          px: 2
        }}
      >
        <Typography 
          variant="h2" 
          component="h1"
          sx={{
            fontWeight: 700,
            fontSize: { xs: '2rem', md: '4rem' },
            letterSpacing: 1
          }}
        >
          {title}
        </Typography>
        
        <Typography 
          variant="subtitle1"
          sx={{
            fontWeight: 400,
            fontSize: { xs: '0.8rem', md: '1rem' },
            mb: 2
          }}
        >
          {content}
        </Typography>
        
        <Button
          component={Link}
          to={destination}
          variant="contained"
          sx={{
            backgroundColor: '#000',
            color: 'white',
            borderRadius: 2,
            px: 4,
            py: 1.5,
            fontWeight: 600,
            fontSize: '1rem',
            '&:hover': {
              backgroundColor: '#222',
            }
          }}
        >
          {label}
        </Button>
      </Stack>
    </div>
  );
}