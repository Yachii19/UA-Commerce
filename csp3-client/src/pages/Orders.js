import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Box,
  Chip,
  Divider,
  Button
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Link } from 'react-router-dom';
import moment from 'moment';

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/orders/my-orders`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setOrders(data?.orders || []);
      });
  }, []);

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', py: 5 }}>
      <Container maxWidth="md">
        <Paper elevation={0} sx={{ 
          p: { xs: 3, md: 4 }, 
          borderRadius: 0, 
          mb: 3, 
          bgcolor: 'white',
          border: '1px solid #e5e5e5'
        }}>
          <Typography
            variant="h3"
            align="center"
            sx={{
              color: 'black',
              fontWeight: 900,
              mb: 4,
              letterSpacing: 1,
              textTransform: 'uppercase',
              position: 'relative',
              '&:after': {
                content: '""',
                display: 'block',
                width: '100px',
                height: '3px',
                backgroundColor: 'black',
                margin: '16px auto 0'
              }
            }}
          >
            Order History
          </Typography>
          {orders.length === 0 ? (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              sx={{
                py: 6,
                bgcolor: "white",
                borderRadius: 0,
                minHeight: 260,
                border: '1px solid #e5e5e5'
              }}
            >
              <ShoppingCartIcon sx={{ color: 'black', fontSize: 60, mb: 2 }} />
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 700, color: 'black' }}>
                NO ORDERS PLACED YET!
              </Typography>
              <Button
                component={Link}
                to="/products"
                variant="outlined"
                sx={{
                  color: 'black',
                  borderColor: 'black',
                  borderRadius: 0,
                  fontWeight: 600,
                  px: 4,
                  '&:hover': {
                    backgroundColor: 'black',
                    color: 'white',
                    borderColor: 'black'
                  }
                }}
              >
                START SHOPPING
              </Button>
            </Box>
          ) : (
            <Box>
              {orders.map((order, idx) => (
                <Accordion
                  key={order._id}
                  elevation={0}
                  sx={{
                    mb: 2,
                    borderRadius: 0,
                    overflow: 'hidden',
                    bgcolor: 'white',
                    border: '1px solid #e5e5e5',
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: 'black' }} />}
                    aria-controls={`order-content-${idx}`}
                    id={`order-header-${idx}`}
                    sx={{
                      bgcolor: 'black',
                      color: 'white',
                      px: 3,
                      py: 2,
                    }}
                  >
                    <Typography variant="h6" fontWeight={700} letterSpacing={1}>
                      ORDER #{idx + 1} - {moment(order.purchasedOn).format("MMM DD, YYYY")}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ bgcolor: 'white', px: 3 }}>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1, color: 'black', textTransform: 'uppercase' }}>
                      Items:
                    </Typography>
                    <List dense>
                      {order.productsOrdered.map((item) => (
                        <ListItem key={item._id} sx={{ py: 1, borderBottom: '1px solid #f0f0f0' }}>
                          <ListItemText
                            primary={item.productName}
                            secondary={`Quantity: ${item.quantity}`}
                            primaryTypographyProps={{ fontWeight: 600, color: 'black' }}
                            secondaryTypographyProps={{ color: '#666' }}
                          />
                          <Chip
                            label={`x${item.quantity}`}
                            sx={{
                              fontWeight: 700,
                              bgcolor: 'black',
                              color: 'white',
                              ml: 1,
                              borderRadius: 0
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                    <Divider sx={{ my: 2, bgcolor: '#e5e5e5' }} />
                    <Typography variant="h6" fontWeight={900} sx={{ color: 'black' }}>
                      TOTAL: ₱{order.totalPrice}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}