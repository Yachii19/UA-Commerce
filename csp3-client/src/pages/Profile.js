import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  Divider,
  CircularProgress,
  Avatar,
  Grid,
  Chip,
  useMediaQuery
} from '@mui/material';
import {
  Email,
  Phone,
  Security,
  Edit,
  Badge,
  AccountCircle
} from '@mui/icons-material';
import UserContext from '../UserContext';
import { Redirect, useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';
import ResetPassword from '../components/ResetPassword';

export default function Profile() {
  const { user } = useContext(UserContext);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const isMobile = useMediaQuery('(max-width:900px)');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/users/details`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch user details');
        }

        setDetails(data);
      } catch (error) {
        Swal.fire({
          title: error.message.includes('User not found') ? 'Session Expired' : 'Error',
          text: error.message.includes('User not found') 
            ? 'Your session has expired. Please log in again.' 
            : 'Failed to load profile details. Please try again later.',
          icon: 'error',
          confirmButtonColor: 'black',
        });
        history.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [history]);

  if (!user?.id) {
    return <Redirect to="/login" />;
  }

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="lg">
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            p: { xs: 3, md: 4 },
            borderRadius: 0,
            backgroundColor: 'white',
            border: '1px solid #e5e5e5',
            overflow: 'hidden',
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
              <Box 
                sx={{ 
                  width: 50, 
                  height: 50, 
                  border: '3px solid black', 
                  borderBottomColor: 'transparent', 
                  borderRadius: '50%', 
                  animation: 'spin 1s linear infinite',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' }
                  }
                }} 
              />
            </Box>
          ) : (
            <Grid container spacing={4}>
              {/* Profile Section */}
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    p: 3,
                    height: '100%',
                    borderRight: isMobile ? 'none' : '1px solid #e5e5e5',
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: 'black',
                      width: 120,
                      height: 120,
                      mb: 3,
                      fontSize: 50,
                    }}
                  >
                    {details?.firstName?.charAt(0).toUpperCase()}
                  </Avatar>
                  
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 900, 
                      color: 'black',
                      mb: 1,
                      letterSpacing: 1,
                      textTransform: 'uppercase'
                    }}
                  >
                    {details?.firstName} {details?.lastName}
                  </Typography>
                  
                  <Chip
                    icon={<Security fontSize="small" />}
                    label={user.isAdmin ? "ADMINISTRATOR" : "STANDARD USER"}
                    variant="outlined"
                    sx={{ 
                      mb: 3,
                      borderColor: 'black',
                      color: 'black',
                      fontWeight: 600,
                      borderRadius: 0,
                      textTransform: 'uppercase'
                    }}
                  />
                  
                  <Box sx={{ width: '100%' }}>
                    <Divider sx={{ my: 2, bgcolor: '#e5e5e5' }} />
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                      <Badge sx={{ color: 'black', mr: 1.5 }} />
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        MEMBER SINCE: {new Date(details?.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>

              {/* Details Section */}
              <Grid item xs={12} md={8}>
                <Box sx={{ mb: 4 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 900, 
                      mb: 2, 
                      color: 'black',
                      display: 'flex',
                      alignItems: 'center',
                      letterSpacing: 1,
                      textTransform: 'uppercase'
                    }}
                  >
                    <AccountCircle sx={{ mr: 1, color: 'black' }} />
                    PERSONAL INFORMATION
                  </Typography>
                  
                  <Paper 
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 0,
                      backgroundColor: 'white',
                      border: '1px solid #e5e5e5'
                    }}
                  >
                    <List disablePadding>
                      <ListItem 
                        disablePadding 
                        sx={{ 
                          py: 1.5,
                          borderBottom: '1px solid #e5e5e5'
                        }}
                      >
                        <Email sx={{ color: 'black', mr: 2, fontSize: '1.5rem' }} />
                        <ListItemText 
                          primary="EMAIL ADDRESS" 
                          secondary={details?.email || "Not provided"}
                          primaryTypographyProps={{ 
                            sx: { 
                              fontWeight: 700,
                              color: 'black',
                              letterSpacing: 1
                            } 
                          }}
                          secondaryTypographyProps={{ 
                            sx: { 
                              color: '#666',
                              fontSize: '0.95rem'
                            } 
                          }}
                        />
                      </ListItem>
                      
                      <ListItem disablePadding sx={{ py: 1.5 }}>
                        <Phone sx={{ color: 'black', mr: 2, fontSize: '1.5rem' }} />
                        <ListItemText 
                          primary="MOBILE NUMBER" 
                          secondary={details?.mobileNo || "Not provided"}
                          primaryTypographyProps={{ 
                            sx: { 
                              fontWeight: 700,
                              color: 'black',
                              letterSpacing: 1
                            } 
                          }}
                          secondaryTypographyProps={{ 
                            sx: { 
                              color: '#666',
                              fontSize: '0.95rem'
                            } 
                          }}
                        />
                      </ListItem>
                    </List>
                  </Paper>
                </Box>

                <Divider sx={{ my: 4, bgcolor: '#e5e5e5', height: '2px' }} />

                <Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 900, 
                      mb: 2, 
                      color: 'black',
                      display: 'flex',
                      alignItems: 'center',
                      letterSpacing: 1,
                      textTransform: 'uppercase'
                    }}
                  >
                    <Edit sx={{ mr: 1, color: 'black' }} />
                    ACCOUNT SECURITY
                  </Typography>
                  
                  <Paper 
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 0,
                      backgroundColor: 'white',
                      border: '1px solid #e5e5e5'
                    }}
                  >
                    <ResetPassword />
                  </Paper>
                </Box>
              </Grid>
            </Grid>
          )}
        </Paper>
      </Container>
    </Box>
  );
}