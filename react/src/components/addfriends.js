import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Backdrop,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
} from "@mui/material";
import axios from "axios";

const Addfriends = ({ userid, setOpen, open, onUserAdded }) => {
  const [friend, setFriend] = useState("");
  const [friendName, setFriendName] = useState("");
  const searchfriend = async () => {
    console.log("fun call seaarch frnd ");
    try {
      const res = await axios.post(`http://localhost:5000/findfriend`, {
        friendName,
      });
      console.log(res.data);
      setFriend(res.data[0]);
    } catch (error) {
      console.log("error in sending request", error);
    }
  };
  const handleAddUser = async (friend, userid) => {
    console.log("Add User button clicked!");
    console.log(friend);
    try {
      const friendid = friend._id;
      const res = await axios.post(`http://localhost:5000/friendlist`, {
        friendid,
        userid,
      });
      console.log(res.data);
      const user = res.data;
      onUserAdded(user);
    } catch (error) {
      console.log("error in sending request", error);
    }
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (e) => {
    setFriendName(e.target.value);
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
        style: {
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          backdropFilter: "blur(5px)",
        },
      }}
    >
      <DialogTitle>Add a New Friend</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Friend's Name"
          type="text"
          fullWidth
          variant="outlined"
          value={friendName}
          onChange={handleInputChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={searchfriend} color="primary">
          Submit
        </Button>
      </DialogActions>
      <DialogContent>
        {friend && (
          <List>
            <ListItem key={friend._id}>
              <ListItemAvatar>
                <Avatar src={friend.profilePicture} alt={friend.name} />
              </ListItemAvatar>
              <ListItemText
                primary={friend.firstName}
                secondary={friend.email}
              />

              <Button
                onClick={() => handleAddUser(friend, userid)}
                color="primary"
              >
                Add
              </Button>
            </ListItem>
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Addfriends;
