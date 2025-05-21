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
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

export default function MyCart() {

	const history = useHistory();

	const [total, setTotal] = useState(0);
	const [cart, setCart] = useState([]);
	const [tableRows, setTableRows] = useState([]);
	const [willRedirect, setWillRedirect] = useState(false);

// ============================================================
	// to render the Updated Cart

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




// ============================================================





// ============================================================
	// Getting the Cart and set it to table rows
	useEffect(() => {
		setTableRows(
			cart.map((item) => (
				<tr key={item.productId}>
					<td>
						<Link to={`/products/${item.productId}`}>{item.productName}</Link>
					</td>

					<td>₱{item.price}</td>

					<td>
						<InputGroup className="d-md-none">
							<FormControl
								type="number"
								min="1"
								value={item.quantity}
								onChange={(e) => updateQuantity(item.productId, e.target.value)}
							/>
						</InputGroup>
						
						<InputGroup className="d-none d-md-flex w-50">
							<InputGroup.Prepend>
								<Button variant="secondary" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>
								-
								</Button>
							</InputGroup.Prepend>

							<FormControl
								type="number"
								min="1"
								value={item.quantity}
								onChange={(e) => updateQuantity(item.productId, e.target.value)}
							/>

							<InputGroup.Append>
								<Button variant="secondary" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>
								+
								</Button>
							</InputGroup.Append>
						</InputGroup>
					</td>

					<td>₱{item.subtotal}</td>
					
					<td className="text-center">
						<Button variant="danger" onClick={() => removeFromCart(item.productId)}>
						Remove
						</Button>
					</td>
				</tr>
				))
			);

			let tempTotal = 0;
				cart.forEach((item) => {
					tempTotal += item.subtotal;
			});

		setTotal(tempTotal);

	}, [cart]);
// ============================================================




// ============================================================

	//Update the quantity of items in cart
	const updateQuantity = (productId, newQuantity) => {
	  // Make a PUT request to the API endpoint to update the quantity
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
		.then((data) => {
	      // Assuming the API response contains an 'updatedCart' field
			const { updatedCart, message } = data;

	      // Handle the response or perform any necessary actions
			console.log(message);

	      // After updating the quantity, you may want to fetch the updated cart
			fetchCart();
		})
		.catch((error) => {
			console.error('Error updating quantity:', error);
	      // Handle the error if necessary
		});
	};
// ============================================================



// ============================================================
	const removeFromCart = (productId) => {
  fetch(`${process.env.REACT_APP_API_URL}/cart/${productId}/removeFromCart`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to remove item from cart: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // Display the confirmation modal
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Your file has been deleted.',
            icon: 'success',
          });
          // After removing the item, fetch the updated cart
          fetchCart();
        }
      });
    })
    .catch((error) => {
      console.error('Error removing item from cart:', error);
      // Handle the error if necessary
    });
};


// ============================================================




// ============================================================

const checkout = () => {
  // Make a POST request to the API to initiate the checkout process
  fetch(`${process.env.REACT_APP_API_URL}/orders/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })
    .then((res) => res.json())
    .then((data) => {
    	console.log(data)
      // Handle the response or perform any necessary actions
      if (data) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Your order has been placed",
          showConfirmButton: false,
          timer: 1500,
        });

        // Fetch the updated cart after successful checkout
      history.push('/orders')
      } 
    })
    .catch((error) => {
      console.error('Error during checkout:', error);
      // Handle the error if necessary
    });
};

// ============================================================


const clearCart = () => {
    fetch(`${process.env.REACT_APP_API_URL}/cart/clearCart`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        // Handle the response or perform any necessary actions
        if (data.cart) {
          setCart(data.cart.cartItems);
          setTotal(data.cart.totalPrice);
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Your cart has been cleared',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      })
      .catch((error) => {
        console.error('Error clearing cart:', error);
        // Handle the error if necessary
      });
  };


return (
    willRedirect ? (
      <Redirect to="/orders" />
    ) : cart.length <= 0 ? (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Your cart is empty
        </Typography>
        <Button 
          variant="contained" 
          component={Link} 
          to="/products"
          sx={{ mt: 2 }}
        >
          Start Shopping
        </Button>
      </Container>
    ) : (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          Your Shopping Cart
        </Typography>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: '#003366' }}>
              <TableRow>
                <TableCell sx={{ color: 'white' }}>Product</TableCell>
                <TableCell sx={{ color: 'white' }}>Price</TableCell>
                <TableCell sx={{ color: 'white' }}>Quantity</TableCell>
                <TableCell sx={{ color: 'white' }}>Subtotal</TableCell>
                <TableCell sx={{ color: 'white' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cart.map((item) => (
                <TableRow key={item.productId}>
                  <TableCell>
                    <Link 
                      to={`/products/${item.productId}`} 
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      {item.productName}
                    </Link>
                  </TableCell>
                  <TableCell>₱{item.price.toLocaleString()}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <IconButton onClick={() => updateQuantity(item.productId, item.quantity - 1)}>
                        <RemoveIcon />
                      </IconButton>
                      <TextField
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.productId, e.target.value)}
                        sx={{ width: 80, mx: 1 }}
                        inputProps={{ min: 1 }}
                      />
                      <IconButton onClick={() => updateQuantity(item.productId, item.quantity + 1)}>
                        <AddIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell>₱{(item.price * item.quantity).toLocaleString()}</TableCell>
                  <TableCell>
                    <IconButton 
                      color="error" 
                      onClick={() => removeFromCart(item.productId)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3} align="right">
                  <Typography variant="h6">
                    Total:
                  </Typography>
                </TableCell>
                <TableCell colSpan={2}>
                  <Typography variant="h6" color="primary">
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
            color="error"
            startIcon={<ClearAllIcon />}
            onClick={clearCart}
          >
            Clear Cart
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<ShoppingCartCheckoutIcon />}
            onClick={checkout}
            sx={{ px: 4 }}
          >
            Checkout
          </Button>
        </Box>
      </Container>
    )
  );
}