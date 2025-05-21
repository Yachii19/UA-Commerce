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
      Swal.fire('Error', "Quantity can't be lower than 1", 'error');
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
        productName: name, // Include productName in the request
        price, // Include price in the request
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
        // Handle success
        Swal.fire({
          icon: 'success',
          title: 'Item added to cart successfully!',
          text: `Total items in cart: ${result.cart.cartItems.length}`,
        }).then(() => {
          // Redirect to the products page
          window.location.href = '/products';
        });
      })
      .catch((error) => {
        // Handle error
        console.error('Caught an error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error adding item to cart',
          text: 'Please try again.',
        });
      });
  };

	const qtyInput = (value) => {

		if (value === '') {
			value = 1;
		} else if (value === "0") {
			alert("Quantity can't be lower than 1.");
			value = 1;
		}

		setQty(value);

	}

	return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button 
        startIcon={<ArrowBackIcon />} 
        component={Link} 
        to="/products" 
        sx={{ mb: 2 }}
      >
        Back to Products
      </Button>
      
      <Card>
        <Grid container>
          {imageUrl && (
            <Grid item xs={12} md={6}>
              <CardMedia
                component="img"
                height="400"
                image={imageUrl}
                alt={name}
                sx={{ objectFit: 'contain', p: 2, backgroundColor: '#f5f5f5' }}
              />
            </Grid>
          )}
          <Grid item xs={12} md={6}>
            <CardContent>
              <Typography variant="h4" component="h1" gutterBottom>
                {name}
              </Typography>
              <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                {description}
              </Typography>
              <Typography variant="h5" color="primary" sx={{ mb: 3 }}>
                ₱{price.toLocaleString()}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mr: 2 }}>
                  Quantity:
                </Typography>
                <IconButton onClick={reduceQty}>
                  <RemoveIcon />
                </IconButton>
                <TextField
                  type="number"
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
                  sx={{ width: 80, mx: 1 }}
                  inputProps={{ min: 1 }}
                />
                <IconButton onClick={increaseQty}>
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
                    sx={{ py: 1.5 }}
                  >
                    Admin cannot add to cart
                  </Button>
                ) : (
                  <Button 
                    variant="contained" 
                    fullWidth 
                    size="large" 
                    onClick={addToCart}
                    sx={{ py: 1.5 }}
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
                  sx={{ py: 1.5 }}
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