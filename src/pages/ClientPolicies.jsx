import { useMemo, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
} from '@mui/material';
import { Visibility, HealthAndSafety, DirectionsCar, HomeWork, CheckCircle, MedicalServices } from '@mui/icons-material';
import { useApp } from '../context/AppContext';

const typeConfig = {
  health: { icon: <HealthAndSafety />, bg: '#e3f2fd', text: '#1565c0', label: 'Health Insurance' },
  auto: { icon: <DirectionsCar />, bg: '#fff3e0', text: '#e65100', label: 'Auto Insurance' },
  home: { icon: <HomeWork />, bg: '#f3e5f5', text: '#7b1fa2', label: 'Home Insurance' },
  mutuelle: { icon: <MedicalServices />, bg: '#e8f5e9', text: '#2e7d32', label: 'Mutuelle de Sante' },
};

const healthPlanConfig = {
  Basic: {
    premium: 35000,
    details: ['Outpatient consultation', 'Basic laboratory tests', 'Essential medicines'],
  },
  Standard: {
    premium: 55000,
    details: ['Everything in Basic', 'Hospital admission cover', 'Specialist consultation'],
  },
  Premium: {
    premium: 85000,
    details: ['Everything in Standard', 'Surgery support', 'Advanced diagnostics and maternity care'],
  },
};

const emptyForm = {
  planType: '',
  coverageAmount: '',
  preExistingConditions: '',
  carBrand: '',
  licensePlate: '',
  coverageType: '',
  homeNationalId: '',
  propertyLocation: '',
  propertyUpi: '',
  mutuelleNationalId: '',
  householdMembers: [],
  startDate: '',
  type: '',
};

