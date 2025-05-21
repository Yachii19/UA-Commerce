import React, { useState } from 'react';
import { 
  Container, 
  TextField, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  Typography,
  Box,
  IconButton,
  Paper,
  Stack
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ClearIcon from '@mui/icons-material/Clear';
import Product from './Product'; 

const ProductSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [searchResults, setSearchResults] = useState(null);
  const [error, setError] = useState(null);

  const handleSearchByName = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/products/searchByName`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: searchQuery })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Unknown error');
      }

      const data = await response.json();
      setSearchResults(data);
      setError(null);
    } catch (error) {
      console.error('Error searching for products by name:', error);
      setError('An error occurred while searching for products. Please try again.');
    }
  };

  const handleSearchByPrice = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/products/searchByPrice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ minPrice, maxPrice })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Unknown error');
      }

      const data = await response.json();
      setSearchResults(data.products);
      setError(null);
    } catch (error) {
      console.error('Error searching for products by price:', error);
      setError('An error occurred while searching for products. Please try again.');
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    setMinPrice(0);
    setMaxPrice(100000);
    setSearchResults(null);
    setError(null);
  };

    return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 600 }}>
        Product Search
      </Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Stack spacing={2}>
          <TextField
            fullWidth
            label="Search by Product Name"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center" justifyContent="center">
            <Typography variant="subtitle1" sx={{ minWidth: 80 }}>
              Price Range
            </Typography>
            <Box display="flex" alignItems="center">
              <IconButton onClick={() => setMinPrice(Math.max(minPrice - 100, 0))}>
                <RemoveIcon />
              </IconButton>
              <TextField
                label="Min"
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                sx={{ mx: 1, width: 100 }}
                size="small"
              />
              <IconButton onClick={() => setMinPrice(minPrice + 100)}>
                <AddIcon />
              </IconButton>
            </Box>
            <Typography variant="subtitle1" sx={{ mx: 1 }}>
              to
            </Typography>
            <Box display="flex" alignItems="center">
              <IconButton onClick={() => setMaxPrice(Math.max(maxPrice - 100, minPrice + 100))}>
                <RemoveIcon />
              </IconButton>
              <TextField
                label="Max"
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                sx={{ mx: 1, width: 100 }}
                size="small"
              />
              <IconButton onClick={() => setMaxPrice(maxPrice + 100)}>
                <AddIcon />
              </IconButton>
            </Box>
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
            <Button 
              variant="contained" 
              onClick={handleSearchByName}
            >
              Search by Name
            </Button>
            <Button 
              variant="contained" 
              onClick={handleSearchByPrice}
            >
              Search by Price
            </Button>
            <Button 
              variant="outlined" 
              startIcon={<ClearIcon />}
              onClick={handleClear}
            >
              Clear
            </Button>
          </Stack>
        </Stack>
      </Paper>
      
      {error && (
        <Typography color="error" sx={{ mb: 2 }} align="center">
          {error}
        </Typography>
      )}
      
      {searchResults !== null && (
        <>
          <Typography variant="h6" gutterBottom align="center">
            Search Results
          </Typography>
          {searchResults.length === 0 ? (
            <Card sx={{ maxWidth: 400, mx: "auto" }}>
              <CardContent>
                <Typography align="center">
                  No matching products found
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <Grid container spacing={3}>
              {searchResults.map(product => (
                <Grid item xs={12} sm={6} md={4} key={product._id}>
                  <Product data={product} />
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
    </Container>
  );
};

export default ProductSearch;