import React from 'react';
import { Container, Paper, Typography, Button, Stack } from '@mui/material';
import { useHistory } from 'react-router-dom';

export default function Error() {
  const history = useHistory();

  return (
    <Container maxWidth="sm" sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={6} sx={{ p: 4, width: '100%', textAlign: 'center' }}>
        <Stack spacing={3}>
          <Typography variant="h2" color="primary" fontWeight={700}>
            404
          </Typography>
          <Typography variant="h5" color="text.secondary">
            The page you are looking for cannot be found.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => history.push('/')}
          >
            Back Home
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}