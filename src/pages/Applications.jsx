import { useState } from 'react';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, Paper, Chip, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Check, Close, Visibility } from '@mui/icons-material';
import { useApp } from '../context/AppContext';

const Applications = () => {
  const { applications, clients, approveApplication, rejectApplication } = useApp();
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  const handleApprove = (application) => {
    const client = clients.find((c) => c.email === application?.email);
    approveApplication(application.id, client?.id);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Applicant', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'policyName', headerName: 'Requested Policy', flex: 1 },
    {
      field: 'status',
      headerName: 'Purchase Status',
      width: 160,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color={params.value === 'approved' ? 'success' : params.value === 'rejected' ? 'error' : 'warning'}
        />
      ),
    },
    { field: 'date', headerName: 'Request Date', width: 130 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 220,
      renderCell: (params) => (
        <Box className="action-buttons">
          <IconButton size="small" onClick={() => { setSelectedApp(params.row); setViewOpen(true); }}>
            <Visibility />
          </IconButton>
          {params.row.status === 'pending' && (
            <>
              <IconButton size="small" color="success" onClick={() => handleApprove(params.row)}>
                <Check />
              </IconButton>
              <IconButton size="small" color="error" onClick={() => rejectApplication(params.row.id)}>
                <Close />
              </IconButton>
            </>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Box className="page-container">
      <Typography variant="h4" className="page-title">Insurance Purchase Requests</Typography>

      <Paper sx={{ height: 500, width: '100%' }}>
        <DataGrid rows={applications} columns={columns} pageSize={5} rowsPerPageOptions={[5, 10, 20]} checkboxSelection disableRowSelectionOnClick />
      </Paper>

      <Dialog open={viewOpen} onClose={() => setViewOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Purchase Request Details</DialogTitle>
        <DialogContent>
          {selectedApp && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1"><strong>Client Name:</strong> {selectedApp.name}</Typography>
              <Typography variant="body1"><strong>Email:</strong> {selectedApp.email}</Typography>
              <Typography variant="body1"><strong>Requested Policy:</strong> {selectedApp.policyName}</Typography>
              <Typography variant="body1"><strong>Monthly Premium:</strong> {selectedApp.premium?.toLocaleString()} RF</Typography>
              {selectedApp.startDate && <Typography variant="body1"><strong>Requested Start Date:</strong> {selectedApp.startDate}</Typography>}
              {selectedApp.policyName === 'Health Insurance' && (
                <>
                  {selectedApp.planType && <Typography variant="body1"><strong>Plan Type:</strong> {selectedApp.planType}</Typography>}
                </>
              )}
              {selectedApp.policyName === 'Auto Insurance' && (
                <>
                  <Typography variant="body1"><strong>Car Brand & Model:</strong> {selectedApp.carBrand}</Typography>
                  <Typography variant="body1"><strong>Coverage Type:</strong> {selectedApp.coverageType}</Typography>
                </>
              )}
              {selectedApp.policyName === 'Home Insurance' && (
                <>
                  <Typography variant="body1"><strong>National ID:</strong> {selectedApp.nationalId}</Typography>
                  <Typography variant="body1"><strong>Location:</strong> {selectedApp.propertyLocation || selectedApp.propertyAddress}</Typography>
                  <Typography variant="body1"><strong>UPI:</strong> {selectedApp.propertyUpi}</Typography>
                </>
              )}
              {selectedApp.policyName === 'Mutuelle de Sante' && (
                <>
                  <Typography variant="body1"><strong>National ID:</strong> {selectedApp.nationalId}</Typography>
                  <Typography variant="body1"><strong>Household Size:</strong> {selectedApp.householdSize}</Typography>
                  <Typography variant="body1"><strong>Total Amount to Pay:</strong> {selectedApp.totalPremiumAmount?.toLocaleString()} RF</Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}><strong>Assigned Members:</strong></Typography>
                  {(selectedApp.householdMembers || []).map((member, index) => (
                    <Typography key={`${member.name}-${index}`} variant="body2">
                      {index + 1}. {member.name} - {member.relationship}
                    </Typography>
                  ))}
                </>
              )}
              <Typography variant="body1"><strong>Request Date:</strong> {selectedApp.date}</Typography>
              <Typography variant="body1"><strong>Status:</strong> {selectedApp.status}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewOpen(false)}>Close</Button>
          {selectedApp?.status === 'pending' && (
            <>
              <Button color="error" onClick={() => { rejectApplication(selectedApp.id); setViewOpen(false); }}>
                Reject
              </Button>
              <Button variant="contained" onClick={() => { handleApprove(selectedApp); setViewOpen(false); }}>
                Approve Purchase
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Applications;
