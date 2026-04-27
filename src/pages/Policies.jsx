import { useState } from 'react';
import { Box, Typography, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem, IconButton, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Add, Delete, Visibility, CloudUpload, Edit } from '@mui/icons-material';
import { useApp } from '../context/AppContext';

const Policies = () => {
  const { policies, addPolicy, deletePolicy, updatePolicy } = useApp();
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '', type: '', premium: '', duration: '', description: '', brochure: null, brochurePreview: null,
    planType: '', coverageAmount: '', preExistingConditions: '', coverageType: '', propertyType: '', propertyValue: ''
  });

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Policy name is required';
    if (!formData.type) newErrors.type = 'Policy type is required';
    if (!formData.premium || isNaN(formData.premium) || Number(formData.premium) <= 0) {
      newErrors.premium = 'Valid premium amount is required';
    }
    if (!formData.duration || isNaN(formData.duration) || Number(formData.duration) <= 0) {
      newErrors.duration = 'Valid duration is required';
    }
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.type === 'health') {
      if (!formData.planType) newErrors.planType = 'Plan type is required';
      if (!formData.coverageAmount || isNaN(formData.coverageAmount) || Number(formData.coverageAmount) <= 0) {
        newErrors.coverageAmount = 'Valid coverage amount is required';
      }
      if (!formData.preExistingConditions) newErrors.preExistingConditions = 'Pre-existing conditions is required';
    }
    if (formData.type === 'auto') {
      if (!formData.coverageType) newErrors.coverageType = 'Coverage type is required';
    }
    if (formData.type === 'home') {
      if (!formData.propertyType) newErrors.propertyType = 'Property type is required';
      if (!formData.propertyValue || isNaN(formData.propertyValue) || Number(formData.propertyValue) <= 0) {
        newErrors.propertyValue = 'Valid property value is required';
      }
      if (!formData.coverageAmount || isNaN(formData.coverageAmount) || Number(formData.coverageAmount) <= 0) {
        newErrors.coverageAmount = 'Valid coverage amount is required';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const policyData = {
        name: formData.name,
        type: formData.type,
        premium: Number(formData.premium),
        duration: Number(formData.duration),
        description: formData.description,
        brochure: formData.brochure,
        planType: formData.planType,
        coverageAmount: formData.coverageAmount ? Number(formData.coverageAmount) : undefined,
        preExistingConditions: formData.preExistingConditions,
        coverageType: formData.coverageType,
        propertyType: formData.propertyType,
        propertyValue: formData.propertyValue ? Number(formData.propertyValue) : undefined,
      };
      if (editId) {
        updatePolicy(editId, policyData);
        setEditOpen(false);
        setEditId(null);
      } else {
        addPolicy(policyData);
      }
      handleClose();
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditOpen(false);
    setEditId(null);
    setFormData({ name: '', type: '', premium: '', duration: '', description: '', brochure: null, brochurePreview: null,
      planType: '', coverageAmount: '', preExistingConditions: '', coverageType: '', propertyType: '', propertyValue: '' });
    setErrors({});
  };

  const handleEdit = (policy) => {
    setEditId(policy.id);
    setFormData({
      name: policy.name,
      type: policy.type,
      premium: policy.premium.toString(),
      duration: policy.duration.toString(),
      description: policy.description,
      brochure: null,
      brochurePreview: null,
      planType: policy.planType || '',
      coverageAmount: policy.coverageAmount ? policy.coverageAmount.toString() : '',
      preExistingConditions: policy.preExistingConditions || '',
      coverageType: policy.coverageType || '',
      propertyType: policy.propertyType || '',
      propertyValue: policy.propertyValue ? policy.propertyValue.toString() : '',
    });
    setEditOpen(true);
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
      setFormData({ ...formData, brochure: file, brochurePreview: URL.createObjectURL(file) });
      setErrors({ ...errors, file: null });
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Policy Name', flex: 1 },
    { field: 'type', headerName: 'Type', width: 120, renderCell: (params) => (
      <span className={`policy-type-badge type-${params.value}`}>{params.value}</span>
    )},
    { field: 'premium', headerName: 'Premium (RF)', width: 140, renderCell: (params) => `${params.value.toLocaleString()} RF` },
    { field: 'duration', headerName: 'Duration (months)', width: 150 },
    { field: 'status', headerName: 'Status', width: 100, renderCell: (params) => (
      <span className={`status-badge status-${params.value}`}>{params.value}</span>
    )},
    {
      field: 'actions', headerName: 'Actions', width: 200, renderCell: (params) => (
        <Box className="action-buttons">
          <IconButton size="small" onClick={() => { setSelectedPolicy(params.row); setViewOpen(true); }}>
            <Visibility />
          </IconButton>
          <IconButton size="small" color="primary" onClick={() => handleEdit(params.row)}>
            <Edit />
          </IconButton>
          <IconButton size="small" color="error" onClick={() => { setDeleteId(params.row.id); setDeleteOpen(true); }}>
            <Delete />
          </IconButton>
        </Box>
      )
    }
  ];

  const filteredPolicies = policies.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !typeFilter || p.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <Box className="page-container">
      <Typography variant="h4" className="page-title">Policies Management</Typography>
      
      <Box className="filter-bar">
        <TextField label="Search policies..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} size="small" sx={{ minWidth: 250 }} />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Filter by Type</InputLabel>
          <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} label="Filter by Type">
            <MenuItem value="">All</MenuItem>
            <MenuItem value="health">Health</MenuItem>
            <MenuItem value="auto">Auto</MenuItem>
            <MenuItem value="home">Home</MenuItem>
            <MenuItem value="mutuelle">Mutuelle de Sante</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>Add Policy</Button>
      </Box>

      <Paper sx={{ height: 500, width: '100%' }}>
        <DataGrid rows={filteredPolicies} columns={columns} pageSize={5} rowsPerPageOptions={[5, 10, 20]} checkboxSelection disableRowSelectionOnClick />
      </Paper>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Policy</DialogTitle>
        <DialogContent>
          <Box className="form-container" sx={{ mt: 2 }}>
            <TextField fullWidth label="Policy Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} error={!!errors.name} helperText={errors.name} margin="dense" />
            <FormControl fullWidth margin="dense" error={!!errors.type}>
              <InputLabel>Policy Type</InputLabel>
              <Select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} label="Policy Type">
                <MenuItem value="health">Health</MenuItem>
                <MenuItem value="auto">Auto</MenuItem>
                <MenuItem value="home">Home</MenuItem>
                <MenuItem value="mutuelle">Mutuelle de Sante</MenuItem>
              </Select>
            </FormControl>
            {formData.type === 'health' && (
              <>
                <FormControl fullWidth margin="dense" error={!!errors.planType}>
                  <InputLabel>Plan Type</InputLabel>
                  <Select value={formData.planType} onChange={(e) => setFormData({ ...formData, planType: e.target.value })} label="Plan Type">
                    <MenuItem value="Basic">Basic</MenuItem>
                    <MenuItem value="Standard">Standard</MenuItem>
                    <MenuItem value="Premium">Premium</MenuItem>
                  </Select>
                </FormControl>
                <TextField fullWidth label="Coverage Amount (RF)" type="number" value={formData.coverageAmount} onChange={(e) => setFormData({ ...formData, coverageAmount: e.target.value })} error={!!errors.coverageAmount} helperText={errors.coverageAmount} margin="dense" />
                <FormControl fullWidth margin="dense" error={!!errors.preExistingConditions}>
                  <InputLabel>Pre-existing Conditions</InputLabel>
                  <Select value={formData.preExistingConditions} onChange={(e) => setFormData({ ...formData, preExistingConditions: e.target.value })} label="Pre-existing Conditions">
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}
            {formData.type === 'auto' && (
              <FormControl fullWidth margin="dense" error={!!errors.coverageType}>
                <InputLabel>Coverage Type</InputLabel>
                <Select value={formData.coverageType} onChange={(e) => setFormData({ ...formData, coverageType: e.target.value })} label="Coverage Type">
                  <MenuItem value="Third Party">Third Party</MenuItem>
                  <MenuItem value="Comprehensive">Comprehensive</MenuItem>
                </Select>
              </FormControl>
            )}
            {formData.type === 'home' && (
              <>
                <FormControl fullWidth margin="dense" error={!!errors.propertyType}>
                  <InputLabel>Property Type</InputLabel>
                  <Select value={formData.propertyType} onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })} label="Property Type">
                    <MenuItem value="Apartment">Apartment</MenuItem>
                    <MenuItem value="House">House</MenuItem>
                  </Select>
                </FormControl>
                <TextField fullWidth label="Property Value (RF)" type="number" value={formData.propertyValue} onChange={(e) => setFormData({ ...formData, propertyValue: e.target.value })} error={!!errors.propertyValue} helperText={errors.propertyValue} margin="dense" />
                <TextField fullWidth label="Coverage Amount (RF)" type="number" value={formData.coverageAmount} onChange={(e) => setFormData({ ...formData, coverageAmount: e.target.value })} error={!!errors.coverageAmount} helperText={errors.coverageAmount} margin="dense" />
              </>
            )}
            <TextField fullWidth label="Premium (RF)" type="number" value={formData.premium} onChange={(e) => setFormData({ ...formData, premium: e.target.value })} error={!!errors.premium} helperText={errors.premium} margin="dense" />
            <TextField fullWidth label="Duration (months)" type="number" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} error={!!errors.duration} helperText={errors.duration} margin="dense" />
            <TextField fullWidth label="Description" multiline rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} error={!!errors.description} helperText={errors.description} margin="dense" />
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" gutterBottom>Upload Brochure (PDF/Image, max 5MB)</Typography>
              <label className="file-upload-area">
                <input type="file" accept=".pdf,image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                <CloudUpload sx={{ fontSize: 40, color: 'grey.500' }} />
                <Typography variant="body2">Click to upload brochure</Typography>
              </label>
              {formData.brochurePreview && (
                <Box sx={{ mt: 2 }}>
                  <img src={formData.brochurePreview} alt="Preview" className="file-preview" style={{ maxHeight: 150 }} />
                  <Typography variant="body2" sx={{ mt: 1 }}>{formData.brochure.name}</Typography>
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
        <DialogTitle>Policy Details</DialogTitle>
        <DialogContent>
          {selectedPolicy && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6">{selectedPolicy.name}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Type: {selectedPolicy.type}</Typography>
              <Typography variant="body1"><strong>Premium:</strong> {selectedPolicy.premium.toLocaleString()} RF/year</Typography>
              <Typography variant="body1"><strong>Duration:</strong> {selectedPolicy.duration} months</Typography>
              {selectedPolicy.planType && <Typography variant="body1"><strong>Plan Type:</strong> {selectedPolicy.planType}</Typography>}
              {selectedPolicy.coverageAmount && <Typography variant="body1"><strong>Coverage Amount:</strong> {selectedPolicy.coverageAmount.toLocaleString()} RF</Typography>}
              {selectedPolicy.preExistingConditions && <Typography variant="body1"><strong>Pre-existing Conditions:</strong> {selectedPolicy.preExistingConditions}</Typography>}
              {selectedPolicy.coverageType && <Typography variant="body1"><strong>Coverage Type:</strong> {selectedPolicy.coverageType}</Typography>}
              {selectedPolicy.propertyType && <Typography variant="body1"><strong>Property Type:</strong> {selectedPolicy.propertyType}</Typography>}
              {selectedPolicy.propertyValue && <Typography variant="body1"><strong>Property Value:</strong> {selectedPolicy.propertyValue.toLocaleString()} RF</Typography>}
              <Typography variant="body1"><strong>Description:</strong> {selectedPolicy.description}</Typography>
              <Typography variant="body1"><strong>Status:</strong> <span className={`status-badge status-${selectedPolicy.status}`}>{selectedPolicy.status}</span></Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Policy</DialogTitle>
        <DialogContent>
          <Box className="form-container" sx={{ mt: 2 }}>
            <TextField fullWidth label="Policy Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} error={!!errors.name} helperText={errors.name} margin="dense" />
            <FormControl fullWidth margin="dense" error={!!errors.type}>
              <InputLabel>Policy Type</InputLabel>
              <Select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} label="Policy Type">
                <MenuItem value="health">Health</MenuItem>
                <MenuItem value="auto">Auto</MenuItem>
                <MenuItem value="home">Home</MenuItem>
                <MenuItem value="mutuelle">Mutuelle de Sante</MenuItem>
              </Select>
            </FormControl>
            {formData.type === 'health' && (
              <>
                <FormControl fullWidth margin="dense" error={!!errors.planType}>
                  <InputLabel>Plan Type</InputLabel>
                  <Select value={formData.planType} onChange={(e) => setFormData({ ...formData, planType: e.target.value })} label="Plan Type">
                    <MenuItem value="Basic">Basic</MenuItem>
                    <MenuItem value="Standard">Standard</MenuItem>
                    <MenuItem value="Premium">Premium</MenuItem>
                  </Select>
                </FormControl>
                <TextField fullWidth label="Coverage Amount (RF)" type="number" value={formData.coverageAmount} onChange={(e) => setFormData({ ...formData, coverageAmount: e.target.value })} error={!!errors.coverageAmount} helperText={errors.coverageAmount} margin="dense" />
                <FormControl fullWidth margin="dense" error={!!errors.preExistingConditions}>
                  <InputLabel>Pre-existing Conditions</InputLabel>
                  <Select value={formData.preExistingConditions} onChange={(e) => setFormData({ ...formData, preExistingConditions: e.target.value })} label="Pre-existing Conditions">
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}
            {formData.type === 'auto' && (
              <FormControl fullWidth margin="dense" error={!!errors.coverageType}>
                <InputLabel>Coverage Type</InputLabel>
                <Select value={formData.coverageType} onChange={(e) => setFormData({ ...formData, coverageType: e.target.value })} label="Coverage Type">
                  <MenuItem value="Third Party">Third Party</MenuItem>
                  <MenuItem value="Comprehensive">Comprehensive</MenuItem>
                </Select>
              </FormControl>
            )}
            {formData.type === 'home' && (
              <>
                <FormControl fullWidth margin="dense" error={!!errors.propertyType}>
                  <InputLabel>Property Type</InputLabel>
                  <Select value={formData.propertyType} onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })} label="Property Type">
                    <MenuItem value="Apartment">Apartment</MenuItem>
                    <MenuItem value="House">House</MenuItem>
                  </Select>
                </FormControl>
                <TextField fullWidth label="Property Value (RF)" type="number" value={formData.propertyValue} onChange={(e) => setFormData({ ...formData, propertyValue: e.target.value })} error={!!errors.propertyValue} helperText={errors.propertyValue} margin="dense" />
                <TextField fullWidth label="Coverage Amount (RF)" type="number" value={formData.coverageAmount} onChange={(e) => setFormData({ ...formData, coverageAmount: e.target.value })} error={!!errors.coverageAmount} helperText={errors.coverageAmount} margin="dense" />
              </>
            )}
            <TextField fullWidth label="Premium (RF)" type="number" value={formData.premium} onChange={(e) => setFormData({ ...formData, premium: e.target.value })} error={!!errors.premium} helperText={errors.premium} margin="dense" />
            <TextField fullWidth label="Duration (months)" type="number" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} error={!!errors.duration} helperText={errors.duration} margin="dense" />
            <TextField fullWidth label="Description" multiline rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} error={!!errors.description} helperText={errors.description} margin="dense" />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this policy?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button color="error" onClick={() => { deletePolicy(deleteId); setDeleteOpen(false); }}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Policies;
