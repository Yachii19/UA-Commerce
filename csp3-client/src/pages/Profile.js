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
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', py: { xs: 2, md: 6 } }}>
      <Container maxWidth="lg">
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            p: { xs: 1, sm: 2, md: 4 },
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
            <Grid container spacing={{ xs: 2, md: 4 }} direction={{ xs: 'column', md: 'row' }}>
              {/* Profile Section */}
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    p: { xs: 2, sm: 2, md: 3 },
                    height: '100%',
                    borderRight: { xs: 'none', md: '1px solid #e5e5e5' },
                    borderBottom: { xs: '1px solid #e5e5e5', md: 'none' },
                    mb: { xs: 2, md: 0 },
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: 'black',
                      width: { xs: 70, sm: 90, md: 120 },
                      height: { xs: 70, sm: 90, md: 120 },
                      mb: 2,
                      fontSize: { xs: 32, sm: 40, md: 50 },
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
                      textTransform: 'uppercase',
                      fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
                    }}
                  >
                    {details?.firstName} {details?.lastName}
                  </Typography>
                  
                  <Chip
                    icon={<Security fontSize="small" />}
                    label={user.isAdmin ? "ADMINISTRATOR" : "STANDARD USER"}
                    variant="outlined"
                    sx={{ 
                      mb: 2,
                      borderColor: 'black',
                      color: 'black',
                      fontWeight: 600,
                      borderRadius: 0,
                      textTransform: 'uppercase',
                      fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' },
                      px: { xs: 1, sm: 2 },
                    }}
                  />
                  
                  <Box sx={{ width: '100%' }}>
                    <Divider sx={{ my: 2, bgcolor: '#e5e5e5' }} />
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                      <Badge sx={{ color: 'black', mr: 1.5, fontSize: { xs: '1.1rem', md: '1.3rem' } }} />
                      <Typography variant="body2" sx={{ color: '#666', fontSize: { xs: '0.85rem', md: '1rem' } }}>
                        MEMBER SINCE: {new Date(details?.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>

              {/* Details Section */}
              <Grid item xs={12} md={8}>
                <Box sx={{ mb: { xs: 2, md: 4 } }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 900, 
                      mb: 2, 
                      color: 'black',
                      display: 'flex',
                      alignItems: 'center',
                      letterSpacing: 1,
                      textTransform: 'uppercase',
                      fontSize: { xs: '1rem', md: '1.2rem' },
                    }}
                  >
                    <AccountCircle sx={{ mr: 1, color: 'black', fontSize: { xs: '1.2rem', md: '1.5rem' } }} />
                    PERSONAL INFORMATION
                  </Typography>
                  
                  <Paper 
                    elevation={0}
                    sx={{
                      p: { xs: 1.5, sm: 2, md: 3 },
                      borderRadius: 0,
                      backgroundColor: 'white',
                      border: '1px solid #e5e5e5'
                    }}
                  >
                    <List disablePadding>
                      <ListItem 
                        disablePadding 
                        sx={{ 
                          py: { xs: 1, md: 1.5 },
                          borderBottom: '1px solid #e5e5e5'
                        }}
                      >
                        <Email sx={{ color: 'black', mr: 2, fontSize: { xs: '1.1rem', md: '1.5rem' } }} />
                        <ListItemText 
                          primary="EMAIL ADDRESS" 
                          secondary={details?.email || "Not provided"}
                          primaryTypographyProps={{ 
                            sx: { 
                              fontWeight: 700,
                              color: 'black',
                              letterSpacing: 1,
                              fontSize: { xs: '0.95rem', md: '1.05rem' },
                            } 
                          }}
                          secondaryTypographyProps={{ 
                            sx: { 
                              color: '#666',
                              fontSize: { xs: '0.85rem', md: '0.95rem' },
                            } 
                          }}
                        />
                      </ListItem>
                      
                      <ListItem disablePadding sx={{ py: { xs: 1, md: 1.5 } }}>
                        <Phone sx={{ color: 'black', mr: 2, fontSize: { xs: '1.1rem', md: '1.5rem' } }} />
                        <ListItemText 
                          primary="MOBILE NUMBER" 
                          secondary={details?.mobileNo || "Not provided"}
                          primaryTypographyProps={{ 
                            sx: { 
                              fontWeight: 700,
                              color: 'black',
                              letterSpacing: 1,
                              fontSize: { xs: '0.95rem', md: '1.05rem' },
                            } 
                          }}
                          secondaryTypographyProps={{ 
                            sx: { 
                              color: '#666',
                              fontSize: { xs: '0.85rem', md: '0.95rem' },
                            } 
                          }}
                        />
                      </ListItem>
                    </List>
                  </Paper>
                </Box>

                <Divider sx={{ my: { xs: 2, md: 4 }, bgcolor: '#e5e5e5', height: '2px' }} />

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
                      textTransform: 'uppercase',
                      fontSize: { xs: '1rem', md: '1.2rem' },
                    }}
                  >
                    <Edit sx={{ mr: 1, color: 'black', fontSize: { xs: '1.2rem', md: '1.5rem' } }} />
                    ACCOUNT SECURITY
                  </Typography>
                  
                  <Paper 
                    elevation={0}
                    sx={{
                      p: { xs: 1.5, sm: 2, md: 3 },
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