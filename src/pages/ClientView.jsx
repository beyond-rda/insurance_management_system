import { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, Grid, Card, CardContent, CardActions, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem, Chip, IconButton } from '@mui/material';
import { Visibility, Compare, CloudUpload, DarkMode, LightMode } from '@mui/icons-material';
import { useApp } from '../context/AppContext';
import { useThemeContext } from '../App';

const ClientView = () => {
  const { policies, addApplication } = useApp();
  const { darkMode, setDarkMode } = useThemeContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [viewOpen, setViewOpen] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [compareList, setCompareList] = useState([]);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', nationalId: '', policyId: '' });

  const handleView = (policy) => {
    setSelectedPolicy(policy);
    setViewOpen(true);
  };

  const handleCompare = (policy) => {
    if (compareList.length < 3 && !compareList.find(p => p.id === policy.id)) {
      setCompareList([...compareList, policy]);
    }
  };

  const removeFromCompare = (id) => {
    setCompareList(compareList.filter(p => p.id !== id));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
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

  const handleApply = () => {
    if (validateForm()) {
      addApplication({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        nationalId: formData.nationalId,
        policyId: formData.policyId,
        policyName: selectedPolicy?.name || ''
      });
      setApplyOpen(false);
      setFormData({ name: '', email: '', phone: '', nationalId: '', policyId: '' });
    }
  };

  const handleOpenApply = (policy) => {
    setSelectedPolicy(policy);
    setFormData({ ...formData, policyId: policy.id });
    setApplyOpen(true);
  };

  const filteredPolicies = policies.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !typeFilter || p.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: darkMode ? '#121212' : '#f5f5f5', py: 4 }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" fontWeight="bold">Insurance Policies</Typography>
          <IconButton onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <LightMode /> : <DarkMode />}
          </IconButton>
        </Box>

        <Box className="filter-bar">
          <TextField label="Search policies..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} size="small" sx={{ minWidth: 250 }} />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Filter by Type</InputLabel>
            <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} label="Filter by Type">
              <MenuItem value="">All</MenuItem>
              <MenuItem value="health">Health</MenuItem>
              <MenuItem value="auto">Auto</MenuItem>
              <MenuItem value="home">Home</MenuItem>
              <MenuItem value="mutuelle">Mutuelle</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Grid container spacing={3}>
          {filteredPolicies.map(policy => (
            <Grid item xs={12} sm={6} md={4} key={policy.id}>
              <Card className="policy-card">
                <CardContent>
                  <Chip label={policy.type} size="small" sx={{ mb: 1, textTransform: 'capitalize', backgroundColor: policy.type === 'health' ? '#e3f2fd' : policy.type === 'auto' ? '#fff3e0' : policy.type === 'home' ? '#f3e5f5' : '#e8f5e9', color: policy.type === 'health' ? '#1565c0' : policy.type === 'auto' ? '#e65100' : policy.type === 'home' ? '#7b1fa2' : '#2e7d32' }} />
                  <Typography variant="h6" gutterBottom>{policy.name}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{policy.description}</Typography>
                  <Typography variant="h5" color="primary" fontWeight="bold">${policy.premium.toLocaleString()}</Typography>
                  <Typography variant="body2" color="text.secondary">per {policy.duration} months</Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" startIcon={<Visibility />} onClick={() => handleView(policy)}>View</Button>
                  <Button size="small" startIcon={<Compare />} onClick={() => handleCompare(policy)} disabled={compareList.length >= 3}>Compare</Button>
                  <Button size="small" variant="contained" onClick={() => handleOpenApply(policy)}>Apply</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {compareList.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>Compare Policies ({compareList.length})</Typography>
            <Paper sx={{ p: 3, overflowX: 'auto' }}>
              <Box sx={{ display: 'flex', gap: 2, minWidth: compareList.length * 250 }}>
                {compareList.map(policy => (
                  <Box key={policy.id} sx={{ minWidth: 250, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, position: 'relative' }}>
                    <IconButton size="small" onClick={() => removeFromCompare(policy.id)} sx={{ position: 'absolute', top: 4, right: 4 }}>×</IconButton>
                    <Typography variant="h6">{policy.name}</Typography>
                    <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>{policy.type}</Typography>
                    <Typography variant="h5" color="primary" fontWeight="bold">${policy.premium.toLocaleString()}</Typography>
                    <Typography variant="body2">Duration: {policy.duration} months</Typography>
                    <Typography variant="body2">{policy.description}</Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Box>
        )}
      </Box>

      <Dialog open={viewOpen} onClose={() => setViewOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Policy Details</DialogTitle>
        <DialogContent>
          {selectedPolicy && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>{selectedPolicy.name}</Typography>
              <Chip label={selectedPolicy.type} size="small" sx={{ mb: 2, textTransform: 'capitalize' }} />
              <Typography variant="body1"><strong>Premium:</strong> ${selectedPolicy.premium.toLocaleString()}/year</Typography>
              <Typography variant="body1"><strong>Duration:</strong> {selectedPolicy.duration} months</Typography>
              <Typography variant="body1"><strong>Description:</strong> {selectedPolicy.description}</Typography>
              <Typography variant="body1"><strong>Status:</strong> {selectedPolicy.status}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewOpen(false)}>Close</Button>
          <Button variant="contained" onClick={() => { setViewOpen(false); handleOpenApply(selectedPolicy); }}>Apply Now</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={applyOpen} onClose={() => setApplyOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Apply for {selectedPolicy?.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField fullWidth label="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} error={!!errors.name} helperText={errors.name} margin="dense" />
            <TextField fullWidth label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} error={!!errors.email} helperText={errors.email} margin="dense" />
            <TextField fullWidth label="Phone (10 digits)" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} error={!!errors.phone} helperText={errors.phone} margin="dense" inputProps={{ maxLength: 10 }} />
            <TextField fullWidth label="National ID (16 digits)" value={formData.nationalId} onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })} error={!!errors.nationalId} helperText={errors.nationalId} margin="dense" inputProps={{ maxLength: 16 }} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApplyOpen(false)}>Cancel</Button>
          <Button onClick={handleApply} variant="contained">Submit Application</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClientView;
