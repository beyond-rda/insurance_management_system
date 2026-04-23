import { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, useTheme, useMediaQuery, Avatar, Menu, MenuItem } from '@mui/material';
import { Menu as MenuIcon, Dashboard, Policy, People, Assignment, Payment, Assessment, HowToReg, DarkMode, LightMode, Logout, Person, Email, Phone, Badge, CalendarToday, Security } from '@mui/icons-material';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useThemeContext } from '../App';
import Footer from '../components/Footer';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/admin/dashboard' },
  { text: 'Policies', icon: <Policy />, path: '/admin/policies' },
  { text: 'Clients', icon: <People />, path: '/admin/clients' },
  { text: 'Applications', icon: <HowToReg />, path: '/admin/applications' },
  { text: 'Claims', icon: <Assignment />, path: '/admin/claims' },
  { text: 'Payments', icon: <Payment />, path: '/admin/payments' },
  { text: 'Reports', icon: <Assessment />, path: '/admin/reports' },
];

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, setDarkMode } = useThemeContext();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const userEmail = JSON.parse(localStorage.getItem('user') || '{}').email;

  const mockAdminDetails = {
    name: 'Admin User',
    email: userEmail || 'admin@insurance.rw',
    role: 'System Administrator',
    permissions: 'Full Access',
    lastLogin: new Date().toISOString().split('T')[0]
  };

  const drawerContent = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap fontWeight="bold">
          Admin Panel
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                if (isMobile) handleDrawerToggle();
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        <ListItemButton onClick={() => setDarkMode(!darkMode)}>
          <ListItemIcon>{darkMode ? <LightMode /> : <DarkMode />}</ListItemIcon>
          <ListItemText primary={darkMode ? 'Light Mode' : 'Dark Mode'} />
        </ListItemButton>
        <ListItemButton onClick={handleLogout}>
          <ListItemIcon><Logout /></ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { md: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Rwanda Insurance - Admin
          </Typography>
          <IconButton
            onClick={handleAvatarClick}
            sx={{ p: 0, mr: 1 }}
            aria-controls="admin-avatar-menu"
            aria-haspopup="true"
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main', fontSize: 14 }}>
              {userEmail?.charAt(0).toUpperCase() || 'A'}
            </Avatar>
          </IconButton>
          <Typography variant="body2" sx={{ mr: 2 }}>
            {userEmail}
          </Typography>
          <IconButton color="inherit" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <LightMode /> : <DarkMode />}
          </IconButton>
          <IconButton color="inherit" onClick={handleLogout}>
            <Logout />
          </IconButton>
        </Toolbar>

        <Menu
          id="admin-avatar-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          PaperProps={{
            sx: { minWidth: 280, mt: 1 }
          }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="h6" fontWeight="bold">
              {mockAdminDetails.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {mockAdminDetails.email}
            </Typography>
            <Typography variant="caption" color="primary.main" sx={{ mt: 0.5, display: 'block' }}>
              {mockAdminDetails.role}
            </Typography>
          </Box>

          <Divider />

          <MenuItem>
            <ListItemIcon><Person fontSize="small" /></ListItemIcon>
            <ListItemText primary="Role" />
            <Typography variant="body2">
              {mockAdminDetails.role}
            </Typography>
          </MenuItem>

          <MenuItem>
            <ListItemIcon><Badge fontSize="small" /></ListItemIcon>
            <ListItemText primary="Permissions" />
            <Typography variant="body2">
              {mockAdminDetails.permissions}
            </Typography>
          </MenuItem>

          <MenuItem>
            <ListItemIcon><CalendarToday fontSize="small" /></ListItemIcon>
            <ListItemText primary="Last Login" />
            <Typography variant="body2">
              {mockAdminDetails.lastLogin}
            </Typography>
          </MenuItem>

          <Divider />

          <MenuItem onClick={handleLogout}>
            <ListItemIcon><Security fontSize="small" /></ListItemIcon>
            <ListItemText primary="Logout" />
          </MenuItem>
        </Menu>
      </AppBar>

      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawerContent}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Toolbar />
        <Outlet />
        <Footer />
      </Box>
    </Box>
  );
};

export default AdminLayout;
