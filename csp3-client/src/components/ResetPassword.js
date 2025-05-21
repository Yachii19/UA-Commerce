import React, { useState, useContext } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  InputAdornment,
  IconButton
} from '@mui/material';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';
import { Visibility, VisibilityOff, LockReset as LockResetIcon } from '@mui/icons-material';

const ResetPassword = () => {
  const { user } = useContext(UserContext);
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Blue palette variables
  const blueMain = '#003366';
  const blueLight = '#1976d2';
  const blueBg = '#eef3fa';

  const handleClose = () => {
    setShowModal(false);
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirm(false);
  };
  const handleShow = () => setShowModal(true);

  const handleResetPassword = () => {
    if (!password || !confirmPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing fields',
        text: 'Please enter both password fields.',
        confirmButtonColor: blueMain
      });
      return;
    }
    if (password !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Password Mismatch',
        text: 'The entered passwords do not match. Please try again.',
        confirmButtonColor: blueMain
      });
      return;
    }

    fetch(`${process.env.REACT_APP_API_URL}/users/resetPassword`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        newPassword: password,
      }),
    })
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error('Error resetting password');
      })
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Password Reset Successful!',
          text: 'Your password has been successfully reset.',
          confirmButtonColor: blueMain
        });
        handleClose();
      })
      .catch((error) => {
        console.error('Error resetting password:', error);
        Swal.fire({
          icon: 'error',
          title: 'Password Reset Failed',
          text: 'An error occurred while resetting your password. Please try again.',
          confirmButtonColor: blueMain
        });
      });
  };

  return (
    <>
      <Button
        variant="contained"
        sx={{
          background: blueMain,
          fontWeight: 700,
          borderRadius: 3,
          px: 3,
          py: 1,
          boxShadow: 2,
          '&:hover': {
            background: blueLight
          }
        }}
        startIcon={<LockResetIcon />}
        onClick={handleShow}
      >
        RESET PASSWORD
      </Button>

      <Dialog open={showModal} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle
          sx={{
            color: blueMain,
            fontWeight: 700,
            textAlign: 'center',
            letterSpacing: 1,
            pb: 0,
          }}
        >
          Reset Password
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} mt={1}>
            <TextField
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              fullWidth
              value={password}
              onChange={e => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword(show => !show)}
                      edge="end"
                      sx={{ color: blueMain }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{
                '& label.Mui-focused': { color: blueLight },
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': { borderColor: blueLight },
                },
              }}
            />
            <TextField
              label="Confirm Password"
              type={showConfirm ? 'text' : 'password'}
              variant="outlined"
              fullWidth
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              error={!!confirmPassword && password !== confirmPassword}
              helperText={
                !!confirmPassword && password !== confirmPassword
                  ? 'Passwords do not match'
                  : ''
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showConfirm ? "Hide password" : "Show password"}
                      onClick={() => setShowConfirm(show => !show)}
                      edge="end"
                      sx={{ color: blueMain }}
                    >
                      {showConfirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{
                '& label.Mui-focused': { color: blueLight },
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': { borderColor: blueLight },
                },
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{
              color: blueMain,
              borderColor: blueMain,
              fontWeight: 700,
              '&:hover': {
                borderColor: blueLight,
                background: blueBg
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleResetPassword}
            variant="contained"
            sx={{
              background: blueLight,
              color: '#fff',
              fontWeight: 700,
              px: 4,
              '&:hover': {
                background: blueMain
              }
            }}
          >
            Reset Password
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ResetPassword;