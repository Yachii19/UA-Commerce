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

  // Black and white palette variables
  const blackMain = '#000000';
  const whiteMain = '#ffffff';
  const grayLight = '#f5f5f5';
  const grayDark = '#333333';

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
        confirmButtonColor: blackMain,
        background: whiteMain,
        color: blackMain
      });
      return;
    }
    if (password !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Password Mismatch',
        text: 'The entered passwords do not match. Please try again.',
        confirmButtonColor: blackMain,
        background: whiteMain,
        color: blackMain
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
          confirmButtonColor: blackMain,
          background: whiteMain,
          color: blackMain
        });
        handleClose();
      })
      .catch((error) => {
        console.error('Error resetting password:', error);
        Swal.fire({
          icon: 'error',
          title: 'Password Reset Failed',
          text: 'An error occurred while resetting your password. Please try again.',
          confirmButtonColor: blackMain,
          background: whiteMain,
          color: blackMain
        });
      });
  };

  return (
    <>
      <Button
        variant="contained"
        sx={{
          background: blackMain,
          color: whiteMain,
          fontWeight: 700,
          borderRadius: 0,
          px: 3,
          py: 1,
          boxShadow: 'none',
          textTransform: 'uppercase',
          letterSpacing: 1,
          border: `1px solid ${blackMain}`,
          '&:hover': {
            background: grayDark,
            borderColor: grayDark
          }
        }}
        startIcon={<LockResetIcon sx={{ color: whiteMain }} />}
        onClick={handleShow}
      >
        Reset Password
      </Button>

      <Dialog open={showModal} onClose={handleClose} maxWidth="xs" fullWidth PaperProps={{
        sx: {
          borderRadius: 0,
          border: `1px solid ${blackMain}`
        }
      }}>
        <DialogTitle
          sx={{
            color: blackMain,
            fontWeight: 700,
            textAlign: 'center',
            letterSpacing: 1,
            pb: 0,
            backgroundColor: grayLight,
            borderBottom: `1px solid ${blackMain}`
          }}
        >
          RESET PASSWORD
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: whiteMain }}>
          <Stack spacing={3} mt={3}>
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
                      sx={{ color: blackMain }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 0,
                  backgroundColor: grayLight
                }
              }}
              sx={{
                '& label': { color: grayDark },
                '& label.Mui-focused': { color: blackMain },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: blackMain },
                  '&.Mui-focused fieldset': { borderColor: blackMain },
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
                      sx={{ color: blackMain }}
                    >
                      {showConfirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 0,
                  backgroundColor: grayLight
                }
              }}
              sx={{
                '& label': { color: grayDark },
                '& label.Mui-focused': { color: blackMain },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: blackMain },
                  '&.Mui-focused fieldset': { borderColor: blackMain },
                },
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ 
          justifyContent: 'space-between', 
          px: 3, 
          pb: 2,
          backgroundColor: grayLight,
          borderTop: `1px solid ${blackMain}`
        }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{
              color: blackMain,
              borderColor: blackMain,
              fontWeight: 700,
              borderRadius: 0,
              textTransform: 'uppercase',
              letterSpacing: 1,
              '&:hover': {
                borderColor: grayDark,
                backgroundColor: whiteMain
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleResetPassword}
            variant="contained"
            sx={{
              backgroundColor: blackMain,
              color: whiteMain,
              fontWeight: 700,
              px: 4,
              borderRadius: 0,
              textTransform: 'uppercase',
              letterSpacing: 1,
              '&:hover': {
                backgroundColor: grayDark
              }
            }}
          >
            Reset
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ResetPassword;