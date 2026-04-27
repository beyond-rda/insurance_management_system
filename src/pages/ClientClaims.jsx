import { useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem, IconButton } from '@mui/material';
import { Add, Visibility, CloudUpload } from '@mui/icons-material';
import { useApp } from '../context/AppContext';

const ClientClaims = () => {
  const { claims, policies, addClaim } = useApp();
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
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
      addClaim({
        policyId: formData.policyId,
        policyName: policy?.name || '',
        clientName: 'Current User',
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

  const getStatusColor = (status) => {
    const colors = { pending: 'warning', approved: 'success', rejected: 'error' };
    return colors[status] || 'default';
  };

  const filteredClaims = claims.filter(c =>
    c.policyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">My Claims</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>
          Submit Claim
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          label="Search claims..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          sx={{ minWidth: 100, borderRadius: 2 }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Policy</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredClaims.map(claim => (
              <TableRow key={claim.id}>
                <TableCell>{claim.id}</TableCell>
                <TableCell>{claim.policyName}</TableCell>
                <TableCell>{claim.description.substring(0, 50)}...</TableCell>
                <TableCell>{claim.amount.toLocaleString()} RF</TableCell>
                <TableCell>{claim.date}</TableCell>
                <TableCell>
                  <Chip label={claim.status} color={getStatusColor(claim.status)} size="small" />
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => { setSelectedClaim(claim); setViewOpen(true); }}>
                    <Visibility />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filteredClaims.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">No claims found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Submit New Claim</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth margin="dense" error={!!errors.policyId}>
              <InputLabel>Select Policy</InputLabel>
              <Select
                value={formData.policyId}
                onChange={(e) => setFormData({ ...formData, policyId: e.target.value })}
                label="Select Policy"
              >
                {policies.map(p => (
                  <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              error={!!errors.description}
              helperText={errors.description}
              margin="dense"
            />
            <TextField
              fullWidth
              label="Claim Amount ($)"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              error={!!errors.amount}
              helperText={errors.amount}
              margin="dense"
            />
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
              <Typography variant="body1"><strong>Description:</strong> {selectedClaim.description}</Typography>
              <Typography variant="body1"><strong>Amount:</strong> ${selectedClaim.amount.toLocaleString()}</Typography>
              <Typography variant="body1"><strong>Date:</strong> {selectedClaim.date}</Typography>
              <Typography variant="body1">
                <strong>Status:</strong> <Chip label={selectedClaim.status} color={getStatusColor(selectedClaim.status)} size="small" />
              </Typography>
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

export default ClientClaims;