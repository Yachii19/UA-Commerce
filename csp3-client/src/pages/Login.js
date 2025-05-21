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
            title: 'Login Successfully',
            icon: 'success'
          });
        } else {
          Swal.fire({
            title: data.error || 'User not found',
            icon: 'error',
            text: data.message || 'Authentication failed. Please check your login details and try again.',
          });
        }
      })
      .catch((err) => {
        Swal.fire({
          title: 'Network error',
          icon: 'error',
          text: err.message || 'Please try again later.'
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
    <Container maxWidth="sm" sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={6} sx={{ width: '100%', p: { xs: 3, sm: 5 }, mt: 7 }}>
        <Typography variant="h4" align="center" gutterBottom fontWeight={700}>
          Log In
        </Typography>
        <Box component="form" onSubmit={authenticate}>
          <Stack spacing={3}>
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword((show) => !show)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              size="large"
              sx={{ fontWeight: 600 }}
              fullWidth
            >
              Submit
            </Button>
          </Stack>
        </Box>
        <Typography align="center" sx={{ mt: 3 }}>
          Don't have an account yet?{' '}
          <Link to="/register" style={{ textDecoration: 'none', color: '#1976d2', fontWeight: 500 }}>
            Click here
          </Link>{' '}
          to register.
        </Typography>
      </Paper>
    </Container>
  );
}