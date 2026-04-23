import { useState } from 'react';
import { Box, Typography, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Paper, Chip, Avatar, Divider, Grid, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Add, Delete, Visibility, Edit } from '@mui/icons-material';
import { useApp } from '../context/AppContext';

const Clients = () => {
  const { clients, addClient, deleteClient, updateClient } = useApp();
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', nationalId: '' });

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

  const handleSubmit = () => {
    if (validateForm()) {
      if (editId) {
        updateClient(editId, formData);
        setEditOpen(false);
        setEditId(null);
      } else {
        addClient(formData);
      }
      handleClose();
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditOpen(false);
    setEditId(null);
    setFormData({ name: '', email: '', phone: '', nationalId: '' });
    setErrors({});
  };

  const handleEdit = (client) => {
    setEditId(client.id);
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      nationalId: client.nationalId
    });
    setEditOpen(true);
  };

  const columns = [
    { 
      field: 'id', 
      headerName: 'ID', 
      width: 80,
      renderCell: (params) => (
        <Chip label={`#${params.value}`} size="small" color="primary" variant="outlined" />
      )
    },
    { 
      field: 'name', 
      headerName: 'Client Name', 
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ width: 32, height: 32, fontSize: 14, bgcolor: 'primary.main' }}>
            {params.value.split(' ').map(n => n[0]).join('').substring(0, 2)}
          </Avatar>
          <Typography variant="body2" fontWeight={500}>{params.value}</Typography>
        </Box>
      )
    },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'phone', headerName: 'Phone', width: 130 },
    { field: 'nationalId', headerName: 'National ID', width: 130 },
    { field: 'createdAt', headerName: 'Registered', width: 120 },
    { 
      field: 'policies', 
      headerName: 'Insurance Policies', 
      width: 180,
      renderCell: (params) => {
        const clientPolicies = params.value || [];
        if (clientPolicies.length === 0) {
          return <Typography variant="body2" color="text.secondary">No policies</Typography>;
        }
        return (
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {clientPolicies.slice(0, 3).map((policy, idx) => (
              <Tooltip key={idx} title={`${policy.policyName}`}>
                <Chip label={policy.type} size="small" variant="outlined" />
              </Tooltip>
            ))}
            {clientPolicies.length > 3 && <Chip label={`+${clientPolicies.length - 3}`} size="small" variant="outlined" />}
          </Box>
        );
      }
    },
    {
      field: 'actions', 
      headerName: 'Actions', 
      width: 200, 
      renderCell: (params) => (
        <Box className="action-buttons">
          <IconButton size="small" onClick={() => { setSelectedClient(params.row); setViewOpen(true); }} title="View">
            <Visibility />
          </IconButton>
          <IconButton size="small" color="primary" onClick={() => handleEdit(params.row)} title="Edit">
            <Edit />
          </IconButton>
          <IconButton size="small" color="error" onClick={() => { setDeleteId(params.row.id); setDeleteOpen(true); }} title="Delete">
            <Delete />
          </IconButton>
        </Box>
      )
    }
  ];

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box className="page-container">
      <Typography variant="h4" className="page-title">Clients Management</Typography>
      
      <Box className="filter-bar">
        <TextField label="Search clients..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} size="small" sx={{ minWidth: 250 }} />
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>Add Client</Button>
      </Box>

      <Paper sx={{ height: 500, width: '100%' }}>
        <DataGrid rows={filteredClients} columns={columns} pageSize={5} rowsPerPageOptions={[5, 10, 20]} checkboxSelection disableRowSelectionOnClick />
      </Paper>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Client</DialogTitle>
        <DialogContent>
          <Box className="form-container" sx={{ mt: 2 }}>
            <TextField fullWidth label="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} error={!!errors.name} helperText={errors.name} margin="dense" />
            <TextField fullWidth label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} error={!!errors.email} helperText={errors.email} margin="dense" />
            <TextField fullWidth label="Phone (10 digits)" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} error={!!errors.phone} helperText={errors.phone} margin="dense" inputProps={{ maxLength: 10 }} />
            <TextField fullWidth label="National ID (16 digits)" value={formData.nationalId} onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })} error={!!errors.nationalId} helperText={errors.nationalId} margin="dense" inputProps={{ maxLength: 16 }} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Submit</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={viewOpen} onClose={() => setViewOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Client Details</DialogTitle>
        <DialogContent>
          {selectedClient && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar sx={{ width: 64, height: 64, fontSize: 24, bgcolor: 'primary.main' }}>
                  {selectedClient.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={600}>{selectedClient.name}</Typography>
                  <Chip label={`ID: ${selectedClient.id}`} size="small" color="primary" variant="outlined" />
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                    <Typography variant="body2" color="text.secondary">Email Address</Typography>
                    <Typography variant="body1" fontWeight={500}>{selectedClient.email}</Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Paper sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                    <Typography variant="body2" color="text.secondary">Phone Number</Typography>
                    <Typography variant="body1" fontWeight={500}>{selectedClient.phone}</Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Paper sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                    <Typography variant="body2" color="text.secondary">National ID</Typography>
                    <Typography variant="body1" fontWeight={500}>{selectedClient.nationalId}</Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                    <Typography variant="body2" color="text.secondary">Registration Date</Typography>
                    <Typography variant="body1" fontWeight={500}>{selectedClient.createdAt}</Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Insurance Policies Held
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                      {(selectedClient.policies && selectedClient.policies.length > 0) ? (
                        selectedClient.policies.map((policy, idx) => (
                          <Box key={idx} sx={{ p: 1.5, borderRadius: 2, border: '1px solid', borderColor: 'divider', minWidth: 180 }}>
                            <Typography variant="body2" fontWeight={600}>{policy.policyName}</Typography>
                            <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                              <Chip label={policy.status} size="small" color={policy.status === 'active' ? 'success' : 'warning'} />
                            </Box>
                            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                              Start: {policy.startDate} | End: {policy.endDate}
                            </Typography>
                          </Box>
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary">No policies assigned</Typography>
                      )}
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this client?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button color="error" onClick={() => { deleteClient(deleteId); setDeleteOpen(false); }}>Delete</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Client</DialogTitle>
        <DialogContent>
          <Box className="form-container" sx={{ mt: 2 }}>
            <TextField fullWidth label="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} error={!!errors.name} helperText={errors.name} margin="dense" />
            <TextField fullWidth label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} error={!!errors.email} helperText={errors.email} margin="dense" />
            <TextField fullWidth label="Phone (10 digits)" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} error={!!errors.phone} helperText={errors.phone} margin="dense" inputProps={{ maxLength: 10 }} />
            <TextField fullWidth label="National ID (16 digits)" value={formData.nationalId} onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })} error={!!errors.nationalId} helperText={errors.nationalId} margin="dense" inputProps={{ maxLength: 16 }} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Clients;