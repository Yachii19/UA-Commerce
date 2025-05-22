import React from 'react';
import { Container, Paper, Typography, Button, Stack } from '@mui/material';
import { useHistory } from 'react-router-dom';

export default function Error() {
  const history = useHistory();

  return (
    <div style={{ 
      width: '100%',
      minHeight: '80vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f5f5f5' // Full-width light gray background
    }}>
      <Container maxWidth="sm">
        <Paper elevation={0} sx={{ 
          p: 4, 
          width: '100%', 
          textAlign: 'center',
          backgroundColor: 'white',
          borderRadius: 0,
          border: '1px solid #e5e5e5'
        }}>
          <Stack spacing={3}>
            <Typography variant="h2" sx={{ 
              color: 'black',
              fontWeight: 900,
              letterSpacing: 1
            }}>
              404
            </Typography>
            <Typography variant="h5" sx={{ 
              color: '#666',
              fontWeight: 400,
              textTransform: 'uppercase'
            }}>
              Page Not Found
            </Typography>
            <Button
              variant="outlined"
              size="large"
              onClick={() => history.push('/')}
              sx={{
                color: 'black',
                borderColor: 'black',
                borderRadius: 0,
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: 'black',
                  color: 'white',
                  borderColor: 'black'
                }
              }}
            >
              Back To Home
            </Button>
          </Stack>
        </Paper>
      </Container>
    </div>
  );
}