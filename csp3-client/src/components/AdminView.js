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
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Product successfully added.",
            showConfirmButton: false,
            timer: 1500,
          });
          closeAdd();
          fetchProducts();
        } else {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: data?.error || "Something went wrong.",
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
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Product successfully updated.",
            showConfirmButton: false,
            timer: 1500,
          });
          closeEdit();
          fetchProducts();
        } else {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: data?.error || "Something went wrong.",
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
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Product successfully activated.",
            showConfirmButton: false,
            timer: 1500,
          });
          fetchProducts();
        } else {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: data?.error || "Something went wrong.",
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
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Product successfully archived",
            showConfirmButton: false,
            timer: 1500,
          });
          fetchProducts();
        } else {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: data?.error || "Something went wrong.",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
  };

  const toggler = () => setToggle((toggle) => !toggle);

  return (
    <div style={{ padding: '24px' }}>
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Grid item>
          <Typography variant="h4" component="h2" color="primary">
            Admin Dashboard
          </Typography>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={openAdd}
            sx={{ mr: 2 }}
          >
            Add Product
          </Button>
          <Button
            variant={toggle ? "outlined" : "contained"}
            color="secondary"
            onClick={toggler}
          >
            {toggle ? "Show Products" : "Show Orders"}
          </Button>
        </Grid>
      </Grid>

      {!toggle ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: '#003366' }}>
              <TableRow>
                <TableCell sx={{ color: 'white' }}>Product</TableCell>
                <TableCell sx={{ color: 'white' }}>Description</TableCell>
                <TableCell sx={{ color: 'white' }}>Price</TableCell>
                <TableCell sx={{ color: 'white' }}>Status</TableCell>
                <TableCell sx={{ color: 'white' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>
                    <Link to={`/products/${product._id}`} style={{ textDecoration: 'none', color: '#003366' }}>
                      {product.name}
                    </Link>
                  </TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>₱{Number(product.price).toLocaleString()}</TableCell>
                  <TableCell>
                    {product.isActive ? (
                      <CheckCircleIcon color="success" />
                    ) : (
                      <CancelIcon color="error" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row">
                      <IconButton color="primary" onClick={() => openEdit(product._id)}>
                        <EditIcon />
                      </IconButton>
                      {product.isActive ? (
                        <IconButton color="error" onClick={() => archiveProduct(product._id)}>
                          <DeleteIcon />
                        </IconButton>
                      ) : (
                        <IconButton color="success" onClick={() => activateProduct(product._id)}>
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
              <Paper key={order._id} sx={{ mb: 3, p: 2, borderLeft: "5px solid #FFD700" }}>
                <Typography variant="h6" color="primary">
                  Orders for user <span style={{ color: '#FFD700' }}>{order.userId}</span>
                </Typography>
                {order.productsOrdered && order.productsOrdered.length > 0 ? (
                  order.productsOrdered.map((product) => (
                    <div key={product._id}>
                      <Typography variant="body1">
                        Purchased on {moment(order.orderedOn).format("MM-DD-YYYY")}:
                      </Typography>
                      <ul style={{ margin: 0 }}>
                        <li>
                          {product.productName} - Quantity: {product.quantity}
                        </li>
                      </ul>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Total: <span style={{ color: '#FFD700' }}>₱{order.totalPrice}</span>
                      </Typography>
                      <hr />
                    </div>
                  ))
                ) : (
                  <Typography variant="body2">No orders for this user yet.</Typography>
                )}
              </Paper>
            ))
          ) : (
            <Typography variant="body1" sx={{ textAlign: 'center', my: 4 }}>
              No orders found.
            </Typography>
          )}
        </div>
      )}

      {/* Add Product Dialog */}
      <Dialog open={showAdd} onClose={closeAdd} fullWidth maxWidth="sm">
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Product Name"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Price"
            type="number"
            fullWidth
            variant="outlined"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Image URL"
            fullWidth
            variant="outlined"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAdd}>Cancel</Button>
          <Button onClick={addProduct} variant="contained" color="primary">
            Add Product
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={showEdit} onClose={closeEdit} fullWidth maxWidth="sm">
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Product Name"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Price"
            type="number"
            fullWidth
            variant="outlined"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Image URL"
            fullWidth
            variant="outlined"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEdit}>Cancel</Button>
          <Button onClick={(e) => editProduct(e, id)} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}