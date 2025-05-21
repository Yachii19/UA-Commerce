import { createTheme } from '@mui/material/styles';

export const uaTheme = createTheme({
  palette: {
    primary: {
      main: '#003366', // UA dark blue
    },
    secondary: {
      main: '#FFD700', // UA gold
    },
    error: {
      main: '#D32F2F',
    },
    background: {
      default: '#F5F5F5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 500,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 500,
      fontSize: '2rem',
    },
    button: {
      textTransform: 'none',
    },
  },
});

export const uaStyles = {
  card: {
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'translateY(-4px)',
    },
  },
  navButton: {
    margin: '0 8px',
    color: 'white',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.1)',
    },
  },
  footer: {
    backgroundColor: '#003366',
    color: 'white',
    padding: '24px 0',
    marginTop: '40px',
  },
};