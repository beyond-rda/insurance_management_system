import { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Alert, Link, FormControlLabel, Checkbox, FormHelperText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const RegisterClient = () => {
  const navigate = useNavigate();
  const { addClient, addApplication } = useApp();
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    nationalId: '', 
    password: '',
    canRequestInsurance: true 
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone must be 10 digits';
    }
    if (!formData.nationalId.trim()) {
      newErrors.nationalId = 'National ID is required';
    } else if (!/^\d{16}$/.test(formData.nationalId)) {
      newErrors.nationalId = 'National ID must be 16 digits';
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
      const client = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        nationalId: formData.nationalId,
        canRequestInsurance: formData.canRequestInsurance
      };
      addClient(client);
      addApplication({
        clientName: formData.name,
        email: formData.email,
        phone: formData.phone,
        status: 'pending',
        canRequestInsurance: formData.canRequestInsurance
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
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
        maxWidth: 500,
        width: '100%',
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
      }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h1" sx={{ fontSize: 48, mb: 2 }}>📋</Typography>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Register as Client
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create your account to access insurance services
          </Typography>
        </Box>

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Registration successful! Redirecting to login...
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={!!errors.name}
            helperText={errors.name}
            margin="normal"
            variant="outlined"
          />
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
            label="Phone (10 digits)"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            error={!!errors.phone}
            helperText={errors.phone}
            margin="normal"
            variant="outlined"
            inputProps={{ maxLength: 10 }}
          />
          <TextField
            fullWidth
            label="National ID (16 digits)"
            value={formData.nationalId}
            onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
            error={!!errors.nationalId}
            helperText={errors.nationalId}
            margin="normal"
            variant="outlined"
            inputProps={{ maxLength: 16 }}
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

          <FormControlLabel
            control={
              <Checkbox
                checked={formData.canRequestInsurance}
                onChange={(e) => setFormData({ ...formData, canRequestInsurance: e.target.checked })}
                color="primary"
              />
            }
            label="I am able to request insurance independently"
            sx={{ mt: 1 }}
          />
          {errors.canRequestInsurance && (
            <Typography variant="caption" color="error">
              {errors.canRequestInsurance}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{ mt: 3, py: 1.5, fontWeight: 'bold' }}
          >
            Register
          </Button>
        </form>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 3 }}>
          Already have an account?{' '}
          <Link href="/" sx={{ cursor: 'pointer' }}>Sign In</Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default RegisterClient;