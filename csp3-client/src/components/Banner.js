import React from 'react';
import { Container, Typography, Button, Box, Stack } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Banner({ data }) {
  const { title, content, destination, label } = data;

  return (
    <Container 
      maxWidth={false} 
      sx={{
        backgroundColor: 'black',
        color: 'white',
        py: 10,
        mb: 4,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7))',
        }
      }}
    >
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
            fontSize: { xs: '2rem', md: '3rem' },
            letterSpacing: 1
          }}
        >
          {title}
        </Typography>
        
        <Typography 
          variant="subtitle1"
          sx={{
            fontWeight: 400,
            fontSize: { xs: '1rem', md: '1.25rem' },
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
            backgroundColor: '#E71C4F',
            color: 'white',
            borderRadius: 0,
            px: 4,
            py: 1.5,
            fontWeight: 600,
            fontSize: '1rem',
            '&:hover': {
              backgroundColor: '#e0e0e0',
            }
          }}
        >
          {label}
        </Button>
      </Stack>
    </Container>
  );
}