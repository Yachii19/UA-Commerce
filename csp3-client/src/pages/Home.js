import React from 'react';
import Banner from '../components/Banner';
import Highlights from '../components/Highlights';
import { Container, Paper, Typography, Box, Stack } from '@mui/material';

export default function Home() {
  const pageData = {
    title: "The UA Shop",
    content: "Products for everyone, everywhere",
    destination: "/products",
    label: "Browse Products"
  };

  return (
    <React.Fragment>
      {/* Assuming Banner returns a hero/jumbotron-like component */}
      <Banner data={pageData} />

      <Container maxWidth="lg" sx={{ mt: 8 }}>
        <div >
          <Typography 
            variant="h4" 
            align="center" 
            gutterBottom 
            fontWeight={600}
            color="text.primary"
          >
            Featured Products
          </Typography>
          <Box sx={{ mt: 0 }}>
            <Highlights />
          </Box>
        </div>
      </Container>
    </React.Fragment>
  );
}