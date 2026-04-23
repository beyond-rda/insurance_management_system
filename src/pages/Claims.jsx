import { useState } from 'react';
import { Box, Typography, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem, IconButton, Paper, Chip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Add, Visibility, Check, Close, CloudUpload } from '@mui/icons-material';
import { useApp } from '../context/AppContext';

const Claims = () => {
  const { claims, policies, clients, addClaim, updateClaimStatus } = useApp();
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({ policyId: '', description: '', amount: '', documents: null, documentsPreview: null });

  const validateForm = () => {
    const newErrors = {};
    if (!formData.policyId) newErrors.policyId = 'Policy is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.amount || isNaN(formData.amount) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Valid amount is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const policy = policies.find(p => p.id === formData.policyId);
      const client = clients[0];
      addClaim({
        policyId: formData.policyId,
        policyName: policy?.name || '',
        clientName: client?.name || '',
        description: formData.description,
        amount: Number(formData.amount),
        documents: formData.documents
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({ policyId: '', description: '', amount: '', documents: null, documentsPreview: null });
    setErrors({});
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, file: 'File size must be less than 5MB' });
        return;
      }
      if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
        setErrors({ ...errors, file: 'Only PDF, JPG, and PNG files are allowed' });
        return;
      }
      setFormData({ ...formData, documents: file, documentsPreview: URL.createObjectURL(file) });
      setErrors({ ...errors, file: null });
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'policyName', headerName: 'Policy', flex: 1 },
    { field: 'clientName', headerName: 'Client', width: 150 },
    { field: 'description', headerName: 'Description', flex: 1 },
    { field: 'amount', headerName: 'Amount (RF)', width: 140, renderCell: (params) => `${params.value.toLocaleString()} RF` },
    { field: 'date', headerName: 'Date', width: 100 },
    { field: 'status', headerName: 'Status', width: 120, renderCell: (params) => (
      <Chip 
        label={params.value} 
        color={params.value === 'approved' ? 'success' : params.value === 'rejected' ? 'error' : 'warning'}
        size="small"
      />
    )},
    {
      field: 'actions', headerName: 'Actions', width: 200, renderCell: (params) => (
        <Box className="action-buttons">
          <IconButton size="small" onClick={() => { setSelectedClaim(params.row); setViewOpen(true); }}>
            <Visibility />
          </IconButton>
          {params.row.status === 'pending' && (
            <>
              <IconButton size="small" color="success" onClick={() => updateClaimStatus(params.row.id, 'approved')}>
                <Check />
              </IconButton>
              <IconButton size="small" color="error" onClick={() => updateClaimStatus(params.row.id, 'rejected')}>
                <Close />
              </IconButton>
            </>
          )}
        </Box>
      )
    }
  ];

  const filteredClaims = claims.filter(c => {
    const matchesSearch = c.policyName.toLowerCase().includes(searchTerm.toLowerCase()) || c.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Box className="page-container">
      <Typography variant="h4" className="page-title">Claims Management</Typography>
      
      <Box className="filter-bar">
        <TextField label="Search claims..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} size="small" sx={{ minWidth: 250 }} />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Filter by Status</InputLabel>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Filter by Status">
            <MenuItem value="">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>Add Claim</Button>
      </Box>

      <Paper sx={{ height: 500, width: '100%' }}>
        <DataGrid rows={filteredClaims} columns={columns} pageSize={5} rowsPerPageOptions={[5, 10, 20]} checkboxSelection disableRowSelectionOnClick />
      </Paper>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Submit New Claim</DialogTitle>
        <DialogContent>
          <Box className="form-container" sx={{ mt: 2 }}>
            <FormControl fullWidth margin="dense" error={!!errors.policyId}>
              <InputLabel>Select Policy</InputLabel>
              <Select value={formData.policyId} onChange={(e) => setFormData({ ...formData, policyId: e.target.value })} label="Select Policy">
                {policies.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField fullWidth label="Description" multiline rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} error={!!errors.description} helperText={errors.description} margin="dense" />
            <TextField fullWidth label="Claim Amount (RF)" type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} error={!!errors.amount} helperText={errors.amount} margin="dense" />
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" gutterBottom>Upload Supporting Documents (PDF/Image, max 5MB)</Typography>
              <label className="file-upload-area">
                <input type="file" accept=".pdf,image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                <CloudUpload sx={{ fontSize: 40, color: 'grey.500' }} />
                <Typography variant="body2">Click to upload documents</Typography>
              </label>
              {formData.documentsPreview && (
                <Box sx={{ mt: 2 }}>
                  <img src={formData.documentsPreview} alt="Preview" className="file-preview" style={{ maxHeight: 150 }} />
                  <Typography variant="body2" sx={{ mt: 1 }}>{formData.documents.name}</Typography>
                </Box>
              )}
              {errors.file && <Typography color="error" variant="body2">{errors.file}</Typography>}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Submit</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={viewOpen} onClose={() => setViewOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Claim Details</DialogTitle>
        <DialogContent>
          {selectedClaim && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6">{selectedClaim.policyName}</Typography>
              <Typography variant="body1"><strong>Client:</strong> {selectedClaim.clientName}</Typography>
              <Typography variant="body1"><strong>Description:</strong> {selectedClaim.description}</Typography>
              <Typography variant="body1"><strong>Amount:</strong> {selectedClaim.amount.toLocaleString()} RF</Typography>
              <Typography variant="body1"><strong>Date:</strong> {selectedClaim.date}</Typography>
              <Typography variant="body1"><strong>Status:</strong> <Chip label={selectedClaim.status} color={selectedClaim.status === 'approved' ? 'success' : selectedClaim.status === 'rejected' ? 'error' : 'warning'} size="small" /></Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Claims;