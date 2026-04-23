import { Box, Paper, Typography } from '@mui/material';
import { Policy, People, Assignment, Payment, HowToReg } from '@mui/icons-material';
import { useApp } from '../context/AppContext';

const StatCard = ({ icon, value, label, color }) => (
  <Paper className="stat-card" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
    <Box sx={{ p: 1.5, borderRadius: '50%', backgroundColor: `${color}20`, color }}>
      {icon}
    </Box>
    <Box>
      <Typography className="stat-value">{value}</Typography>
      <Typography className="stat-label">{label}</Typography>
    </Box>
  </Paper>
);

const Dashboard = () => {
  const { policies, clients, claims, payments, applications } = useApp();

  const totalPremium = policies.reduce((sum, p) => sum + p.premium, 0);
  const pendingClaims = claims.filter(c => c.status === 'pending').length;
  const approvedClaims = claims.filter(c => c.status === 'approved').length;
  const totalPayments = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);

  return (
    <Box className="page-container">
      <Typography variant="h4" className="page-title">Dashboard</Typography>
      
      <Box className="card-grid">
        <StatCard 
          icon={<Policy sx={{ fontSize: 32 }} />} 
          value={policies.length} 
          label="Total Policies" 
          color="#1976d2" 
        />
        <StatCard 
          icon={<People sx={{ fontSize: 32 }} />} 
          value={clients.length} 
          label="Total Clients" 
          color="#2e7d32" 
        />
        <StatCard 
          icon={<HowToReg sx={{ fontSize: 32 }} />} 
          value={applications.length} 
          label="Applications" 
          color="#ed6c02" 
        />
        <StatCard 
          icon={<Assignment sx={{ fontSize: 32 }} />} 
          value={pendingClaims} 
          label="Pending Claims" 
          color="#ed6c02" 
        />
        <StatCard 
          icon={<Payment sx={{ fontSize: 32 }} />} 
          value={`${totalPayments.toLocaleString()} RF`} 
          label="Total Premium Income" 
          color="#9c27b0" 
        />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Claims Overview</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">{pendingClaims}</Typography>
              <Typography variant="body2">Pending</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">{approvedClaims}</Typography>
              <Typography variant="body2">Approved</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="error.main">{claims.filter(c => c.status === 'rejected').length}</Typography>
              <Typography variant="body2">Rejected</Typography>
            </Box>
          </Box>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Policy Distribution</Typography>
          <Box sx={{ mt: 2 }}>
            {['health', 'auto', 'home', 'mutuelle'].map(type => {
              const count = policies.filter(p => p.type === type).length;
              const total = policies.length;
              const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
              const typeLabels = { health: 'Health', auto: 'Auto', home: 'Home', mutuelle: 'Mutuelle' };
              return (
                <Box key={type} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2">{typeLabels[type]}</Typography>
                    <Typography variant="body2">{count} ({percentage}%)</Typography>
                  </Box>
                  <Box sx={{ height: 8, borderRadius: 4, backgroundColor: 'grey[200]' }}>
                    <Box sx={{ height: '100%', width: `${percentage}%`, borderRadius: 4, backgroundColor: type === 'health' ? '#1976d2' : type === 'auto' ? '#ed6c02' : type === 'home' ? '#9c27b0' : '#2e7d32' }} />
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Dashboard;
