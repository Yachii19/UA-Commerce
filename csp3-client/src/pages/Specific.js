import { useState, useEffect, useContext } from 'react';
import { 
  Container, 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  Button, 
  Grid,
  Box,
  IconButton,
  TextField
} from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import UserContext from '../UserContext';
import Swal from 'sweetalert2';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function Specific() {
  const { user } = useContext(UserContext);
  const { productId } = useParams();

  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState(0);
  const [imageUrl, setImageUrl] = useState("");

  // Black and white palette
  const blackMain = '#000000';
  const whiteMain = '#ffffff';
  const grayLight = '#f5f5f5';
  const grayDark = '#333333';
  const redMain = '#E71C4F'

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/products/${productId}`)
      .then(res => res.json())
      .then(data => {
        setId(data._id);
        setName(data.name);
        setDescription(data.description);
        setPrice(data.price);
        setImageUrl(data.imageUrl || '');
      });
  }, [productId]);

  const reduceQty = () => {
    if (qty <= 1) {
      Swal.fire({
        title: 'Error',
        text: "Quantity can't be lower than 1",
        icon: 'error',
        background: whiteMain,
        color: blackMain,
        confirmButtonColor: blackMain
      });
    } else {
      setQty(qty - 1);
    }
  };

  const increaseQty = () => {
    setQty(qty + 1);
  };

  const addToCart = () => {
    const url = `${process.env.REACT_APP_API_URL}/cart/addToCart`;

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        productId: id,
        quantity: qty,
        subtotal: price * qty,
        productName: name,
        price,
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Error adding item to cart');
        }
      })
      .then((result) => {
        Swal.fire({
          icon: 'success',
          title: 'Item added to cart successfully!',
          text: `Total items in cart: ${result.cart.cartItems.length}`,
          background: whiteMain,
          color: blackMain,
          confirmButtonColor: blackMain
        }).then(() => {
          window.location.href = '/products';
        });
      })
      .catch((error) => {
        console.error('Caught an error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error adding item to cart',
          text: 'Please try again.',
          background: whiteMain,
          color: blackMain,
          confirmButtonColor: blackMain
        });
      });
  };

  const qtyInput = (value) => {
    if (value === '') {
      value = 1;
    } else if (value === "0") {
      Swal.fire({
        title: 'Error',
        text: "Quantity can't be lower than 1",
        icon: 'error',
        background: whiteMain,
        color: blackMain,
        confirmButtonColor: blackMain
      });
      value = 1;
    }
    setQty(value);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4, my: 4, border: `1px solid ${grayLight}`}}>
      <Button 
        startIcon={<ArrowBackIcon />} 
        component={Link} 
        to="/products" 
        sx={{ 
          mb: 2,
          color: blackMain,
          textTransform: 'uppercase',
          letterSpacing: 1,
          fontWeight: 600,
          '&:hover': {
            backgroundColor: grayLight
          }
        }}
      >
        Back to Products
      </Button>
      
      <Card sx={{ 
        borderRadius: 0,
        
        boxShadow: 'none'
      }}>
        <Grid container>
          {imageUrl && (
            <Grid item xs={12} md={6}>
              <CardMedia
                component="img"
                height="400"
                image={imageUrl}
                alt={name}
                sx={{ 
                  objectFit: 'contain', 
                  p: 2, 
                }}
              />
            </Grid>
          )}
          <Grid item xs={12} md={6}>
            <CardContent sx={{ backgroundColor: whiteMain }}>
              <Typography 
                variant="h4" 
                component="h1" 
                gutterBottom
                sx={{
                  fontWeight: 700,
                  letterSpacing: 1,
                  textTransform: 'uppercase'
                }}
              >
                {name}
              </Typography>
              <Typography 
                variant="body1" 
                paragraph 
                sx={{ 
                  mb: 3,
                  color: grayDark
                }}
              >
                {description}
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 3,
                  fontWeight: 700,
                  color: redMain
                }}
              >
                ₱{price.toLocaleString()}
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 3 
              }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    mr: 2,
                    fontWeight: 600,
                    letterSpacing: 1
                  }}
                >
                  QUANTITY:
                </Typography>
                <IconButton 
                  onClick={reduceQty}
                  sx={{
                    border: `1px solid ${blackMain}`,
                    borderRadius: 0
                  }}
                >
                  <RemoveIcon />
                </IconButton>
                <TextField
                  type="number"
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
                  sx={{ 
                    width: 80, 
                    mx: 1,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 0,
                      '& fieldset': {
                        borderColor: blackMain
                      }
                    }
                  }}
                  inputProps={{ 
                    min: 1,
                    style: { 
                      textAlign: 'center',
                      fontWeight: 600
                    } 
                  }}
                />
                <IconButton 
                  onClick={increaseQty}
                  sx={{
                    border: `1px solid ${blackMain}`,
                    borderRadius: 0
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Box>
              
              {user.id !== null ? (
                user.isAdmin ? (
                  <Button 
                    variant="contained" 
                    fullWidth 
                    size="large" 
                    disabled
                    sx={{ 
                      py: 1.5,
                      borderRadius: 0,
                      backgroundColor: grayDark,
                      color: whiteMain,
                      fontWeight: 700,
                      letterSpacing: 1,
                      textTransform: 'uppercase',
                      '&:hover': {
                        backgroundColor: grayDark
                      }
                    }}
                  >
                    Admin cannot add to cart
                  </Button>
                ) : (
                  <Button 
                    variant="contained" 
                    fullWidth 
                    size="large" 
                    onClick={addToCart}
                    sx={{ 
                      py: 1.5,
                      borderRadius: 0,
                      backgroundColor: blackMain,
                      color: whiteMain,
                      fontWeight: 700,
                      letterSpacing: 1,
                      textTransform: 'uppercase',
                      '&:hover': {
                        backgroundColor: grayDark
                      }
                    }}
                  >
                    Add to Cart
                  </Button>
                )
              ) : (
                <Button 
                  variant="contained" 
                  fullWidth 
                  size="large" 
                  component={Link}
                  to={{ pathname: '/login', state: { from: 'cart' }}}
                  sx={{ 
                    py: 1.5,
                    borderRadius: 0,
                    backgroundColor: blackMain,
                    color: whiteMain,
                    fontWeight: 700,
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                    '&:hover': {
                      backgroundColor: grayDark
                    }
                  }}
                >
                  Login to Add to Cart
                </Button>
              )}
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
}