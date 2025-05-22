import React from 'react';
import Banner from '../components/Banner';
import Highlights from '../components/Highlights';
import { Container, Paper, Typography, Box, Stack } from '@mui/material';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';

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
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            
            <Typography 
              variant="h4" 
              fontWeight={600}
              color="text.primary"
            >
              Featured Products
            </Typography>
          </Box>
          <Box sx={{ mt: 0 }}>
            <Highlights />
          </Box>
        </div>
      </Container>
    </React.Fragment>
  );
}