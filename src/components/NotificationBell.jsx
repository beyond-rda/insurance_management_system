import { useState, useMemo } from 'react';
import {
  Box,
  IconButton,
  Badge,
  Popper,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Button,
  Chip,
} from '@mui/material';
import { Notifications, CheckCircle, Cancel, Info } from '@mui/icons-material';
import { useApp } from '../context/AppContext';

const NotificationBell = ({ role = 'admin', clientEmail = '' }) => {
  const { notifications, markNotificationRead, clearNotifications } = useApp();
  const [anchorEl, setAnchorEl] = useState(null);

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (n.role && n.role !== role) return false;
      if (role === 'client' && n.clientEmail && n.clientEmail !== clientEmail) return false;
      return true;
    });
  }, [notifications, role, clientEmail]);

  const unreadCount = filteredNotifications.filter((n) => !n.read).length;

  const handleToggle = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleMarkRead = (id) => {
    markNotificationRead(id);
  };

  const handleClearAll = () => {
    clearNotifications();
  };

  const getIcon = (type) => {
    switch (type) {
      case 'application_approved':
        return <CheckCircle sx={{ color: 'success.main' }} />;
      case 'application_rejected':
        return <Cancel sx={{ color: 'error.main' }} />;
      default:
        return <Info sx={{ color: 'info.main' }} />;
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? 'notification-popper' : undefined;

  return (
    <Box>
      <IconButton color="inherit" onClick={handleToggle}>
        <Badge badgeContent={unreadCount} color="error" max={99}>
          <Notifications />
        </Badge>
      </IconButton>
      <Popper
        id={id}
        open={open}
        anchorEl={anchorEl}
        placement="bottom-end"
        sx={{ zIndex: 1300, width: 360 }}
      >
        <Paper elevation={8} sx={{ maxHeight: 400, overflow: 'auto', borderRadius: 2 }}>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight={600}>
              Notifications
            </Typography>
            {filteredNotifications.length > 0 && (
              <Button size="small" onClick={handleClearAll}>
                Clear All
              </Button>
            )}
          </Box>
          <Divider />
          {filteredNotifications.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No notifications yet
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {filteredNotifications.map((notification) => (
                <ListItem
                  key={notification.id}
                  sx={{
                    bgcolor: notification.read ? 'transparent' : 'action.hover',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleMarkRead(notification.id)}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: notification.read ? 'grey.200' : 'primary.light' }}>
                      {getIcon(notification.type)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" fontWeight={notification.read ? 400 : 600}>
                        {notification.title}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          {notification.message}
                        </Typography>
                        <Chip
                          label={notification.read ? 'Read' : 'New'}
                          size="small"
                          color={notification.read ? 'default' : 'primary'}
                          sx={{ height: 20 }}
                        />
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </Popper>
    </Box>
  );
};

export default NotificationBell;
