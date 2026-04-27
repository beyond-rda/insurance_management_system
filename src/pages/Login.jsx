import { useState } from 'react';
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
  Tooltip
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  LockOutlined,
  Email as EmailIcon,
  AccountCircle,
  ArrowBack,
  Security
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const DEFAULT_ADMIN_EMAIL = 'admin@gmail.com';
const DEFAULT_ADMIN_PASSWORD = 'admin123';
const DEFAULT_CLIENT_EMAIL = 'client@gmail.com';
const DEFAULT_CLIENT_PASSWORD = 'client123';

const Login = () => {
  const navigate = useNavigate();
  const { clients } = useApp();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setSuccess(false);

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 1000));

      const normalizedEmail = formData.email.trim().toLowerCase();
      const isDefaultAdmin = normalizedEmail === DEFAULT_ADMIN_EMAIL;
      const isDefaultClient = normalizedEmail === DEFAULT_CLIENT_EMAIL;
      const isRegisteredClient = (clients || []).some(c => c.email && c.email.trim().toLowerCase() === normalizedEmail);
      const isClient = isDefaultClient || isRegisteredClient;
      const role = isDefaultAdmin ? 'admin' : (isClient ? 'client' : 'admin');

      // Check password for default accounts
      if (isDefaultAdmin && formData.password !== DEFAULT_ADMIN_PASSWORD) {
        setAuthError('Invalid admin password. Use: admin123');
        setIsLoading(false);
        return;
      }
      if (isDefaultClient && formData.password !== DEFAULT_CLIENT_PASSWORD) {
        setAuthError('Invalid client password. Use: client123');
        setIsLoading(false);
        return;
      }

      if (rememberMe) {
        localStorage.setItem('rememberedEmail', normalizedEmail);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      localStorage.setItem('role', role);
      const matchedClient = (clients || []).find(c => c.email && c.email.trim().toLowerCase() === normalizedEmail);
      localStorage.setItem('user', JSON.stringify({ 
        email: normalizedEmail, 
        role,
        name: matchedClient?.name || normalizedEmail 
      }));
      
      setSuccess(true);
      setTimeout(() => {
        if (role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/client/home');
        }
      }, 500);
    } catch (error) {
      setAuthError('Authentication failed: ' + (error?.message || error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
    setAuthError('');
    setSuccess(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0d9488 0%, #065f46 100%)',
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
          backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(25, 118, 210, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(25, 118, 210, 0.1) 0%, transparent 50%)',
        }
      }}
    >
      <Paper
        elevation={24}
        sx={{
          p: { xs: 3, sm: 5 },
          maxWidth: 460,
          width: '100%',
          borderRadius: 4,
          position: 'relative',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,245,255,0.98) 100%)',
          backdropFilter: 'blur(10px)',
          animation: 'slideUp 0.5s ease-out',
          '@keyframes slideUp': {
            from: { opacity: 0, transform: 'translateY(30px)' },
            to: { opacity: 1, transform: 'translateY(0)' }
          }
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
              boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
              animation: 'pulse 2s ease-in-out infinite',
              '@keyframes pulse': {
                '0%, 100%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.05)' }
              }
            }}
          >
            <Security sx={{ fontSize: 32, color: 'white' }} />
          </Box>
          <Typography variant="h3" fontWeight="700" color="primary" gutterBottom>
            Rwanda Insurance
          </Typography>
          {/* <Typography variant="body1" color="text.secondary">
              Welcome back! Sign in to your account
          </Typography> */}
        </Box>

        {authError && (
          <Alert severity="error" sx={{ mb: 2, animation: 'shake 0.5s' }}>
            {authError}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Authentication successful! Redirecting...
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
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
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                transition: 'all 0.2s',
                '&:hover': { borderColor: 'primary.main' },
                '&.Mui-focused': {
                  boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.15)',
                }
              }
            }}
          />

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
                  <Tooltip title={showPassword ? 'Hide password' : 'Show password'} placement="top">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              )
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                transition: 'all 0.2s',
                '&:hover': { borderColor: 'primary.main' },
                '&.Mui-focused': {
                  boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.15)',
                }
              }
            }}
          />

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 1,
              mb: 1
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  size="small"
                  sx={{
                    color: 'text.secondary',
                    '&.Mui-checked': { color: 'primary.main' }
                  }}
                />
              }
              label={
                <Typography variant="body2" color="text.secondary">
                  Remember this device
                </Typography>
              }
            />
            <Link
              href="#forgot"
              variant="body2"
              sx={{
                textDecoration: 'none',
                fontWeight: 500,
                color: 'primary.main',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              Forgot password?
            </Link>
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={isLoading}
            sx={{
              mt: 3,
              py: 1.75,
              borderRadius: 2,
              fontSize: '1rem',
              fontWeight: 600,
              textTransform: 'none',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 4px 14px rgba(102, 126, 234, 0.4)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)',
              },
              '&:active': { transform: 'translateY(0)' },
              '&:disabled': { transform: 'none', opacity: 0.7 }
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Sign In'
            )}
          </Button>
        </Box>

        <Divider sx={{ my: 3 }}>
          <Typography variant="caption" color="text.secondary" fontWeight={500}>
            OR
          </Typography>
        </Divider>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            New to Rwanda Insurance?
          </Typography>
          <Button
            variant="outlined"
            onClick={() => navigate('/register')}
            sx={{
              borderRadius: 2,
              px: 4,
              fontWeight: 600,
              borderWidth: 2,
              color: 'primary.main',
              borderColor: 'primary.main',
              transition: 'all 0.2s',
              '&:hover': {
                borderWidth: 2,
                backgroundColor: 'primary.main',
                color: 'white',
                transform: 'translateY(-1px)'
              }
            }}
          >
            Create Account
          </Button>
        </Box>

        <Box
          sx={{
            mt: 4,
            p: 2,
            borderRadius: 2,
            backgroundColor: 'rgba(102, 126, 234, 0.05)',
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Typography variant="caption" color="text.secondary" fontWeight={500} sx={{ display: 'block', mb: 1 }}>
            Demo Credentials
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.75rem' }}>
            Admin: admin@gmail.com / admin123
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.75rem' }}>
            Client: client@gmail.com / client123
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
