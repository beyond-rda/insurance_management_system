import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Checkbox,
  FormControlLabel,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Chip
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  LockOutlined,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Badge as IdIcon,
  Person as PersonIcon,
  ArrowBack,
  ArrowForward,
  CheckCircle,
  Security
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const steps = ['Personal Info', 'Contact Details', 'Account Setup', 'Confirmation'];

const RegisterClient = () => {
  const navigate = useNavigate();
  const { addClient, addApplication } = useApp();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    nationalId: '',
    password: '',
    confirmPassword: '',
    canRequestInsurance: true,
    termsAccepted: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
    }
  }, []);

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 0) {
      if (!formData.name.trim()) {
        newErrors.name = 'Full name is required';
      } else if (formData.name.trim().length < 3) {
        newErrors.name = 'Name must be at least 3 characters';
      }
    }

    if (step === 1) {
      if (!formData.email.trim()) {
        newErrors.email = 'Email address is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
        newErrors.phone = 'Phone must be 10 digits';
      }
      if (!formData.nationalId.trim()) {
        newErrors.nationalId = 'National ID is required';
      } else if (!/^\d{16}$/.test(formData.nationalId.replace(/\D/g, ''))) {
        newErrors.nationalId = 'National ID must be 16 digits';
      }
    }

    if (step === 2) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
        newErrors.password = 'Include uppercase, lowercase, and number';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      if (!formData.termsAccepted) {
        newErrors.termsAccepted = 'You must accept the terms and conditions';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(2)) return;

    setIsLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      const client = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone.replace(/\D/g, ''),
        nationalId: formData.nationalId.replace(/\D/g, ''),
        canRequestInsurance: formData.canRequestInsurance
      };

      addClient(client);
      addApplication({
        clientName: formData.name,
        email: formData.email,
        phone: formData.phone,
        status: 'pending',
        canRequestInsurance: formData.canRequestInsurance
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch {
      setErrors({ submit: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Personal Information
            </Typography>
            <TextField
              fullWidth
              label="Full Name"
              value={formData.name}
              onChange={handleChange('name')}
              error={!!errors.name}
              helperText={errors.name}
              margin="normal"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:focus-within': { boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)' }
                }
              }}
            />
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Contact Details
            </Typography>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              error={!!errors.email}
              helperText={errors.email}
              margin="normal"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Phone Number"
              value={formData.phone}
              onChange={handleChange('phone')}
              error={!!errors.phone}
              helperText={errors.phone || '10 digits required'}
              margin="normal"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon color="action" />
                  </InputAdornment>
                ),
                inputProps: { maxLength: 10 }
              }}
              placeholder="078xxxxxxxx"
            />
            <TextField
              fullWidth
              label="National ID"
              value={formData.nationalId}
              onChange={handleChange('nationalId')}
              error={!!errors.nationalId}
              helperText={errors.nationalId || '16 digits required'}
              margin="normal"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IdIcon color="action" />
                  </InputAdornment>
                ),
                inputProps: { maxLength: 16 }
              }}
            />
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Account Security
            </Typography>
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange('password')}
              error={!!errors.password}
              helperText={errors.password}
              margin="normal"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} size="small">
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              margin="normal"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} size="small">
                      {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <Box sx={{ mt: 3, mb: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.termsAccepted}
                    onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                    color="primary"
                    size="small"
                  />
                }
                label={
                  <Typography variant="body2" color="text.secondary">
                    I agree to the{' '}
                    <Link href="#terms" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                      Terms & Conditions
                    </Link>{' '}
                    and{' '}
                    <Link href="#privacy" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                      Privacy Policy
                    </Link>
                  </Typography>
                }
              />
              {errors.termsAccepted && (
                <Typography variant="caption" color="error" sx={{ ml: 0 }}>
                  {errors.termsAccepted}
                </Typography>
              )}
            </Box>

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.canRequestInsurance}
                  onChange={(e) => setFormData({ ...formData, canRequestInsurance: e.target.checked })}
                  color="primary"
                  size="small"
                />
              }
              label="I want to apply for insurance coverage"
            />
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
              Review Your Information
            </Typography>
            <Grid container spacing={2}>
              {[
                { label: 'Full Name', value: formData.name, icon: <PersonIcon /> },
                { label: 'Email', value: formData.email, icon: <EmailIcon /> },
                { label: 'Phone', value: formData.phone, icon: <PhoneIcon /> },
                { label: 'National ID', value: formData.nationalId, icon: <IdIcon /> }
              ].map((item, idx) => (
                <Grid item xs={6} key={idx}>
                  <Paper
                    sx={{
                      p: 2,
                      height: '100%',
                      backgroundColor: 'rgba(102, 126, 234, 0.05)',
                      border: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ color: 'primary.main', mr: 1 }}>{item.icon}</Box>
                      <Typography variant="caption" color="text.secondary" fontWeight={500}>
                        {item.label}
                      </Typography>
                    </Box>
                    <Typography variant="body2" fontWeight={600} noWrap>
                      {item.value || '-'}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                icon={<CheckCircle />}
                label="Insurance Requested"
                color="primary"
                size="small"
                variant={formData.canRequestInsurance ? 'filled' : 'outlined'}
              />
              <Chip
                icon={<Security />}
                label="Secure Account"
                color="success"
                size="small"
                variant="filled"
              />
            </Box>

            <Alert severity="info" sx={{ mt: 3 }}>
              By clicking submit, you agree to our Terms & Conditions. Your account will be reviewed before activation.
            </Alert>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 2,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
        }
      }}
    >
      <Paper
        elevation={24}
        sx={{
          p: { xs: 3, sm: 5, md: 6 },
          maxWidth: 640,
          width: '100%',
          borderRadius: 4,
          position: 'relative',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.97)',
          animation: 'slideUp 0.5s ease-out'
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
              boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)'
            }}
          >
            <PersonIcon sx={{ fontSize: 32, color: 'white' }} />
          </Box>
          <Typography variant="h3" fontWeight="700" color="primary" gutterBottom>
            Create Account
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Join Rwanda Insurance and secure your future
          </Typography>
        </Box>

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Registration successful! Redirecting to login...
          </Alert>
        )}

        {errors.submit && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errors.submit}
          </Alert>
        )}

        {!success && (
          <>
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <form onSubmit={handleSubmit}>
              {getStepContent(activeStep)}

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  disabled={activeStep === 0}
                  startIcon={<ArrowBack />}
                  sx={{
                    borderRadius: 2,
                    display: activeStep === 0 ? 'none' : 'flex'
                  }}
                >
                  Back
                </Button>

                <Box sx={{ ml: 'auto' }}>
                  {activeStep === steps.length - 1 ? (
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={isLoading}
                      sx={{
                        borderRadius: 2,
                        px: 4,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5568d3 0%, #653a8b 100%)'
                        }
                      }}
                    >
                      {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Complete Registration'}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      endIcon={<ArrowForward />}
                      sx={{
                        borderRadius: 2,
                        px: 4,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5568d3 0%, #653a8b 100%)'
                        }
                      }}
                    >
                      Continue
                    </Button>
                  )}
                </Box>
              </Box>
            </form>
          </>
        )}

        <Divider sx={{ my: 3 }}>
          <Typography variant="caption" color="text.secondary">
            Already have an account?
          </Typography>
        </Divider>

        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="text"
            onClick={() => navigate('/')}
            startIcon={<ArrowBack />}
            sx={{
              color: 'primary.main',
              fontWeight: 600,
              '&:hover': { backgroundColor: 'rgba(102, 126, 234, 0.08)' }
            }}
          >
            Back to Sign In
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default RegisterClient;