const ClientPolicies = () => {
  const { policies, clients, addApplication, addPayment, payments, getHouseholdMembersByNationalId } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [viewOpen, setViewOpen] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(emptyForm);
  const [successMessage, setSuccessMessage] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState('');

  const currentUser = useMemo(() => JSON.parse(localStorage.getItem('user') || '{}'), []);
  const currentClient = clients.find((client) => client.email === currentUser.email);
  const displayName = currentClient?.name || currentUser.name || '';

  const isPolicyPaid = (policy) => {
    if (!currentClient) return false;
    return payments.some(p =>
      p.clientName === currentClient.name &&
      p.policyName === policy.policyName &&
      p.date === policy.startDate
    );
  };

  const calculatePremium = () => {
    if (!selectedPolicy) return 0;
    if (selectedPolicy.type === 'health' && formData.planType) {
      return healthPlanConfig[formData.planType]?.premium || selectedPolicy.premium;
    }
    if (selectedPolicy.type === 'mutuelle') {
      return (formData.householdMembers?.length || 0) * selectedPolicy.premium;
    }
    return selectedPolicy.premium;
  };

  const selectedHealthPlan = formData.planType ? healthPlanConfig[formData.planType] : null;

  const handleMutuelleLookup = () => {
    if (!/^\d{16}$/.test(formData.mutuelleNationalId)) {
      setErrors({ ...errors, mutuelleNationalId: 'National ID must contain exactly 16 digits' });
      return;
    }

    const householdMembers = getHouseholdMembersByNationalId(formData.mutuelleNationalId);
    setFormData({
      ...formData,
      householdMembers,
    });
    setErrors({ ...errors, mutuelleNationalId: '', householdMembers: householdMembers.length ? '' : 'No assigned members found for this national ID' });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!displayName && !currentUser.email) newErrors.profileName = 'Client profile name is missing';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    else if (new Date(formData.startDate) < new Date(new Date().toISOString().split('T')[0])) {
      newErrors.startDate = 'Start date cannot be in the past';
    }

    if (selectedPolicy?.type === 'health') {
      if (!formData.planType) newErrors.planType = 'Plan type is required';
    }

    if (selectedPolicy?.type === 'auto') {
      if (!formData.carBrand.trim()) newErrors.carBrand = 'Car brand & model is required';
      if (!formData.coverageType) newErrors.coverageType = 'Coverage type is required';
    }

    if (selectedPolicy?.type === 'home') {
      if (!formData.homeNationalId.trim()) {
        newErrors.homeNationalId = 'National ID is required';
      } else if (!/^\d{16}$/.test(formData.homeNationalId)) {
        newErrors.homeNationalId = 'National ID must contain exactly 16 digits';
      }
      if (!formData.propertyLocation) newErrors.propertyLocation = 'Location is required';
      if (!formData.propertyUpi.trim()) newErrors.propertyUpi = 'UPI is required';
    }

    if (selectedPolicy?.type === 'mutuelle') {
      if (!formData.mutuelleNationalId.trim()) {
        newErrors.mutuelleNationalId = 'National ID is required';
      } else if (!/^\d{16}$/.test(formData.mutuelleNationalId)) {
        newErrors.mutuelleNationalId = 'National ID must contain exactly 16 digits';
      }
      if (!formData.householdMembers.length) {
        newErrors.householdMembers = 'Check the national ID to load assigned household members';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayPolicy = (policy) => {
    if (!currentClient) return;
    addPayment({
      clientName: currentClient.name,
      policyName: policy.policyName,
      amount: policies.find(p => p.id === policy.policyId)?.premium || 0,
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
    });
    setPaymentSuccess(`Payment for ${policy.policyName} completed successfully!`);
  };

  const handleApply = () => {
    if (!validateForm()) return;

    addApplication({
      name: displayName,
      email: currentClient?.email || currentUser.email || '',
      phone: currentClient?.phone || '',
      nationalId: formData.mutuelleNationalId || formData.homeNationalId || currentClient?.nationalId || '',
      policyId: selectedPolicy?.id,
      policyName: selectedPolicy?.name || '',
      premium: calculatePremium(),
      totalPremiumAmount: calculatePremium(),
      planType: formData.planType,
      coverageAmount: formData.coverageAmount,
      preExistingConditions: formData.preExistingConditions,
      carBrand: formData.carBrand,
      licensePlate: formData.licensePlate,
      coverageType: formData.coverageType,
      propertyAddress: formData.propertyLocation,
      propertyLocation: formData.propertyLocation,
      propertyUpi: formData.propertyUpi,
      householdMembers: formData.householdMembers,
      householdSize: formData.householdMembers.length,
      startDate: formData.startDate,
      type: selectedPolicy?.type,
    });

    setApplyOpen(false);
    setFormData(emptyForm);
    setErrors({});
    setSuccessMessage('Your insurance purchase request was sent successfully. Please wait for admin approval.');
  };

  const handleOpenApply = (policy) => {
    setSelectedPolicy(policy);
    setFormData({
      ...emptyForm,
      homeNationalId: currentClient?.nationalId || '',
      type: policy?.type || '',
    });
    setErrors({});
    setApplyOpen(true);
  };

  const handleView = (policy) => {
    setSelectedPolicy(policy);
    setViewOpen(true);
  };

  const filteredPolicies = policies.filter((policy) => {
    const matchesSearch = policy.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !typeFilter || policy.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Available Insurance Plans
      </Typography>

      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      )}

      {paymentSuccess && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setPaymentSuccess('')}>
          {paymentSuccess}
        </Alert>
      )}

      <Box className="filter-bar">
        <TextField
          label="Search policies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          sx={{ minWidth: 250 }}
        />
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Filter by Type</InputLabel>
          <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} label="Filter by Type">
            <MenuItem value="">All Types</MenuItem>
            <MenuItem value="health">Health Insurance</MenuItem>
            <MenuItem value="auto">Auto Insurance</MenuItem>
            <MenuItem value="home">Home Insurance</MenuItem>
            <MenuItem value="mutuelle">Mutuelle de Sante</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {filteredPolicies.map((policy) => {
          const config = typeConfig[policy.type] || typeConfig.health;

          return (
            <Grid item xs={12} sm={6} md={4} key={policy.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                  },
                }}
              >
                <Box
                  sx={{
                    background: `linear-gradient(135deg, ${config.bg} 0%, ${config.bg}dd 100%)`,
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      backgroundColor: 'rgba(255,255,255,0.5)',
                      display: 'flex',
                      color: config.text,
                    }}
                  >
                    {config.icon}
                  </Box>
                  <Chip
                    label={config.label}
                    size="small"
                    sx={{ backgroundColor: 'rgba(255,255,255,0.7)', color: config.text, fontWeight: 600 }}
                  />
                </Box>

                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    {policy.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 50 }}>
                    {policy.description}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Box>
                      <Typography variant="h4" color="primary" fontWeight="bold">
                        {policy.premium.toLocaleString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Rwandan Francs / {policy.duration} months
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mt: 2, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    <Chip
                      icon={<CheckCircle sx={{ fontSize: 14 }} />}
                      label="24/7 Support"
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: 11 }}
                    />
                    <Chip
                      icon={<CheckCircle sx={{ fontSize: 14 }} />}
                      label="Quick Claim"
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: 11 }}
                    />
                  </Box>
                </CardContent>

                <CardActions sx={{ px: 2, pb: 2, gap: 1 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<Visibility />}
                    onClick={() => handleView(policy)}
                    sx={{ flex: 1 }}
                  >
                    Details
                  </Button>
                  <Button size="small" variant="contained" onClick={() => handleOpenApply(policy)} sx={{ flex: 1 }}>
                    Buy Now
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {currentClient?.policies?.length > 0 && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            My Policies
          </Typography>
          <Grid container spacing={3}>
            {currentClient.policies.map((policy) => {
              const config = typeConfig[policy.type] || typeConfig.health;
              const matchedPolicy = policies.find(p => p.id === policy.policyId);
              return (
                <Grid item xs={12} sm={6} md={4} key={`${policy.policyId}-${policy.startDate}`}>
                  <Card sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                    },
                  }}>
                    <Box sx={{
                      background: `linear-gradient(135deg, ${config.bg} 0%, ${config.bg}dd 100%)`,
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                    }}>
                      <Box sx={{
                        p: 1,
                        borderRadius: 2,
                        backgroundColor: 'rgba(255,255,255,0.5)',
                        display: 'flex',
                        color: config.text,
                      }}>
                        {config.icon}
                      </Box>
                      <Chip
                        label={config.label}
                        size="small"
                        sx={{ backgroundColor: 'rgba(255,255,255,0.7)', color: config.text, fontWeight: 600 }}
                      />
                    </Box>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                        {policy.policyName}
                      </Typography>
                      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, p: 2, bgcolor: 'background.default', borderRadius: 2, mb: 2 }}>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Start Date
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {policy.startDate}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            End Date
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {policy.endDate}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Status
                          </Typography>
                          <Chip label={policy.status} size="small" color="success" sx={{ mt: 0.5 }} />
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Premium
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {matchedPolicy?.premium?.toLocaleString() || 0} RF
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                    <CardActions sx={{ px: 2, pb: 2 }}>
                      {isPolicyPaid(policy) ? (
                        <Chip label="Paid" color="success" sx={{ mx: 'auto' }} />
                      ) : (
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={() => handlePayPolicy(policy)}
                          sx={{ borderRadius: 2 }}
                        >
                          Pay Now ({matchedPolicy?.premium?.toLocaleString() || 0} RF)
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}

      <Dialog open={viewOpen} onClose={() => setViewOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Policy Details</DialogTitle>
        <DialogContent>
          {selectedPolicy && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                {typeConfig[selectedPolicy.type]?.icon}
                <Chip
                  label={typeConfig[selectedPolicy.type]?.label}
                  size="small"
                  sx={{
                    backgroundColor: typeConfig[selectedPolicy.type]?.bg,
                    color: typeConfig[selectedPolicy.type]?.text,
                  }}
                />
              </Box>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                {selectedPolicy.name}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {selectedPolicy.description}
              </Typography>

              {selectedPolicy.type === 'health' && (
                <Box sx={{ mb: 3, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Available Health Packages
                  </Typography>
                  {Object.entries(healthPlanConfig).map(([planName, plan]) => (
                    <Box key={planName} sx={{ mb: 1.5 }}>
                      <Typography variant="body2" fontWeight={600}>
                        {planName} - {plan.premium.toLocaleString()} RF / month
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {plan.details.join(', ')}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Monthly Premium
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {selectedPolicy.premium.toLocaleString()} RF
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Duration
                  </Typography>
                  <Typography variant="h6">{selectedPolicy.duration} months</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Type
                  </Typography>
                  <Typography variant="h6">{typeConfig[selectedPolicy.type]?.label}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Status
                  </Typography>
                  <Chip label={selectedPolicy.status} size="small" color="success" />
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewOpen(false)}>Close</Button>
          <Button
            variant="contained"
            onClick={() => {
              setViewOpen(false);
              handleOpenApply(selectedPolicy);
            }}
          >
            Apply Now
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={applyOpen} onClose={() => setApplyOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Buy {selectedPolicy?.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Full Name"
              value={displayName}
              margin="dense"
              InputProps={{ readOnly: true }}
              error={!!errors.profileName}
              helperText={errors.profileName || 'This is extracted from your client profile'}
            />

            {selectedPolicy?.type === 'health' && (
              <>
                <FormControl fullWidth margin="dense" error={!!errors.planType}>
                  <InputLabel>Plan Type</InputLabel>
                  <Select value={formData.planType} onChange={(e) => setFormData({ ...formData, planType: e.target.value })} label="Plan Type">
                    <MenuItem value="Basic">Basic</MenuItem>
                    <MenuItem value="Standard">Standard</MenuItem>
                    <MenuItem value="Premium">Premium</MenuItem>
                  </Select>
                </FormControl>
                {selectedHealthPlan && (
                  <Box sx={{ mt: 1, mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      {formData.planType} Package Details
                    </Typography>
                    {selectedHealthPlan.details.map((detail) => (
                      <Typography key={detail} variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        - {detail}
                      </Typography>
                    ))}
                  </Box>
                )}
                <TextField fullWidth label="Monthly Premium" value={`${calculatePremium().toLocaleString()} RF`} margin="dense" InputProps={{ readOnly: true }} />
              </>
            )}

            {selectedPolicy?.type === 'auto' && (
              <>
                <TextField
                  fullWidth
                  label="Car Brand & Model"
                  value={formData.carBrand}
                  onChange={(e) => setFormData({ ...formData, carBrand: e.target.value })}
                  error={!!errors.carBrand}
                  helperText={errors.carBrand}
                  margin="dense"
                />
                <FormControl fullWidth margin="dense" error={!!errors.coverageType}>
                  <InputLabel>Coverage Type</InputLabel>
                  <Select value={formData.coverageType} onChange={(e) => setFormData({ ...formData, coverageType: e.target.value })} label="Coverage Type">
                    <MenuItem value="Third Party">Third Party</MenuItem>
                    <MenuItem value="Comprehensive">Comprehensive</MenuItem>
                  </Select>
                </FormControl>
                <TextField fullWidth label="Monthly Premium" value={`${calculatePremium().toLocaleString()} RF`} margin="dense" InputProps={{ readOnly: true }} />
              </>
            )}

            {selectedPolicy?.type === 'home' && (
              <>
                <FormControl fullWidth margin="dense">
                  <TextField
                    fullWidth
                    label="National ID (16 digits)"
                    value={formData.homeNationalId}
                    onChange={(e) => setFormData({ ...formData, homeNationalId: e.target.value })}
                    margin="dense"
                    inputProps={{ maxLength: 16 }}
                    helperText={errors.homeNationalId || 'Enter the 16-digit national ID for this home insurance request'}
                    error={!!errors.homeNationalId}
                  />
                </FormControl>
                <FormControl fullWidth margin="dense" error={!!errors.propertyLocation}>
                  <InputLabel>Location</InputLabel>
                  <Select
                    value={formData.propertyLocation}
                    onChange={(e) => setFormData({ ...formData, propertyLocation: e.target.value })}
                    label="Location"
                  >
                    <MenuItem value="Gasabo">Gasabo</MenuItem>
                    <MenuItem value="Kicukiro">Kicukiro</MenuItem>
                    <MenuItem value="Nyarugenge">Nyarugenge</MenuItem>
                    <MenuItem value="Musanze">Musanze</MenuItem>
                    <MenuItem value="Huye">Huye</MenuItem>
                    <MenuItem value="Rubavu">Rubavu</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="UPI"
                  value={formData.propertyUpi}
                  onChange={(e) => setFormData({ ...formData, propertyUpi: e.target.value })}
                  error={!!errors.propertyUpi}
                  helperText={errors.propertyUpi}
                  margin="dense"
                />
                <TextField fullWidth label="Monthly Premium" value={`${calculatePremium().toLocaleString()} RF`} margin="dense" InputProps={{ readOnly: true }} />
              </>
            )}

            {selectedPolicy?.type === 'mutuelle' && (
              <>
                <TextField
                  fullWidth
                  label="National ID (16 digits)"
                  value={formData.mutuelleNationalId}
                  onChange={(e) => setFormData({ ...formData, mutuelleNationalId: e.target.value, householdMembers: [] })}
                  error={!!errors.mutuelleNationalId}
                  helperText={errors.mutuelleNationalId || 'Enter the 16-digit household head national ID to load assigned members'}
                  margin="dense"
                  inputProps={{ maxLength: 16 }}
                />
                <Button variant="outlined" sx={{ mt: 1, mb: 2 }} onClick={handleMutuelleLookup}>
                  Load Household Members
                </Button>
                {errors.householdMembers && (
                  <Typography variant="body2" color="error" sx={{ mb: 1 }}>
                    {errors.householdMembers}
                  </Typography>
                )}
                {formData.householdMembers.length > 0 && (
                  <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, mt: 1 }}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Assigned Household Members
                    </Typography>
                    {formData.householdMembers.map((member, index) => (
                      <Typography key={`${member.name}-${index}`} variant="body2" sx={{ mb: 0.5 }}>
                        {index + 1}. {member.name} - {member.relationship}
                      </Typography>
                    ))}
                    <TextField
                      fullWidth
                      label="Total Amount to Pay"
                      value={`${calculatePremium().toLocaleString()} RF`}
                      margin="dense"
                      InputProps={{ readOnly: true }}
                    />
                  </Box>
                )}
              </>
            )}

            <TextField
              fullWidth
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              error={!!errors.startDate}
              helperText={errors.startDate}
              margin="dense"
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: new Date().toISOString().split('T')[0] }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApplyOpen(false)}>Cancel</Button>
          <Button onClick={handleApply} variant="contained">
            Submit Purchase Request
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClientPolicies;