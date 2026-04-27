import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  IconButton,
  Chip
} from '@mui/material';
import {
  Security,
  HealthAndSafety,
  AccountBalanceWallet,
  VerifiedUser,
  Support,
  Speed,
  Shield,
  ArrowForward,
  ArrowBack,
  LightMode,
  DarkMode
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useThemeContext } from '../App';

const featureCards = [
  {
    icon: <Shield fontSize="large" />,
    title: 'Secure Protection',
    description: 'Industry-leading security protocols protect your personal and financial information at all times.'
  },
  {
    icon: <Speed fontSize="large" />,
    title: 'Fast Processing',
    description: 'Quick claim approvals and instant policy updates with our streamlined digital platform.'
  },
  {
    icon: <Support fontSize="large" />,
    title: '24/7 Support',
    description: 'Round-the-clock customer service and claims assistance whenever you need it.'
  },
  {
    icon: <HealthAndSafety fontSize="large" />,
    title: 'Health Coverage',
    description: 'Comprehensive health insurance plans tailored to your medical needs and budget.'
  },
  {
    icon: <AccountBalanceWallet fontSize="large" />,
    title: 'Asset Protection',
    description: 'Safeguard your home, vehicle, and valuable assets with our flexible insurance.'
  },
  {
    icon: <VerifiedUser fontSize="large" />,
    title: 'Trusted Partner',
    description: 'Years of experience serving thousands of satisfied clients across the nation.'
  }
];

const heroCards = [
  {
    icon: <Security sx={{ fontSize: 48, color: 'primary.main' }} />,
    title: 'Life Insurance',
    description: "Protect your family's future with comprehensive life coverage plans."
  },
  {
    icon: <HealthAndSafety sx={{ fontSize: 48, color: 'primary.main' }} />,
    title: 'Health Insurance',
    description: 'Complete medical coverage for you and your loved ones.'
  },
  {
    icon: <AccountBalanceWallet sx={{ fontSize: 48, color: 'primary.main' }} />,
    title: 'Property Insurance',
    description: 'Secure your home, vehicle, and valuable assets.'
  }
];

const Hello = () => {
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useThemeContext();
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroCards.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroCards.length) % heroCards.length);
  };

  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroCards.length);
    }, 4000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleManualNext = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    nextSlide();
    intervalRef.current = setInterval(() => {
      nextSlide();
    }, 4000);
  };

  const handleManualPrev = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    prevSlide();
    intervalRef.current = setInterval(() => {
      nextSlide();
    }, 4000);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box
        component="nav"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          py: 1
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Shield sx={{ fontSize: 32, color: 'primary.main' }} />
              <Typography variant="h5" fontWeight="700" color="primary">
                Rwanda Insurance
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton
                onClick={() => setDarkMode(!darkMode)}
                sx={{ mr: 1 }}
                color="primary"
              >
                {darkMode ? <LightMode /> : <DarkMode />}
              </IconButton>
              <Button
                variant="outlined"
                onClick={() => navigate('/login')}
              >
                Sign In
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate('/register')}
                sx={{ ml: 1 }}
              >
                Register
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: { xs: 6, md: 10 }, position: 'relative', overflow: 'hidden' }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Chip
                label="Trusted Since 1995"
                size="small"
                sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}
              />
              <Typography variant="h2" fontWeight="800" sx={{ mb: 3, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
                Protecting What Matters Most
              </Typography>
              <Typography variant="h5" sx={{ mb: 4, opacity: 0.9, fontWeight: 300, lineHeight: 1.6 }}>
                Rwanda Insurance provides comprehensive coverage solutions tailored to your unique needs.
                Safeguard your health, assets, and future with Africa's most trusted insurance partner.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{
                    py: 2,
                    px: 4,
                    fontSize: '1.1rem',
                    borderRadius: 2,
                    bgcolor: 'white',
                    color: 'primary.main',
                    fontWeight: 700,
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.9)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
                    }
                  }}
                  startIcon={<ArrowForward />}
                >
                  Get Started Free
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{
                    py: 2,
                    px: 4,
                    fontSize: '1.1rem',
                    borderRadius: 2,
                    borderColor: 'white',
                    color: 'white',
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: 'rgba(255,255,255,0.8)',
                      bgcolor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  Sign In
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={24}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  bgcolor: 'background.paper',
                  color: 'text.primary',
                  minHeight: 320,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6" fontWeight={600} color="primary">
                    Our Core Services
                  </Typography>
                  <Box>
                    <IconButton size="small" onClick={handleManualPrev}>
                      <ArrowBack />
                    </IconButton>
                    <IconButton size="small" onClick={handleManualNext}>
                      <ArrowForward />
                    </IconButton>
                  </Box>
                </Box>
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  {heroCards[currentSlide].icon}
                  <Typography variant="h5" fontWeight={700} sx={{ my: 2 }}>
                    {heroCards[currentSlide].title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {heroCards[currentSlide].description}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mt: 3 }}>
                  {heroCards.map((_, index) => (
                    <Box
                      key={index}
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: index === currentSlide ? 'primary.main' : 'grey.300',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                      }}
                      onClick={() => setCurrentSlide(index)}
                    />
                  ))}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Chip label="Why Choose Us" sx={{ mb: 2 }} />
            <Typography variant="h3" fontWeight="700" sx={{ mb: 3 }}>
              Comprehensive Insurance Solutions
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              We combine decades of expertise with cutting-edge technology to deliver exceptional insurance services.
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {featureCards.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 2,
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 16px 40px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Box
                      sx={{
                        width: 72,
                        height: 72,
                        borderRadius: '50%',
                        bgcolor: 'primary.light',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2,
                        color: 'primary.main'
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: { xs: 8, md: 10 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Typography variant="h3" fontWeight="700" sx={{ mb: 3 }}>
            Ready to Get Protected?
          </Typography>
          <Typography variant="h5" sx={{ mb: 5, opacity: 0.9, fontWeight: 300 }}>
            Join thousands of satisfied clients who trust us with their insurance needs.
            Start your journey to comprehensive protection today.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              sx={{
                py: 2,
                px: 5,
                fontSize: '1.1rem',
                borderRadius: 2,
                bgcolor: 'white',
                color: 'primary.main',
                fontWeight: 700,
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.9)'
                }
              }}
              startIcon={<Security />}
            >
              Create Your Account
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/login')}
              sx={{
                py: 2,
                px: 5,
                fontSize: '1.1rem',
                borderRadius: 2,
                borderColor: 'white',
                color: 'white',
                fontWeight: 600
              }}
            >
              Already Have Account? Sign In
            </Button>
          </Box>
        </Container>
      </Box>

      <Box
        component="footer"
        sx={{
          bgcolor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider',
          py: 4
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Shield sx={{ fontSize: 24, color: 'primary.main' }} />
              <Typography variant="h6" fontWeight="700" color="primary">
                Rwanda Insurance
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              © 2026 Rwanda Insurance. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Hello;
