import React, { useContext } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, IconButton, Badge } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import UserContext from '../UserContext';

export default function AppNavBar() {
  const { user } = useContext(UserContext);

  return (
    <AppBar position="static" style={{ backgroundColor: '#003366' }}>
      <Container>
        <Toolbar>
          <Typography variant="h6" component={Link} to="/" style={{ flexGrow: 1, color: 'white', textDecoration: 'none' }}>
            UA Shop
          </Typography>
          
          <Nav>
            <Button 
              color="inherit" 
              component={Link} 
              to="/products" 
              style={{ marginRight: '16px' }}
            >
              {user.isAdmin ? 'Admin Dashboard' : 'Products'}
            </Button>
            
            {user.id !== null ? (
              user.isAdmin ? (
                <Button color="inherit" component={Link} to="/logout">
                  Log Out
                </Button>
              ) : (
                <>
                  <IconButton 
                    color="inherit" 
                    component={Link} 
                    to="/cart" 
                    style={{ marginRight: '8px' }}
                  >
                    <Badge badgeContent={user.cartCount || 0} color="secondary">
                      <ShoppingCartIcon />
                    </Badge>
                  </IconButton>
                  <Button color="inherit" component={Link} to="/orders" style={{ marginRight: '16px' }}>
                    Orders
                  </Button>
                  <Button color="inherit" component={Link} to="/profile" style={{ marginRight: '16px' }}>
                    Profile
                  </Button>
                  <Button color="inherit" component={Link} to="/logout">
                    Log Out
                  </Button>
                </>
              )
            ) : (
              <>
                <Button color="inherit" component={Link} to="/login" style={{ marginRight: '16px' }}>
                  Log In
                </Button>
                <Button color="inherit" component={Link} to="/register">
                  Register
                </Button>
              </>
            )}
          </Nav>
        </Toolbar>
      </Container>
    </AppBar>
  );
}