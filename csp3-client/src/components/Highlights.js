import { useState, useEffect } from 'react';
import { Grid, Typography, Box } from '@mui/material';
import Product from './Product';

export default function Highlights() {
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/products/active`)
      .then(res => res.json())
      .then(apiData => {
        if (!apiData || apiData.length === 0) {
          setPreviews([]);
          return;
        }
        const numbers = new Set();
        const maxHighlights = Math.min(5, apiData.length);

        while (numbers.size < maxHighlights) {
          numbers.add(Math.floor(Math.random() * apiData.length));
        }

        const products = Array.from(numbers).map(idx => (
          <Product
            data={apiData[idx]}
            key={apiData[idx]._id}
          />
        ));

        setPreviews(products);
      });
  }, []);

  return (
    <Box sx={{ py: { xs: 4, md: 7 }, bgcolor: 'background.default', borderRadius: 4, my: 5}}>
      <Grid container spacing={4} justifyContent="flex-start" alignItems="stretch">
        {previews.length > 0 ? (
          previews.map((product, idx) => (
            <Grid item xs={12} sm={6} md={3} lg={3} xl={3} key={product.key || idx} display="flex">
              {product}
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography align="center" color="text.secondary">
              No featured products available.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}