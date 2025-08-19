import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

const Notify = ({
  handleclosenotification,
  socket,
  notifyopen,
  handleClose,
  handleNotificationCount,
}) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (socket) {
      // Listener for the 'notifications' event
      const handleNotification = (data) => {
        console.log("Notification received:", data);
        setNotifications((prevNotifications) => [...prevNotifications, data]);
      };

      // Attach the listener
      socket.on("notifications", handleNotification);

      // Cleanup listener on component unmount
      return () => {
        socket.off("notifications", handleNotification);
      };
    }
  }, [socket]);

  useEffect(() => {
    if (handleNotificationCount) {
      // Send the count of notifications to the parent component
      handleNotificationCount(notifications.length);
    }
  }, [notifications, handleNotificationCount]);

  return (
    <Dialog open={notifyopen} maxWidth="sm" fullWidth>
      <DialogTitle>Notifications</DialogTitle>
      <DialogContent>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {notifications.length === 0 ? (
            <li>No notifications</li>
          ) : (
            notifications.map((notification, index) => (
              <li
                key={index}
                style={{ padding: "8px", borderBottom: "1px solid #ddd" }}
              >
                {notification.msg}
              </li>
            ))
          )}
        </ul>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleclosenotification()} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Notify;
