import React, { useEffect, useState, useContext } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField,
  Typography,
  Grid,
  IconButton,
  Stack
} from '@mui/material';
import { Link } from 'react-router-dom';
import moment from 'moment';
import UserContext from '../UserContext';
import Swal from 'sweetalert2';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

// Helper for SweetAlert2 config
const swalCenter = (options) => Swal.fire({
  position: 'center',
  ...options
});

export default function AdminView() {
  const { user } = useContext(UserContext);
  const [products, setProducts] = useState([]);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [ordersList, setOrdersList] = useState([]);

  // Fetch products
  const fetchProducts = () => {
    fetch(`${process.env.REACT_APP_API_URL}/products/all`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => {
        setProducts(data);
      });
  };

  // Fetch orders
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/orders/all-orders`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        let ordersArray = [];
        if (data && data.orders && Array.isArray(data.orders) && data.orders.length > 0) {
          ordersArray = data.orders;
        } else if (data && data.order) {
          ordersArray = [data.order];
        }
        setOrdersList(ordersArray);
      })
      .catch((error) => {
        console.error('Error fetching orders:', error);
      });
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAdd = () => {
    setName("");
    setDescription("");
    setPrice("");
    setImageUrl("");
    setShowAdd(true);
  };
  const closeAdd = () => setShowAdd(false);

  const openEdit = (productId) => {
    setId(productId);
    fetch(`${process.env.REACT_APP_API_URL}/products/${productId}`)
      .then(res => res.json())
      .then(data => {
        setName(data.name || "");
        setDescription(data.description || "");
        setPrice(data.price !== undefined ? data.price : "");
        setImageUrl(data.imageUrl || "");
      });
    setShowEdit(true);
  };

  const closeEdit = () => {
    setName("");
    setDescription("");
    setPrice("");
    setImageUrl("");
    setShowEdit(false);
  };

  const addProduct = (e) => {
    e.preventDefault();
    fetch(`${process.env.REACT_APP_API_URL}/products`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        description: description,
        price: Number(price),
        imageUrl: imageUrl
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data?._id) {
          swalCenter({
            icon: 'success',
            title: 'Product successfully added.',
            showConfirmButton: false,
            timer: 1500,
          });
          closeAdd();
          fetchProducts();
        } else {
          swalCenter({
            icon: 'error',
            title: data?.error || 'Something went wrong.',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
  };

  const editProduct = (e, productId) => {
    e.preventDefault();
    fetch(`${process.env.REACT_APP_API_URL}/products/${productId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        description: description,
        price: Number(price),
        imageUrl: imageUrl
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.message === 'Product updated successfully') {
          swalCenter({
            icon: 'success',
            title: 'Product successfully updated.',
            showConfirmButton: false,
            timer: 1500,
          });
          closeEdit();
          fetchProducts();
        } else {
          swalCenter({
            icon: 'error',
            title: data?.error || 'Something went wrong.',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
  };

  const activateProduct = (productId) => {
    fetch(`${process.env.REACT_APP_API_URL}/products/${productId}/activate`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.message === 'Product activated successfully') {
          swalCenter({
            icon: 'success',
            title: 'Product successfully activated.',
            showConfirmButton: false,
            timer: 1500,
          });
          fetchProducts();
        } else {
          swalCenter({
            icon: 'error',
            title: data?.error || 'Something went wrong.',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
  };

  const archiveProduct = (productId) => {
    fetch(`${process.env.REACT_APP_API_URL}/products/${productId}/archive`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.message === 'Product archived successfully') {
          swalCenter({
            icon: 'success',
            title: 'Product successfully archived',
            showConfirmButton: false,
            timer: 1500,
          });
          fetchProducts();
        } else {
          swalCenter({
            icon: 'error',
            title: data?.error || 'Something went wrong.',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
  };

  const toggler = () => setToggle((toggle) => !toggle);

  return (
    <div style={{ padding: '24px'}}>
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Grid item>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 700, color: 'black' }}>
            ADMIN DASHBOARD
          </Typography>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openAdd}
            sx={{ 
              mr: 2,
              backgroundColor: 'black',
              color: 'white',
              borderRadius: 0,
              '&:hover': {
                backgroundColor: '#333'
              }
            }}
          >
            ADD PRODUCT
          </Button>
          <Button
            variant={toggle ? "outlined" : "contained"}
            onClick={toggler}
            sx={{
              borderRadius: 0,
              borderColor: 'black',
              color: toggle ? 'black' : 'white',
              backgroundColor: toggle ? 'transparent' : 'black',
              '&:hover': {
                backgroundColor: toggle ? '#f5f5f5' : '#333',
                borderColor: 'black'
              }
            }}
          >
            {toggle ? "SHOW PRODUCTS" : "SHOW ORDERS"}
          </Button>
        </Grid>
      </Grid>

      {!toggle ? (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
          <Table>
            <TableHead sx={{ backgroundColor: 'black' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>PRODUCT</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>DESCRIPTION</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>PRICE</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>STATUS</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow 
                  key={product._id}
                  sx={{ 
                    '&:hover': {
                      backgroundColor: '#f9f9f9'
                    } 
                  }}
                >
                  <TableCell>
                    <Link 
                      to={`/products/${product._id}`} 
                      style={{ 
                        textDecoration: 'none', 
                        color: 'black',
                        fontWeight: 600
                      }}
                    >
                      {product.name}
                    </Link>
                  </TableCell>
                  <TableCell sx={{ color: '#666' }}>{product.description}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>₱{Number(product.price).toLocaleString()}</TableCell>
                  <TableCell>
                    {product.isActive ? (
                      <CheckCircleIcon sx={{ color: 'black' }} />
                    ) : (
                      <CancelIcon sx={{ color: '#999' }} />
                    )}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row">
                      <IconButton 
                        onClick={() => openEdit(product._id)}
                        sx={{ 
                          color: 'black',
                          '&:hover': {
                            backgroundColor: '#f0f0f0'
                          }
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      {product.isActive ? (
                        <IconButton 
                          onClick={() => archiveProduct(product._id)}
                          sx={{ 
                            color: '#999',
                            '&:hover': {
                              color: 'black',
                              backgroundColor: '#f0f0f0'
                            }
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      ) : (
                        <IconButton 
                          onClick={() => activateProduct(product._id)}
                          sx={{ 
                            color: 'black',
                            '&:hover': {
                              backgroundColor: '#f0f0f0'
                            }
                          }}
                        >
                          <CheckCircleIcon />
                        </IconButton>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <div>
          {ordersList.length > 0 ? (
            ordersList.map((order) => (
              <Paper 
                key={order._id} 
                elevation={0}
                sx={{ 
                  mb: 3, 
                  p: 2, 
                  borderLeft: "3px solid black",
                  backgroundColor: 'white',
                  border: '1px solid #e0e0e0'
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  ORDER FOR USER: <span style={{ color: '#666' }}>{order.userId}</span>
                </Typography>
                {order.productsOrdered && order.productsOrdered.length > 0 ? (
                  order.productsOrdered.map((product) => (
                    <div key={product._id}>
                      <Typography variant="body1" sx={{ color: '#666' }}>
                        PURCHASED ON {moment(order.orderedOn).format("MM-DD-YYYY")}:
                      </Typography>
                      <ul style={{ margin: 0, paddingLeft: '20px' }}>
                        <li style={{ color: '#333' }}>
                          {product.productName} - QUANTITY: {product.quantity}
                        </li>
                      </ul>
                      <Typography variant="body2" sx={{ fontWeight: 700, mt: 1 }}>
                        TOTAL: <span style={{ color: 'black' }}>₱{order.totalPrice}</span>
                      </Typography>
                      <hr style={{ borderColor: '#e0e0e0', margin: '16px 0' }} />
                    </div>
                  ))
                ) : (
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    NO ORDERS FOR THIS USER YET.
                  </Typography>
                )}
              </Paper>
            ))
          ) : (
            <Typography 
              variant="body1" 
              sx={{ 
                textAlign: 'center', 
                my: 4,
                color: '#666'
              }}
            >
              NO ORDERS FOUND.
            </Typography>
          )}
        </div>
      )}

      {/* Add Product Dialog */}
      <Dialog open={showAdd} onClose={closeAdd} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 0 } }}>
        <DialogTitle sx={{ fontWeight: 700, backgroundColor: 'black', color: 'white' }}>
          ADD NEW PRODUCT
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            autoFocus
            margin="dense"
            label="PRODUCT NAME"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 2 }}
            InputLabelProps={{ sx: { fontWeight: 600 } }}
          />
          <TextField
            margin="dense"
            label="DESCRIPTION"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mb: 2 }}
            InputLabelProps={{ sx: { fontWeight: 600 } }}
          />
          <TextField
            margin="dense"
            label="PRICE"
            type="number"
            fullWidth
            variant="outlined"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            sx={{ mb: 2 }}
            InputLabelProps={{ sx: { fontWeight: 600 } }}
          />
          <TextField
            margin="dense"
            label="IMAGE URL"
            fullWidth
            variant="outlined"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            InputLabelProps={{ sx: { fontWeight: 600 } }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={closeAdd}
            sx={{
              color: 'black',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: '#f5f5f5'
              }
            }}
          >
            CANCEL
          </Button>
          <Button 
            onClick={addProduct} 
            variant="contained"
            sx={{
              backgroundColor: 'black',
              color: 'white',
              borderRadius: 0,
              fontWeight: 600,
              '&:hover': {
                backgroundColor: '#333'
              }
            }}
          >
            ADD PRODUCT
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={showEdit} onClose={closeEdit} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 0 } }}>
        <DialogTitle sx={{ fontWeight: 700, backgroundColor: 'black', color: 'white' }}>
          EDIT PRODUCT
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            autoFocus
            margin="dense"
            label="PRODUCT NAME"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 2 }}
            InputLabelProps={{ sx: { fontWeight: 600 } }}
          />
          <TextField
            margin="dense"
            label="DESCRIPTION"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mb: 2 }}
            InputLabelProps={{ sx: { fontWeight: 600 } }}
          />
          <TextField
            margin="dense"
            label="PRICE"
            type="number"
            fullWidth
            variant="outlined"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            sx={{ mb: 2 }}
            InputLabelProps={{ sx: { fontWeight: 600 } }}
          />
          <TextField
            margin="dense"
            label="IMAGE URL"
            fullWidth
            variant="outlined"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            InputLabelProps={{ sx: { fontWeight: 600 } }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={closeEdit}
            sx={{
              color: 'black',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: '#f5f5f5'
              }
            }}
          >
            CANCEL
          </Button>
          <Button 
            onClick={(e) => editProduct(e, id)} 
            variant="contained"
            sx={{
              backgroundColor: 'black',
              color: 'white',
              borderRadius: 0,
              fontWeight: 600,
              '&:hover': {
                backgroundColor: '#333'
              }
            }}
          >
            SAVE CHANGES
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}