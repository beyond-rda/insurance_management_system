import { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Tabs, Tab, useTheme, Avatar, Menu, MenuItem, ListItemIcon, ListItemText, Divider as MuiDivider } from '@mui/material';
import { DarkMode, LightMode, Logout, Person, Email, Phone, Badge, CalendarToday, Security } from '@mui/icons-material';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useThemeContext } from '../App';
import Footer from '../components/Footer';
import NotificationBell from '../components/NotificationBell';

const ClientLayout = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, setDarkMode } = useThemeContext();
  const [anchorEl, setAnchorEl] = useState(null);

  const userEmail = JSON.parse(localStorage.getItem('user') || '{}').email;
  const userInitial = userEmail?.charAt(0).toUpperCase() || 'U';

  const currentTab = location.pathname === '/client/home' || location.pathname === '/client' ? 0 :
                     location.pathname === '/client/policies' ? 1 :
                     location.pathname === '/client/claims' ? 2 :
                     location.pathname === '/client/profile' ? 3 : 0;

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleTabChange = (event, newValue) => {
    const routes = ['/client/home', '/client/policies', '/client/claims', '/client/profile'];
    navigate(routes[newValue]);
  };

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const mockUserDetails = {
    name: 'Jean Paul Mugisha',
    email: userEmail || 'client@email.com',
    phone: '+250 788 123 456',
    nationalId: '1199001234567890',
    memberSince: '2025-01-15',
    status: 'Active'
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Rwanda Insurance - Client Portal
          </Typography>
          <NotificationBell role="client" clientEmail={userEmail} />
          <IconButton
            onClick={handleAvatarClick}
            sx={{ p: 0 }}
            aria-controls="avatar-menu"
            aria-haspopup="true"
          >
            <Avatar sx={{ width: 36, height: 36, bgcolor: 'secondary.main', fontSize: 16 }}>
              {userInitial}
            </Avatar>
          </IconButton>
          <IconButton color="inherit" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <LightMode /> : <DarkMode />}
          </IconButton>
          <IconButton color="inherit" onClick={handleLogout}>
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Menu
        id="avatar-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: { minWidth: 280, mt: 1 }
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="h6" fontWeight="bold">
            {mockUserDetails.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {mockUserDetails.email}
          </Typography>
        </Box>

        <MuiDivider />

        <MenuItem onClick={() => { handleMenuClose(); navigate('/client/profile'); }}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </MenuItem>

        <MenuItem>
          <ListItemIcon>
            <Badge fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="National ID" />
          <Typography variant="caption" color="text.secondary">
            {mockUserDetails.nationalId}
          </Typography>
        </MenuItem>

        <MenuItem>
          <ListItemIcon>
            <Phone fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Phone" />
          <Typography variant="body2">
            {mockUserDetails.phone}
          </Typography>
        </MenuItem>

        <MenuItem>
          <ListItemIcon>
            <CalendarToday fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Member Since" />
          <Typography variant="body2">
            {mockUserDetails.memberSince}
          </Typography>
        </MenuItem>

        <MenuItem>
          <ListItemIcon>
            <Security fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Status" />
          <Typography variant="body2" color="success.main">
            {mockUserDetails.status}
          </Typography>
        </MenuItem>

        <MuiDivider />

        <MenuItem onClick={() => { handleMenuClose(); navigate('/client/profile'); }}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Edit Profile" />
        </MenuItem>
      </Menu>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: theme.palette.background.paper }}>
        <Tabs value={currentTab} onChange={handleTabChange} centered>
          <Tab label="Home" />
          <Tab label="Policies" />
          <Tab label="My Claims" />
          <Tab label="Profile" />
        </Tabs>
      </Box>

      <Box sx={{ p: 3 }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default ClientLayout;
