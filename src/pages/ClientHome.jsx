import { Box, Typography, Paper, Grid, Card, Button, Chip } from '@mui/material';
import { Policy, Description, Assignment, CheckCircle } from '@mui/icons-material';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const ClientHome = () => {
  const { policies, applications, clients } = useApp();
  const navigate = useNavigate();

  const userEmail = JSON.parse(localStorage.getItem('user') || '{}').email;
  const currentClient = clients.find(c => c.email === userEmail);
  const clientPolicies = currentClient?.policies || [];
  const myApplications = applications.filter(app => app.email === userEmail);
  const pendingPurchases = myApplications.filter(app => app.status === 'pending').length;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Welcome to Insurance Portal</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Manage your insurance policies, view available plans, and track your claims.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ textAlign: 'center', py: 3 }}>
            <Policy sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
            <Typography variant="h4">{policies.length}</Typography>
            <Typography variant="body2" color="text.secondary">Available Plans</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ textAlign: 'center', py: 3 }}>
            <Description sx={{ fontSize: 48, color: 'warning.main', mb: 1 }} />
            <Typography variant="h4">{pendingPurchases}</Typography>
            <Typography variant="body2" color="text.secondary">Pending Purchases</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ textAlign: 'center', py: 3 }}>
            <Assignment sx={{ fontSize: 48, color: 'info.main', mb: 1 }} />
            <Typography variant="h4">{clientPolicies.length}</Typography>
            <Typography variant="body2" color="text.secondary">Confirmed Insurance</Typography>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>Quick Actions</Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button variant="contained" onClick={() => navigate('/client/policies')}>
            Browse Policies
          </Button>
          <Button variant="outlined" onClick={() => navigate('/client/claims')}>
            View My Claims
          </Button>
        </Box>
      </Box>

      <Paper sx={{ mt: 4, p: 3 }}>
        <Typography variant="h6" gutterBottom>My Purchase Requests</Typography>
        {myApplications.length > 0 ? (
          <Grid container spacing={2}>
            {myApplications.map((application) => (
              <Grid item xs={12} sm={6} md={4} key={application.id}>
                <Paper sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                  <Typography variant="subtitle2" fontWeight={600}>{application.policyName}</Typography>
                  <Box sx={{ display: 'flex', gap: 1, my: 1 }}>
                    <Chip label={`${application.premium?.toLocaleString()} RF / month`} size="small" variant="outlined" />
                    <Chip
                      label={application.status}
                      size="small"
                      color={application.status === 'approved' ? 'success' : application.status === 'rejected' ? 'error' : 'warning'}
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Requested start: {application.startDate || '-'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Submitted on: {application.date}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body2" color="text.secondary">
            You have not requested any insurance purchase yet.
          </Typography>
        )}
      </Paper>

      <Paper sx={{ mt: 4, p: 3 }}>
        <Typography variant="h6" gutterBottom>My Insurance Policies</Typography>
        {clientPolicies.length > 0 ? (
          <Grid container spacing={2}>
            {clientPolicies.map((policy, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Paper sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <CheckCircle sx={{ color: 'success.main', fontSize: 18 }} />
                    <Typography variant="subtitle2" fontWeight={600}>{policy.policyName}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <Chip label={policy.type} size="small" variant="outlined" />
                    <Chip label={policy.status} size="small" color={policy.status === 'active' ? 'success' : 'warning'} />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Start: {policy.startDate} | End: {policy.endDate}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No insurance has been confirmed yet. Once the admin approves your purchase request, it will appear here.
          </Typography>
        )}
        <Button variant="outlined" size="small" sx={{ mt: 2 }} onClick={() => navigate('/client/policies')}>
          Buy Insurance
        </Button>
      </Paper>

      <Paper sx={{ mt: 4, p: 3 }}>
        <Typography variant="h6" gutterBottom>About This Portal</Typography>
        <Typography variant="body2" color="text.secondary">
          This insurance management system allows you to browse and apply for health, auto, home, and Mutuelle de Sante insurance. You can also submit and track your claims online.
        </Typography>
      </Paper>
    </Box>
  );
};

export default ClientHome;
