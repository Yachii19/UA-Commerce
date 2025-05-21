import React, { useState, useEffect } from 'react';
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
import { Link, Redirect } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [error1, setError1] = useState(true);
  const [error2, setError2] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [willRedirect, setWillRedirect] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  useEffect(() => {
    if ((email !== '' && password1 !== '' && password2 !== '') && (password1 === password2)) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [email, password1, password2]);

  useEffect(() => {
    if (email === '' || password1 === '' || password2 === '') {
      setError1(true);
      setError2(false);
      setIsActive(false);
    } else if ((email !== '' && password1 !== '' && password2 !== '') && (password1 !== password2)) {
      setError1(false);
      setError2(true);
      setIsActive(false);
    } else if ((email !== '' && password1 !== '' && password2 !== '') && (password1 === password2)) {
      setError1(false);
      setError2(false);
      setIsActive(true);
    }
  }, [email, password1, password2]);

  const registerUser = (e) => {
    e.preventDefault();

    fetch(`${process.env.REACT_APP_API_URL}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        email: email,
        mobileNo: mobileNo,
        password: password1
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.message === "Registered successfully") {
          Swal.fire({
            title: 'Registration successful!',
            icon: 'success',
            text: 'You may now log in.'
          });
          setWillRedirect(true);
        } else {
          Swal.fire({
            title: data.error || 'Something went wrong',
            icon: 'error',
            text: data.message || 'Please check your details and try again.'
          });
          setFirstName("");
          setLastName("");
          setEmail("");
          setMobileNo("");
          setPassword1("");
          setPassword2("");
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

  if (willRedirect === true) {
    return <Redirect to={{ pathname: '/login', state: { from: 'register' } }} />;
  }

  return (
    <Container maxWidth="sm" sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={6} sx={{ width: '100%', p: { xs: 3, sm: 5 }, mt: 7 }}>
        <Typography variant="h4" align="center" gutterBottom fontWeight={700}>
          Register
        </Typography>
        <Box component="form" onSubmit={registerUser}>
          <Stack spacing={3}>
            <TextField
              label="First Name"
              type="text"
              variant="outlined"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Last Name"
              type="text"
              variant="outlined"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              required
              fullWidth
            />
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
              label="Mobile Number"
              type="text"
              variant="outlined"
              value={mobileNo}
              onChange={e => setMobileNo(e.target.value)}
              required
              fullWidth
              inputProps={{ maxLength: 11 }}
              helperText="Enter your 11 digit mobile number"
            />
            <TextField
              label="Password"
              type={showPassword1 ? "text" : "password"}
              variant="outlined"
              value={password1}
              onChange={e => setPassword1(e.target.value)}
              required
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword1 ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword1((show) => !show)}
                      edge="end"
                    >
                      {showPassword1 ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <TextField
              label="Verify Password"
              type={showPassword2 ? "text" : "password"}
              variant="outlined"
              value={password2}
              onChange={e => setPassword2(e.target.value)}
              required
              fullWidth
              error={error2 && password2 !== ""}
              helperText={error2 && password2 !== "" ? "Passwords must match" : ""}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword2 ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword2((show) => !show)}
                      edge="end"
                    >
                      {showPassword2 ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Button
              variant={isActive ? "contained" : "outlined"}
              color={isActive ? "success" : "error"}
              type="submit"
              size="large"
              fullWidth
              disabled={!isActive}
              sx={{ fontWeight: 600 }}
            >
              {isActive
                ? "Register"
                : error1 || error2
                  ? "Please enter your registration details"
                  : "Passwords must match"}
            </Button>
          </Stack>
        </Box>
        <Typography align="center" sx={{ mt: 3 }}>
          Already have an account?{' '}
          <Link to={{ pathname: '/login', state: { from: 'register' } }} style={{ textDecoration: 'none', color: '#1976d2', fontWeight: 500 }}>
            Click here
          </Link>{' '}
          to log in.
        </Typography>
      </Paper>
    </Container>
  );
}