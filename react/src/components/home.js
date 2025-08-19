import React, { useState, useEffect } from "react";
import styles from "../styles/sidebar.module.css";
import { PersonAdd, Group, Notifications } from "@mui/icons-material";
import {
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
} from "@mui/material";
import Chat from "./chat.js";
import Sendmessage from "./sendmessage.js";
import axios from "axios";
import io from "socket.io-client";
import CircleIcon from "@mui/icons-material/Circle";
import { loadUserid } from "../redux/userslice";
import { useSelector, useDispatch } from "react-redux";
import Addfriends from "./addfriends.js";
import GroupChat from "./groupchat.js";
import Notify from "./notifications.js";
const Home = () => {
  const [socket, setSocket] = useState(null);
  const [open, setOpen] = useState(false);

  const [users, setusers] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [receiverid, setrecieverid] = useState("");

  const userid = useSelector((state) => state.user.userid);
  const [onlineusers, setonlineusers] = useState([]);
  const dispatch = useDispatch();
  const [groupopen, setDialogOpen] = useState(false);
  const [notifyopen, setnotifyopen] = useState(false);
  dispatch(loadUserid(userid));

  useEffect(() => {
    const socket = io("http://localhost:5000");
    console.log(socket);
    setSocket(socket);
    socket.on("connect", () => {
      console.log("Successfully connected!");
      socket.emit("adduser", userid);
    });
    socket.on("getonlineusers", (users) => {
      console.log(users);
      setonlineusers(users);
    });

    socket.on("getusers after disconnect", (users) => {
      console.log("users after dis disconnect", users);
      setonlineusers(users);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    const getusers = async () => {
      console.log("fun call for fetching users  ");
      try {
        const res = await axios.get(`http://localhost:5000/users/${userid}`);
        console.log(res.data);
        setusers(res.data[0].userDetails);
      } catch (error) {
        console.log("error in sending request", error);
      }
    };
    getusers();
  }, []);

  const getreciverid = (id) => {
    setrecieverid(id);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUserAdded = (newUser) => {
    setusers((prevUsers) => [...prevUsers, newUser]);
  };
  const checkIfUserIsOnline = (id) => {
    const isOnline = onlineusers.some((user) => user.userid === id);
    console.log(`Checking if user ${id} is online:`, isOnline);
    return isOnline;
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };
  useEffect(() => {
    console.log(notifyopen);
  }, [notifyopen]);
  const handlenotification = () => {
    setnotifyopen(true);
  };
  const handleclosenotification = () => {
    setnotifyopen(false);
  };
  const handleNotificationCount = (count) => {
    setNotificationCount(count);
  };

  return (
    <body className={styles.body}>
      <>
        <div className={styles.container}>
          <div className={styles.content1}>
            <div className="topsection">
              <IconButton onClick={handleClickOpen}>
                <PersonAdd />
              </IconButton>

              <IconButton onClick={() => handleOpenDialog()}>
                <Group />
              </IconButton>

              <IconButton onClick={() => handlenotification()}>
                <Notifications />
                {notificationCount}
              </IconButton>
            </div>
            <div className="search">
              <TextField
                id="standard-search"
                label="Search field"
                type="search"
                variant="standard"
              />
            </div>
            <div className={styles.chatlist}>
              <List>
                {users.map((user) => (
                  <ListItem
                    onClick={() => getreciverid(user._id)}
                    key={user._id}
                  >
                    <ListItemAvatar>
                      <Avatar src={user.profilePicture} alt={user.firstName} />
                    </ListItemAvatar>
                    <ListItemText primary={user.firstName} />
                    {checkIfUserIsOnline(user._id) && (
                      <CircleIcon
                        className="onlineIndicator"
                        style={{ color: "white", fontSize: 15 }} // Customize the icon
                      />
                    )}
                  </ListItem>
                ))}
              </List>
            </div>
          </div>

          <div className={styles.content2}>
            <Chat userid={userid} socket={socket} receiverid={receiverid} />
          </div>

          <div className={styles.sendmessage}>
            <div className={styles.content3}>
              <Sendmessage
                socket={socket}
                receiverid={receiverid}
                userid={userid}
              />
            </div>
          </div>
        </div>
        <div></div>

        <Addfriends
          open={open}
          setOpen={handleClose}
          userid={userid}
          onUserAdded={handleUserAdded}
        />

        <GroupChat
          userid={userid}
          groupopen={groupopen}
          setDialogOpen={setDialogOpen}
          setusers={setusers}
        />
        <Notify
          handleclosenotification={handleclosenotification}
          setnotifyopen={setnotifyopen}
          notifyopen={notifyopen}
          socket={socket}
          handleNotificationCount={handleNotificationCount}
        />
      </>
    </body>
  );
};
export default Home;
