import React, { useState, useContext } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Box,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link, Redirect, useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';

export default function LoginForm(props) {
  const history = useHistory();
  const { user, setUser } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [willRedirect, setWillRedirect] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const authenticate = (e) => {
    e.preventDefault();

    fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        password: password
      })
    })
      .then(res => res.json())
      .then(data => {
        if (typeof data.access !== 'undefined') {
          localStorage.setItem('token', data.access);
          retrieveUserDetails(data.access);

          Swal.fire({
            title: 'Login Successful',
            icon: 'success',
            confirmButtonColor: '#000'
          });
        } else {
          Swal.fire({
            title: data.error || 'Authentication Failed',
            icon: 'error',
            text: data.message || 'Please check your login details and try again.',
            confirmButtonColor: '#000'
          });
        }
      })
      .catch((err) => {
        Swal.fire({
          title: 'Network Error',
          icon: 'error',
          text: err.message || 'Please try again later.',
          confirmButtonColor: '#000'
        });
      });
  }

  const retrieveUserDetails = (token) => {
    fetch(`${process.env.REACT_APP_API_URL}/users/details`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setUser({ id: data._id, isAdmin: data.isAdmin });

        if (data.isAdmin === true) {
          setWillRedirect(true);
        } else {
          if (props.location?.state?.from === 'cart') {
            history.goBack();
          } else {
            setWillRedirect(true);
          }
        }
      });
  }

  if (willRedirect === true) {
    return user.isAdmin === true ? <Redirect to='/products' /> : <Redirect to='/' />;
  }

  return (
    <Container 
      maxWidth="sm" 
      sx={{ 
        minHeight: '80vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
      }}
    >
      <Paper 
        elevation={0}
        sx={{ 
          width: '100%', 
          p: { xs: 3, sm: 5 }, 
          border: '1px solid #e0e0e0',
          borderRadius: 0
        }}
      >
        <Typography 
          variant="h4" 
          align="center" 
          gutterBottom 
          sx={{
            fontWeight: 700,
            color: 'black',
            letterSpacing: 1,
            textTransform: 'uppercase'
          }}
        >
          LOG IN
        </Typography>
        <Box component="form" onSubmit={authenticate}>
          <Stack spacing={3}>
            <TextField
              label="EMAIL"
              type="email"
              variant="outlined"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              fullWidth
              sx={{
                '& .MuiInputLabel-root': {
                  fontWeight: 600
                }
              }}
            />
            <TextField
              label="PASSWORD"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              fullWidth
              sx={{
                '& .MuiInputLabel-root': {
                  fontWeight: 600
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword((show) => !show)}
                      edge="end"
                      sx={{
                        color: 'black',
                        '&:hover': {
                          backgroundColor: '#e0e0e0'
                        }
                      }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Button
              variant="contained"
              type="submit"
              size="large"
              fullWidth
              sx={{ 
                backgroundColor: 'black',
                color: 'white',
                borderRadius: 0,
                fontWeight: 600,
                letterSpacing: 1,
                py: 1.5,
                '&:hover': {
                  backgroundColor: '#333'
                }
              }}
            >
              SUBMIT
            </Button>
          </Stack>
        </Box>
        <Typography 
          align="center" 
          sx={{ 
            mt: 3,
            color: '#666'
          }}
        >
          Don't have an account yet?{' '}
          <Link 
            to="/register" 
            style={{ 
              textDecoration: 'none', 
              color: 'black',
              fontWeight: 600,
              borderBottom: '1px solid black'
            }}
          >
            Register here
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
}