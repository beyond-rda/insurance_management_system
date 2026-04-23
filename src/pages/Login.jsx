import { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const DEFAULT_ADMIN_EMAIL = 'admin@gmail.com';
const DEFAULT_CLIENT_EMAIL = 'client@gmail.com';

const Login = () => {
  const navigate = useNavigate();
  const { clients } = useApp();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 4) {
      newErrors.password = 'Password must be at least 4 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const normalizedEmail = formData.email.trim().toLowerCase();
      const isDefaultAdmin = normalizedEmail === DEFAULT_ADMIN_EMAIL;
      const isDefaultClient = normalizedEmail === DEFAULT_CLIENT_EMAIL;
      const isRegisteredClient = clients.some(c => c.email.trim().toLowerCase() === normalizedEmail);
      const isClient = isDefaultClient || isRegisteredClient;
      const role = isClient ? 'client' : 'admin';
      localStorage.setItem('role', role);
      localStorage.setItem('user', JSON.stringify({ email: normalizedEmail, role }));
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/client/home');
      }
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a5f7a 0%, #159895 100%)',
      p: 2
    }}>
      <Paper sx={{
        p: 4,
        maxWidth: 450,
        width: '100%',
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
      }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h1" sx={{ fontSize: 48, mb: 2 }}>🛡️</Typography>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Rwanda Insurance
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sign in to access your dashboard
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={!!errors.email}
            helperText={errors.email}
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={!!errors.password}
            helperText={errors.password}
            margin="normal"
            variant="outlined"
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{ mt: 3, py: 1.5, fontWeight: 'bold' }}
          >
            Sign In
          </Button>
        </form>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 3 }}>
          Don't have an account?{' '}
          <Link href="/register" sx={{ cursor: 'pointer' }}>Register as Client</Link>
         </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
          Demo: Use admin@gmail.com for admin, client@gmail.com for client
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;