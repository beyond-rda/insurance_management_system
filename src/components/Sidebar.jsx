import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Box, Divider, useTheme, useMediaQuery } from '@mui/material';
import { Dashboard, Policy, People, Assignment, Payment, Assessment, DarkMode, LightMode } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useThemeContext } from '../App';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/' },
  { text: 'Policies', icon: <Policy />, path: '/policies' },
  { text: 'Clients', icon: <People />, path: '/clients' },
  { text: 'Claims', icon: <Assignment />, path: '/claims' },
  { text: 'Payments', icon: <Payment />, path: '/payments' },
  { text: 'Reports', icon: <Assessment />, path: '/reports' },
];

const Sidebar = ({ mobileOpen, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, setDarkMode } = useThemeContext();

  const drawerContent = (
    <Box>
      <Toolbar />
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                if (isMobile) onClose();
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ListItemButton onClick={() => setDarkMode(!darkMode)}>
          <ListItemIcon>{darkMode ? <LightMode /> : <DarkMode />}</ListItemIcon>
          <ListItemText primary={darkMode ? 'Light Mode' : 'Dark Mode'} />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
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
  );
};

export default Sidebar;