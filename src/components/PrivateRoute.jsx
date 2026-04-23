import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../App';
import { useContext } from 'react';
import { Box, CircularProgress } from '@mui/material';

const PrivateRoute = ({ children, allowedRole }) => {
  const { getRole, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const currentRole = getRole();

  if (!currentRole) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (allowedRole && currentRole !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;