import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Typography, 
  Button, 
  Box,
  IconButton,
  TextField
} from '@mui/material';
import { Link, Redirect, useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import ClearAllIcon from '@mui/icons-material/ClearAll';

export default function MyCart() {
  const history = useHistory();
  const [total, setTotal] = useState(0);
  const [cart, setCart] = useState([]);
  const [willRedirect, setWillRedirect] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = () => {
    fetch(`${process.env.REACT_APP_API_URL}/cart/`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to fetch cart: ${res.status}`);
        }
        return res.text();
      })
      .then((data) => {
        try {
          const jsonData = data ? JSON.parse(data) : { cartItems: [] };
          const cartItems = jsonData.cartItems || [];
          setCart(cartItems);
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      })
      .catch((error) => {
        console.error('Error fetching cart:', error);
      });
  };

  useEffect(() => {
    let tempTotal = 0;
    cart.forEach((item) => {
      tempTotal += item.price * item.quantity;
    });
    setTotal(tempTotal);
  }, [cart]);

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    fetch(`${process.env.REACT_APP_API_URL}/cart/updateQuantity`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        productId,
        newQuantity,
      })
    })
    .then((res) => res.json())
    .then(() => fetchCart())
    .catch((error) => console.error('Error updating quantity:', error));
  };

  const removeFromCart = (productId) => {
    Swal.fire({
      title: 'Remove Item',
      text: 'Are you sure you want to remove this item from your cart?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#000',
      cancelButtonColor: '#666',
      confirmButtonText: 'Remove',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${process.env.REACT_APP_API_URL}/cart/${productId}/removeFromCart`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        .then(() => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Item removed from cart',
            showConfirmButton: false,
            timer: 1500,
          });
          fetchCart();
        })
        .catch((error) => console.error('Error removing item:', error));
      }
    });
  };

  const checkout = () => {
    fetch(`${process.env.REACT_APP_API_URL}/orders/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(() => {
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Order placed successfully',
        showConfirmButton: false,
        timer: 1500,
      });
      history.push('/orders');
    })
    .catch((error) => console.error('Error during checkout:', error));
  };

  const clearCart = () => {
    Swal.fire({
      title: 'Clear Cart',
      text: 'Are you sure you want to clear your entire cart?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#000',
      cancelButtonColor: '#666',
      confirmButtonText: 'Clear',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${process.env.REACT_APP_API_URL}/cart/clearCart`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then(() => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Cart cleared',
            showConfirmButton: false,
            timer: 1500,
          });
          fetchCart();
        })
        .catch((error) => console.error('Error clearing cart:', error));
      }
    });
  };

  return (
    willRedirect ? (
      <Redirect to="/orders" />
    ) : cart.length <= 0 ? (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center', minHeight: '60vh' }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#333' }}>
          YOUR CART IS EMPTY
        </Typography>
        <Button 
          variant="contained" 
          component={Link} 
          to="/products"
          sx={{ 
            mt: 3,
            backgroundColor: 'black',
            color: 'white',
            borderRadius: 0,
            fontWeight: 600,
            px: 4,
            py: 1.5,
            '&:hover': {
              backgroundColor: '#333'
            }
          }}
        >
          START SHOPPING
        </Button>
      </Container>
    ) : (
      <Container maxWidth="lg" sx={{ py: 4, minHeight: '80vh' }}>
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            mb: 4,
            fontWeight: 700,
            color: 'black',
            letterSpacing: 1,
            textTransform: 'uppercase'
          }}
        >
          YOUR SHOPPING CART
        </Typography>
        
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
          <Table>
            <TableHead sx={{ backgroundColor: 'black' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>PRODUCT</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>PRICE</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>QUANTITY</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>SUBTOTAL</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cart.map((item) => (
                <TableRow 
                  key={item.productId}
                  sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}
                >
                  <TableCell>
                    <Link 
                      to={`/products/${item.productId}`} 
                      style={{ 
                        textDecoration: 'none', 
                        color: 'black',
                        fontWeight: 600
                      }}
                    >
                      {item.productName}
                    </Link>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>₱{item.price.toLocaleString()}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <IconButton 
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        sx={{ 
                          color: 'black',
                          '&:hover': {
                            backgroundColor: '#e0e0e0'
                          }
                        }}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <TextField
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.productId, e.target.value)}
                        sx={{ 
                          width: 80, 
                          mx: 1,
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 0
                          }
                        }}
                        inputProps={{ 
                          min: 1,
                          style: { textAlign: 'center' }
                        }}
                      />
                      <IconButton 
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        sx={{ 
                          color: 'black',
                          '&:hover': {
                            backgroundColor: '#e0e0e0'
                          }
                        }}
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>₱{(item.price * item.quantity).toLocaleString()}</TableCell>
                  <TableCell>
                    <IconButton 
                      onClick={() => removeFromCart(item.productId)}
                      sx={{ 
                        color: '#666',
                        '&:hover': {
                          color: 'black',
                          backgroundColor: '#e0e0e0'
                        }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3} align="right">
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    TOTAL:
                  </Typography>
                </TableCell>
                <TableCell colSpan={2}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'black' }}>
                    ₱{total.toLocaleString()}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button
            variant="outlined"
            startIcon={<ClearAllIcon />}
            onClick={clearCart}
            sx={{
              borderColor: 'black',
              color: 'black',
              borderRadius: 0,
              fontWeight: 600,
              px: 3,
              py: 1,
              '&:hover': {
                backgroundColor: '#f0f0f0',
                borderColor: 'black'
              }
            }}
          >
            CLEAR CART
          </Button>
          <Button
            variant="contained"
            startIcon={<ShoppingCartCheckoutIcon />}
            onClick={checkout}
            sx={{ 
              backgroundColor: 'black',
              color: 'white',
              borderRadius: 0,
              fontWeight: 600,
              px: 4,
              py: 1.5,
              '&:hover': {
                backgroundColor: '#333'
              }
            }}
          >
            CHECKOUT
          </Button>
        </Box>
      </Container>
    )
  );
}