import { useState, createContext, useContext } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import ClientLayout from './layouts/ClientLayout';
import Login from './pages/Login';
import RegisterClient from './pages/RegisterClient';
import Dashboard from './pages/Dashboard';
import Policies from './pages/Policies';
import Clients from './pages/Clients';
import Claims from './pages/Claims';
import Payments from './pages/Payments';
import Reports from './pages/Reports';
import Applications from './pages/Applications';
import ClientHome from './pages/ClientHome';
import ClientPolicies from './pages/ClientPolicies';
import ClientClaims from './pages/ClientClaims';
import ClientProfile from './pages/ClientProfile';
import Hello from './pages/Hello';
import { AppProvider } from './context/AppContext';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    background: { default: '#f5f5f5', paper: '#ffffff' },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#90caf9' },
    secondary: { main: '#f48fb1' },
    background: { default: '#121212', paper: '#1e1e1e' },
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export const ThemeContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useThemeContext = () => useContext(ThemeContext);

const getRole = () => localStorage.getItem('role');

const PrivateRoute = ({ children, allowedRole }) => {
  const role = getRole();
  if (!role) return <Navigate to="/" replace />;
  if (allowedRole && role !== allowedRole) return <Navigate to="/" replace />;
  return children;
};

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const theme = darkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Hello />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<RegisterClient />} />
              
              <Route path="/admin" element={
                <PrivateRoute allowedRole="admin">
                  <AdminLayout />
                </PrivateRoute>
              }>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="policies" element={<Policies />} />
                <Route path="clients" element={<Clients />} />
                <Route path="claims" element={<Claims />} />
                <Route path="payments" element={<Payments />} />
                <Route path="applications" element={<Applications />} />
                <Route path="reports" element={<Reports />} />
                <Route index element={<Navigate to="dashboard" replace />} />
              </Route>

              <Route path="/client" element={
                <PrivateRoute allowedRole="client">
                  <ClientLayout />
                </PrivateRoute>
              }>
                <Route path="home" element={<ClientHome />} />
                <Route path="policies" element={<ClientPolicies />} />
                <Route path="claims" element={<ClientClaims />} />
                <Route path="profile" element={<ClientProfile />} />
                <Route index element={<Navigate to="home" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AppProvider>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export default App;