import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Paper,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Add } from '@mui/icons-material';
import { useApp } from '../context/AppContext';

const emptyForm = {
  clientName: '',
  policyName: '',
  amount: '',
  date: '',
  status: 'pending',
};

const Payments = () => {
  const { payments, clients, policies, addPayment } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(emptyForm);

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'clientName', headerName: 'Client', flex: 1 },
    { field: 'policyName', headerName: 'Policy', flex: 1 },
    {
      field: 'amount',
      headerName: 'Amount (RF)',
      width: 160,
      renderCell: (params) => `${params.value.toLocaleString()} RF`,
    },
    { field: 'date', headerName: 'Date', width: 130 },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === 'completed' ? 'success' : 'warning'}
          size="small"
        />
      ),
    },
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.clientName) newErrors.clientName = 'Client is required';
    if (!formData.policyName) newErrors.policyName = 'Policy is required';
    if (!formData.amount || Number.isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Enter a valid payment amount';
    }
    if (!formData.date) newErrors.date = 'Payment date is required';
    if (!formData.status) newErrors.status = 'Status is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    addPayment(formData);
    setOpen(false);
    setFormData(emptyForm);
    setErrors({});
  };

  const filteredPayments = payments.filter(
    (payment) =>
      payment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.policyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCompleted = payments
    .filter((payment) => payment.status === 'completed')
    .reduce((sum, payment) => sum + payment.amount, 0);
  const totalPending = payments
    .filter((payment) => payment.status === 'pending')
    .reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <Box className="page-container">
      <Typography variant="h4" className="page-title">
        Payments Management
      </Typography>

      <Box className="card-grid">
        <Paper className="stat-card">
          <Typography variant="h6" color="success.main">
            Completed Payments
          </Typography>
          <Typography variant="h4">{totalCompleted.toLocaleString()} RF</Typography>
        </Paper>
        <Paper className="stat-card">
          <Typography variant="h6" color="warning.main">
            Pending Payments
          </Typography>
          <Typography variant="h4">{totalPending.toLocaleString()} RF</Typography>
        </Paper>
      </Box>

      <Box className="filter-bar">
        <TextField
          label="Search payments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          sx={{ minWidth: 250 }}
        />
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>
          Add Payment
        </Button>
      </Box>

      <Paper sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={filteredPayments}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Payment</DialogTitle>
        <DialogContent>
          <Box className="form-container" sx={{ mt: 2 }}>
            <FormControl fullWidth margin="dense" error={!!errors.clientName}>
              <InputLabel>Client</InputLabel>
              <Select
                value={formData.clientName}
                label="Client"
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              >
                {clients.map((client) => (
                  <MenuItem key={client.id} value={client.name}>
                    {client.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense" error={!!errors.policyName}>
              <InputLabel>Policy</InputLabel>
              <Select
                value={formData.policyName}
                label="Policy"
                onChange={(e) => setFormData({ ...formData, policyName: e.target.value })}
              >
                {policies.map((policy) => (
                  <MenuItem key={policy.id} value={policy.name}>
                    {policy.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Amount (RF)"
              type="number"
              margin="dense"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              error={!!errors.amount}
              helperText={errors.amount}
            />
            <TextField
              fullWidth
              label="Payment Date"
              type="date"
              margin="dense"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              error={!!errors.date}
              helperText={errors.date}
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth margin="dense" error={!!errors.status}>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
              setFormData(emptyForm);
              setErrors({});
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained">
            Save Payment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Payments;
