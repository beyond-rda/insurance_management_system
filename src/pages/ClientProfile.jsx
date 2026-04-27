import { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Avatar, Grid, Alert, Divider, FormControlLabel, Checkbox, Switch } from '@mui/material';
import { Person, Email, Phone, Badge, CalendarToday, Save } from '@mui/icons-material';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const ClientProfile = () => {
  const { clients, updateClient } = useApp();
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const userEmail = userData?.email?.trim().toLowerCase();
  const currentClient = clients.find(c => c.email?.trim().toLowerCase() === userEmail);

  const getInitialFormData = () => ({
    name: currentClient?.name || '',
    email: currentClient?.email || '',
    phone: currentClient?.phone || '',
    nationalId: currentClient?.nationalId || '',
    canRequestInsurance: currentClient?.canRequestInsurance ?? true
  });

  const [formData, setFormData] = useState(getInitialFormData);
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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm() && currentClient) {
      updateClient(currentClient.id, {
        name: formData.name,
        phone: formData.phone,
        nationalId: formData.nationalId,
        canRequestInsurance: formData.canRequestInsurance
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!currentClient) {
    return (
      <Box>
        <Alert severity="error">
          Client data not found. Please register or login with a valid client account.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>My Profile</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        View and manage your personal information
      </Typography>

      <Paper sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', mr: 3, fontSize: 32 }}>
            {formData.name.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h5">{formData.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              Client since {currentClient.createdAt}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Profile updated successfully!
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                variant="outlined"
                InputProps={{
                  startAdornment: <Person sx={{ mr: 1, color: 'action.active' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                disabled
                variant="outlined"
                helperText="Email cannot be changed"
                InputProps={{
                  startAdornment: <Email sx={{ mr: 1, color: 'action.active' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={!!errors.phone}
                helperText={errors.phone || '10 digits required'}
                variant="outlined"
                InputProps={{
                  startAdornment: <Phone sx={{ mr: 1, color: 'action.active' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="National ID"
                name="nationalId"
                value={formData.nationalId}
                onChange={handleChange}
                error={!!errors.nationalId}
                helperText={errors.nationalId || '16 digits required'}
                variant="outlined"
                InputProps={{
                  startAdornment: <Badge sx={{ mr: 1, color: 'action.active' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Member Since"
                value={currentClient.createdAt}
                disabled
                variant="outlined"
                InputProps={{
                  startAdornment: <CalendarToday sx={{ mr: 1, color: 'action.active' }} />
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.canRequestInsurance}
                    onChange={(e) => setFormData({ ...formData, canRequestInsurance: e.target.checked })}
                    color="primary"
                  />
                }
                label="I am able to request insurance independently"
              />
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', ml: 4 }}>
                If unchecked, you may need assistance from our support team to request insurance.
              </Typography>
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              startIcon={<Save />}
              size="large"
            >
              Save Changes
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/client/home')}
              size="large"
            >
              Back to Home
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default ClientProfile;
