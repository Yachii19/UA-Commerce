import React from 'react';
import { Container, Paper, Typography, Button, Box, Stack } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Banner({ data }) {
  const { title, content, destination, label } = data;

  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
      <Paper
        elevation={6}
        sx={{
          p: { xs: 4, md: 7 },
          background: "linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)",
          color: "#fff",
          borderRadius: 4,
          textAlign: "center"
        }}
      >
        <Stack spacing={3} alignItems="center">
          <Typography variant="h2" fontWeight={700} sx={{ fontSize: { xs: "2.3rem", md: "3rem" } }}>
            {title}
          </Typography>
          <Typography variant="h5" fontWeight={400} id="motto" sx={{ opacity: 0.95 }}>
            {content}
          </Typography>
          <Box>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              component={Link}
              to={destination}
              sx={{
                px: 5,
                py: 1.5,
                fontWeight: 600,
                fontSize: "1.2rem",
                boxShadow: 3
              }}
            >
              {label}
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
}