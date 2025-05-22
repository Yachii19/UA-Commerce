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
    <div style={{minHeight: '30vh', padding: '20px 0'}}>
      <Container maxWidth="md">
        <Typography 
          variant="h4" 
          align="center" 
          gutterBottom 
          sx={{ 
            fontWeight: 900,
            color: 'black',
            letterSpacing: 1,
            textTransform: 'uppercase',
            mb: 4
          }}
        >
          Product Search
        </Typography>
        
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            mb: 4,
            backgroundColor: 'white',
            borderRadius: 0,
            border: '1px solid #e5e5e5'
          }}
        >
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Search by Product Name"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 0,
                  '& fieldset': {
                    borderColor: 'black',
                  },
                },
              }}
            />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center" justifyContent="center">
              <Typography variant="subtitle1" sx={{ minWidth: 80, color: '#666' }}>
                Price Range
              </Typography>
              <Box display="flex" alignItems="center">
                <IconButton 
                  onClick={() => setMinPrice(Math.max(minPrice - 100, 0))}
                  sx={{ color: 'black' }}
                >
                  <RemoveIcon />
                </IconButton>
                <TextField
                  label="Min"
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                  sx={{ 
                    mx: 1, 
                    width: 100,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 0,
                      '& fieldset': {
                        borderColor: 'black',
                      },
                    },
                  }}
                  size="small"
                />
                <IconButton 
                  onClick={() => setMinPrice(minPrice + 100)}
                  sx={{ color: 'black' }}
                >
                  <AddIcon />
                </IconButton>
              </Box>
              <Typography variant="subtitle1" sx={{ mx: 1, color: '#666' }}>
                to
              </Typography>
              <Box display="flex" alignItems="center">
                <IconButton 
                  onClick={() => setMaxPrice(Math.max(maxPrice - 100, minPrice + 100))}
                  sx={{ color: 'black' }}
                >
                  <RemoveIcon />
                </IconButton>
                <TextField
                  label="Max"
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  sx={{ 
                    mx: 1, 
                    width: 100,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 0,
                      '& fieldset': {
                        borderColor: 'black',
                      },
                    },
                  }}
                  size="small"
                />
                <IconButton 
                  onClick={() => setMaxPrice(maxPrice + 100)}
                  sx={{ color: 'black' }}
                >
                  <AddIcon />
                </IconButton>
              </Box>
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
              <Button 
                variant="outlined" 
                onClick={handleSearchByName}
                sx={{
                  color: 'black',
                  borderColor: 'black',
                  borderRadius: 0,
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: 'black',
                    color: 'white',
                    borderColor: 'black'
                  }
                }}
              >
                Search by Name
              </Button>
              <Button 
                variant="outlined" 
                onClick={handleSearchByPrice}
                sx={{
                  color: 'black',
                  borderColor: 'black',
                  borderRadius: 0,
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: 'black',
                    color: 'white',
                    borderColor: 'black'
                  }
                }}
              >
                Search by Price
              </Button>
              <Button 
                variant="outlined" 
                startIcon={<ClearIcon />}
                onClick={handleClear}
                sx={{
                  color: 'black',
                  borderColor: 'black',
                  borderRadius: 0,
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: 'black',
                    color: 'white',
                    borderColor: 'black'
                  }
                }}
              >
                Clear
              </Button>
            </Stack>
          </Stack>
        </Paper>
        
        {error && (
          <Typography 
            color="error" 
            sx={{ 
              mb: 2, 
              textAlign: 'center',
              fontWeight: 600
            }}
          >
            {error}
          </Typography>
        )}
        
        {searchResults !== null && (
          <>
            <Typography 
              variant="h6" 
              gutterBottom 
              align="center"
              sx={{
                fontWeight: 700,
                color: 'black',
                textTransform: 'uppercase',
                letterSpacing: 1,
                mb: 3
              }}
            >
              Search Results
            </Typography>
            {searchResults.length === 0 ? (
              <Card 
                sx={{ 
                  maxWidth: 400, 
                  mx: "auto",
                  borderRadius: 0,
                  border: '1px solid #e5e5e5'
                }}
              >
                <CardContent>
                  <Typography align="center" color="#666">
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
    </div>
  );
};

export default ProductSearch;