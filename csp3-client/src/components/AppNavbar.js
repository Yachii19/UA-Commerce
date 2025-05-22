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
        { label: 'Admin', to: '/products', icon: <StorefrontIcon style={{ color: '#fff' }} /> },
        { label: 'Profile', to: '/profile', icon: <AccountCircleIcon style={{ color: '#fff' }} /> },
      ]
    : isLoggedIn
      ? [
          { label: 'Products', to: '/products', icon: <StorefrontIcon style={{ color: '#fff' }} /> },
          { label: 'Orders', to: '/orders', icon: <ListAltIcon style={{ color: '#fff' }} /> },
          { label: 'Profile', to: '/profile', icon: <AccountCircleIcon style={{ color: '#fff' }} /> },
          { label: 'Cart', to: '/cart', icon: <ShoppingCartIcon style={{ color: '#fff'}} /> },
        ]
      : [
          { label: 'Register', to: '/register' },
          { label: 'Log In', to: '/login' },
        ];

  return (
    <AppBar position="static" style={{ backgroundColor: '#000', boxShadow: 'none', borderBottom: '1.5px solid #000' }}>
      <Container>
        <Toolbar>
          <Typography variant="h6" component={Link} to="/" style={{ flexGrow: 1, color: '#fff', textDecoration: 'none', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            UA Shop
          </Typography>
          {isMobile ? (
            <>
              <IconButton edge="end" color="inherit" aria-label="menu" onClick={handleDrawerToggle}>
                <MenuIcon />
              </IconButton>
              <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerToggle}
                PaperProps={{ sx: { backgroundColor: '#000', color: '#fff', p: 2 } }}>
                <List sx={{ width: 240 }}>
                  {navLinks.map((item) => (
                    <ListItem key={item.label} disablePadding>
                      <ListItemButton component={Link} to={item.to} onClick={handleDrawerToggle} sx={{ color: '#fff', py: 1.5 }}>
                        {item.icon ? (
                          <Box sx={{ minWidth: 32, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{item.icon}</Box>
                        ) : null}
                        <ListItemText primary={item.label} sx={{ ml: item.icon ? 1 : 0 }} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                  {isLoggedIn && (
                    <ListItem disablePadding>
                      <ListItemButton component={Link} to="/logout" onClick={handleDrawerToggle} sx={{ justifyContent: 'center', mt: 2, backgroundColor: '#E71C4F', color: '#fff', borderRadius: 0, '&:hover': { backgroundColor: '#b31338' }, display: 'flex', alignItems: 'center' }}>
                        <LogoutIcon style={{ color: '#fff', marginRight: 4 }} />
                        <ListItemText primary="Log Out" sx={{ textAlign: 'center', fontWeight: 700, ml: 0 }} />
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
                    style={{ marginRight: '8px', color: '#fff' }}
                  >
                    {item.icon}
                  </IconButton>
                ) : (
                  <Button
                    key={item.label}
                    color="inherit"
                    component={Link}
                    to={item.to}
                    style={{ marginRight: '8px', color: '#fff', fontWeight: 700, textTransform: 'uppercase', background: 'none', boxShadow: 'none' }}
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
                  style={{ marginLeft: '8px', backgroundColor: '#E71C4F', color: '#fff', fontWeight: 700, textTransform: 'uppercase', borderRadius: 0, boxShadow: 'none', padding: '6px 18px', display: 'flex', alignItems: 'center' }}
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