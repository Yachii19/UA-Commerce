import React, { useEffect, useState } from 'react';
import { Grid, Container, Typography, Box } from '@mui/material';
import Product from '../components/Product';
import ProductSearch from './ProductSearch';

export default function CustomerView() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let isMounted = true;

    fetch(`${process.env.REACT_APP_API_URL}/products/active`)
      .then((res) => res.json())
      .then((productsData) => {
        if (isMounted) {
          const productsArr = productsData.map((productData) =>
            productData.isActive === true ? (
              <Grid item xs={12} sm={6} md={4} lg={3} key={productData._id}>
                <Product data={productData} />
              </Grid>
            ) : null
          );
          setProducts(productsArr);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Box sx={{minHeight: '100vh' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <ProductSearch />
        <Typography 
          variant="h4" 
          component="h2" 
          gutterBottom 
          align="center" 
          sx={{ 
            mb: 4,
            fontWeight: 700,
            color: 'black',
            letterSpacing: 1,
            textTransform: 'uppercase',
            position: 'relative',
            '&::after': {
              content: '""',
              display: 'block',
              width: '80px',
              height: '2px',
              backgroundColor: 'black',
              margin: '16px auto 0'
            }
          }}
        >
          UA Shop Products
        </Typography>
        <Grid container spacing={3}>
          {products}
        </Grid>
      </Container>
    </Box>
  );
}