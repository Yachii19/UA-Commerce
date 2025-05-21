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
  Divider
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

  // All blue theme palette
  const blueMain = '#003366';
  const blueLight = '#1976d2';
  const blueBg = '#eef3fa';

  return (
    <Container maxWidth="md" sx={{ py: 5, minHeight: '75vh' }}>
      <Paper elevation={6} sx={{ p: { xs: 3, md: 6 }, borderRadius: 4, mb: 3, bgcolor: blueBg }}>
        <Typography
          variant="h3"
          align="center"
          sx={{
            color: blueMain,
            fontWeight: 700,
            mb: 4,
            letterSpacing: 1
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
              bgcolor: "#f0f6fb",
              borderRadius: 3,
              boxShadow: 0,
              minHeight: 260,
            }}
          >
            <ShoppingCartIcon sx={{ color: blueLight, fontSize: 60, mb: 2 }} />
            <Typography variant="h5" color={blueMain} sx={{ mb: 2 }}>
              No orders placed yet!
            </Typography>
            <Typography variant="body1" color={blueLight}>
              <Link to="/products" style={{ color: blueLight, fontWeight: 600, textDecoration: 'none' }}>
                Start shopping.
              </Link>
            </Typography>
          </Box>
        ) : (
          <Box>
            {orders.map((order, idx) => (
              <Accordion
                key={order._id}
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  overflow: 'hidden',
                  bgcolor: '#f7faff',
                  border: `1.5px solid ${blueLight}`,
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: blueLight }} />}
                  aria-controls={`order-content-${idx}`}
                  id={`order-header-${idx}`}
                  sx={{
                    bgcolor: blueMain,
                    color: '#fff',
                    px: 3,
                    py: 2,
                  }}
                >
                  <Typography variant="h6" fontWeight={500}>
                    Order #{idx + 1} - Purchased on: {moment(order.purchasedOn).format("MM-DD-YYYY")}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ bgcolor: '#fff', px: 3 }}>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1, color: blueMain }}>
                    Items:
                  </Typography>
                  <List dense>
                    {order.productsOrdered.map((item) => (
                      <ListItem key={item._id} sx={{ py: 1 }}>
                        <ListItemText
                          primary={item.productName}
                          secondary={`Quantity: ${item.quantity}`}
                          primaryTypographyProps={{ fontWeight: 500, color: blueMain }}
                        />
                        <Chip
                          label={`x${item.quantity}`}
                          sx={{
                            fontWeight: 600,
                            bgcolor: blueLight,
                            color: '#fff',
                            ml: 1,
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" fontWeight={700} sx={{ color: blueMain }}>
                    Total: <span style={{ color: blueLight }}>₱{order.totalPrice}</span>
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        )}
      </Paper>
    </Container>
  );
}