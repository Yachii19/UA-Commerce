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
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Email,
  Phone,
  Person,
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Color palette
  const primaryColor = '#003366'; // Deep blue
  const secondaryColor = '#1976d2'; // Medium blue
  const accentColor = '#ffc107'; // Gold
  const lightBg = '#f8fafc';

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
          confirmButtonColor: primaryColor,
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
    <Container 
      maxWidth="lg" 
      sx={{ 
        py: 6,
        minHeight: 'calc(100vh - 128px)',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <Paper
        elevation={isMobile ? 0 : 3}
        sx={{
          width: '100%',
          p: { xs: 3, md: 4 },
          borderRadius: 4,
          backgroundColor: lightBg,
          boxShadow: isMobile ? 'none' : `0 8px 32px rgba(0, 51, 102, 0.1)`,
          border: isMobile ? 'none' : `1px solid rgba(0, 51, 102, 0.1)`,
          overflow: 'hidden',
          position: 'relative',
          '&:before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '8px',
            background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
          }
        }}
      >
        {loading ? (
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              minHeight: '300px' 
            }}
          >
            <CircularProgress sx={{ color: primaryColor }} size={60} />
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
                  borderRight: isMobile ? 'none' : `1px solid rgba(0, 51, 102, 0.1)`,
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: primaryColor,
                    width: 120,
                    height: 120,
                    mb: 3,
                    fontSize: 50,
                    boxShadow: 3,
                  }}
                >
                  {details?.firstName?.charAt(0).toUpperCase()}
                </Avatar>
                
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 700, 
                    color: primaryColor,
                    mb: 1
                  }}
                >
                  {details?.firstName} {details?.lastName}
                </Typography>
                
                <Chip
                  icon={<Security fontSize="small" />}
                  label={user.isAdmin ? "Administrator" : "Standard User"}
                  color={user.isAdmin ? "primary" : "default"}
                  variant="outlined"
                  sx={{ 
                    mb: 3,
                    borderColor: user.isAdmin ? primaryColor : 'default',
                    color: user.isAdmin ? primaryColor : 'default'
                  }}
                />
                
                <Box sx={{ width: '100%' }}>
                  <Divider sx={{ my: 2, bgcolor: 'rgba(0, 51, 102, 0.1)' }} />
                  
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 1.5 
                    }}
                  >
                    <Badge sx={{ color: primaryColor, mr: 1.5 }} />
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Member since: {new Date(details?.createdAt).toLocaleDateString()}
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
                    fontWeight: 600, 
                    mb: 2, 
                    color: primaryColor,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <AccountCircle sx={{ mr: 1, color: secondaryColor }} />
                  Personal Information
                </Typography>
                
                <Paper 
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    backgroundColor: 'white',
                    border: '1px solid rgba(0, 51, 102, 0.1)'
                  }}
                >
                  <List disablePadding>
                    <ListItem 
                      disablePadding 
                      sx={{ 
                        py: 1.5,
                        borderBottom: '1px solid rgba(0, 51, 102, 0.05)'
                      }}
                    >
                      <Email sx={{ 
                        color: secondaryColor, 
                        mr: 2,
                        fontSize: '1.5rem'
                      }} />
                      <ListItemText 
                        primary="Email Address" 
                        secondary={details?.email || "Not provided"}
                        primaryTypographyProps={{ 
                          sx: { 
                            fontWeight: 500,
                            color: primaryColor
                          } 
                        }}
                        secondaryTypographyProps={{ 
                          sx: { 
                            color: 'text.secondary',
                            fontSize: '0.95rem'
                          } 
                        }}
                      />
                    </ListItem>
                    
                    <ListItem 
                      disablePadding 
                      sx={{ py: 1.5 }}
                    >
                      <Phone sx={{ 
                        color: secondaryColor, 
                        mr: 2,
                        fontSize: '1.5rem'
                      }} />
                      <ListItemText 
                        primary="Mobile Number" 
                        secondary={details?.mobileNo || "Not provided"}
                        primaryTypographyProps={{ 
                          sx: { 
                            fontWeight: 500,
                            color: primaryColor
                          } 
                        }}
                        secondaryTypographyProps={{ 
                          sx: { 
                            color: 'text.secondary',
                            fontSize: '0.95rem'
                          } 
                        }}
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Box>

              <Divider sx={{ 
                my: 4, 
                bgcolor: 'rgba(0, 51, 102, 0.1)',
                height: '2px'
              }} />

              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600, 
                    mb: 2, 
                    color: primaryColor,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Edit sx={{ mr: 1, color: secondaryColor }} />
                  Account Security
                </Typography>
                
                <Paper 
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    backgroundColor: 'white',
                    border: '1px solid rgba(0, 51, 102, 0.1)'
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
  );
}