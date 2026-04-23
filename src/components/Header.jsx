import { AppBar, Toolbar, Typography, IconButton, Box, useTheme } from '@mui/material';
import { Menu as MenuIcon, DarkMode, LightMode, Person } from '@mui/icons-material';
import { useThemeContext } from '../App';
import { useNavigate } from 'react-router-dom';

const Header = ({ onMenuClick }) => {
  const theme = useTheme();
  const { darkMode, setDarkMode } = useThemeContext();
  const navigate = useNavigate();

  return (
    <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton color="inherit" edge="start" onClick={onMenuClick} sx={{ mr: 2, display: { md: 'none' } }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>
          Insurance Management System
        </Typography>
        <IconButton color="inherit" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <LightMode /> : <DarkMode />}
        </IconButton>
        <IconButton color="inherit" onClick={() => navigate('/client')}>
          <Person />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;