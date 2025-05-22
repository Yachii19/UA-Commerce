import React, { useContext } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, IconButton, Badge } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import LogoutIcon from '@mui/icons-material/Logout';
import UserContext from '../UserContext';

export default function AppNavBar() {
  const { user } = useContext(UserContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);

  // Adjust navLinks and logout button for logged out users
  const isLoggedIn = !!user && !!user.id;
  const isAdmin = user && user.isAdmin;
  const navLinks = isAdmin
    ? [
        { label: 'Admin', to: '/products', icon: <StorefrontIcon style={{ color: '#000' }} /> },
        { label: 'Profile', to: '/profile', icon: <AccountCircleIcon style={{ color: '#000' }} /> },
      ]
    : isLoggedIn
      ? [
          { label: 'Products', to: '/products', icon: <StorefrontIcon style={{ color: '#000' }} /> },
          { label: 'Orders', to: '/orders', icon: <ListAltIcon style={{ color: '#000' }} /> },
          { label: 'Profile', to: '/profile', icon: <AccountCircleIcon style={{ color: '#000' }} /> },
          { label: 'Cart', to: '/cart', icon: <ShoppingCartIcon style={{ color: '#000'}} /> },
        ]
      : [
          { label: 'Register', to: '/register' },
          { label: 'Log In', to: '/login' },
        ];

  return (
    <AppBar position="static" style={{ backgroundColor: '#fff', boxShadow: 'none' }}>
      <Container>
        <Toolbar>
          <Typography variant="h6" component={Link} to="/" style={{ flexGrow: 1, color: '#000', textDecoration: 'none', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            UA Shop
          </Typography>
          {isMobile ? (
            <>
              <IconButton edge="end" style={{ color: '#000' }} aria-label="menu" onClick={handleDrawerToggle}>
                <MenuIcon />
              </IconButton>
              <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerToggle}
                PaperProps={{ sx: { backgroundColor: '#fff', color: '#000', p: 2 } }}>
                <List sx={{ width: 240 }}>
                  {navLinks.map((item) => (
                    <ListItem key={item.label} disablePadding>
                      <ListItemButton component={Link} to={item.to} onClick={handleDrawerToggle} sx={{ color: '#000', py: 1.5, backgroundColor: '#fff', '&:hover': { backgroundColor: '#f5f5f5' } }}>
                        {item.icon ? (
                          <Box sx={{ minWidth: 32, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#000' }}>{item.icon}</Box>
                        ) : null}
                        <ListItemText primary={item.label} sx={{ ml: item.icon ? 1 : 0, color: '#000' }} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                  {isLoggedIn && (
                    <ListItem disablePadding>
                      <ListItemButton component={Link} to="/logout" onClick={handleDrawerToggle} sx={{ justifyContent: 'center', mt: 2, backgroundColor: '#000', color: '#fff', borderRadius: 0, '&:hover': { backgroundColor: '#222' }, display: 'flex', alignItems: 'center' }}>
                        <LogoutIcon style={{ color: '#fff', marginRight: 4 }} />
                        <ListItemText primary="Log Out" sx={{ textAlign: 'center', fontWeight: 700, ml: 0, color: '#fff' }} />
                      </ListItemButton>
                    </ListItem>
                  )}
                </List>
              </Drawer>
            </>
          ) : (
            <Nav style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              {navLinks.map((item) => (
                item.icon ? (
                  <IconButton
                    key={item.label}
                    color="inherit"
                    component={Link}
                    to={item.to}
                    style={{ marginRight: '8px', color: '#000', background: '#fff' }}
                  >
                    {item.icon}
                  </IconButton>
                ) : (
                  <Button
                    key={item.label}
                    color="inherit"
                    component={Link}
                    to={item.to}
                    style={{ marginRight: '8px', color: '#000', fontWeight: 700, textTransform: 'uppercase', background: '#fff', boxShadow: 'none' }}
                  >
                    {item.label}
                  </Button>
                )
              ))}
              {isLoggedIn && (
                <Button
                  color="inherit"
                  component={Link}
                  to="/logout"
                  style={{ marginLeft: '8px', backgroundColor: '#000', color: '#fff', fontWeight: 400, textTransform: 'uppercase', borderRadius: 0, boxShadow: 'none', padding: '10px 18px', display: 'flex', alignItems: 'center' }}
                >
                  <LogoutIcon style={{ color: '#fff', marginRight: 8 }} /> Log Out
                </Button>
              )}
            </Nav>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}