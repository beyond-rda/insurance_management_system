import { useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { Add } from '@mui/icons-material';
import { useApp } from '../context/AppContext';

const COLORS = ['#1976d2', '#ed6c02', '#9c27b0', '#2e7d32'];

const Reports = () => {
  const { policies, claims, payments } = useApp();
  const [open, setOpen] = useState(false);
  const [customRiskRows, setCustomRiskRows] = useState([
    { category: 'Health', risk: 35 },
    { category: 'Auto', risk: 48 },
    { category: 'Home', risk: 26 },
  ]);
  const [formData, setFormData] = useState({ category: 'Health', risk: '' });
  const [errors, setErrors] = useState({});

  const policyChartData = useMemo(() => {
    const distribution = policies.reduce((acc, policy) => {
      acc[policy.type] = (acc[policy.type] || 0) + 1;
      return acc;
    }, {});

    const labels = { health: 'Health', auto: 'Auto', home: 'Home', mutuelle: 'Mutuelle' };
    return Object.entries(distribution).map(([name, value]) => ({ name: labels[name] || name, value }));
  }, [policies]);

  const claimsChartData = useMemo(() => {
    const claimsByStatus = claims.reduce((acc, claim) => {
      acc[claim.status] = (acc[claim.status] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(claimsByStatus).map(([name, value]) => ({ name, value }));
  }, [claims]);

  const monthlyPayments = useMemo(() => {
    const monthMap = payments.reduce((acc, payment) => {
      const month = new Date(payment.date).toLocaleString('en-US', { month: 'short' });
      acc[month] = (acc[month] || 0) + payment.amount;
      return acc;
    }, {});

    return Object.entries(monthMap).map(([month, amount]) => ({ month, amount }));
  }, [payments]);

  const claimAmounts = claims.map((claim) => ({
    policy: claim.policyName.substring(0, 15),
    amount: claim.amount,
  }));

  const branchPerformance = [
    { branch: 'Kigali', sales: 18, claims: 6 },
    { branch: 'Musanze', sales: 10, claims: 3 },
    { branch: 'Huye', sales: 8, claims: 2 },
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.risk || Number.isNaN(Number(formData.risk)) || Number(formData.risk) < 0) {
      newErrors.risk = 'Enter a valid risk score';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddRisk = () => {
    if (!validateForm()) return;
    setCustomRiskRows([
      ...customRiskRows.filter((row) => row.category !== formData.category),
      { category: formData.category, risk: Number(formData.risk) },
    ]);
    setOpen(false);
    setFormData({ category: 'Health', risk: '' });
    setErrors({});
  };

  return (
    <Box className="page-container">
      <Typography variant="h4" className="page-title">
        Analytics & Reports
      </Typography>

      <Box className="filter-bar">
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>
          Add Risk Snapshot
        </Button>
      </Box>

      <Box className="analytics-grid">
        <Paper className="chart-container">
          <Typography variant="h6" gutterBottom>
            Policy Distribution by Type
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={policyChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                dataKey="value"
              >
                {policyChartData.map((entry, index) => (
                  <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Paper>

        <Paper className="chart-container">
          <Typography variant="h6" gutterBottom>
            Claims Status Overview
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={claimsChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#1976d2" name="Claims Count" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>

        <Paper className="chart-container">
          <Typography variant="h6" gutterBottom>
            Premium Income Trend
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyPayments}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="amount" stroke="#1976d2" name="Premium Income (RF)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Paper>

        <Paper className="chart-container">
          <Typography variant="h6" gutterBottom>
            Claim Amounts by Policy
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={claimAmounts} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="policy" width={110} />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#ed6c02" name="Claim Amount (RF)" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>

        <Paper className="chart-container">
          <Typography variant="h6" gutterBottom>
            Branch Performance
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={branchPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="branch" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#2e7d32" name="Policy Sales" />
              <Bar dataKey="claims" fill="#9c27b0" name="Claims Received" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>

        <Paper className="chart-container">
          <Typography variant="h6" gutterBottom>
            Risk Levels Across Categories
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={customRiskRows}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="risk" fill="#ed6c02" name="Risk Score" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Risk Snapshot</DialogTitle>
        <DialogContent>
          <Box className="form-container" sx={{ mt: 2 }}>
            <FormControl fullWidth margin="dense" error={!!errors.category}>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                label="Category"
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <MenuItem value="Health">Health</MenuItem>
                <MenuItem value="Auto">Auto</MenuItem>
                <MenuItem value="Home">Home</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Risk Score"
              type="number"
              margin="dense"
              value={formData.risk}
              onChange={(e) => setFormData({ ...formData, risk: e.target.value })}
              error={!!errors.risk}
              helperText={errors.risk}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
              setFormData({ category: 'Health', risk: '' });
              setErrors({});
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleAddRisk} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Reports;
