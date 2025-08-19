import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Backdrop,
} from "@mui/material";
import axios from "axios";
const GroupChat = ({ userid, groupopen, setDialogOpen }) => {
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [isJoiningGroup, setIsJoiningGroup] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupToJoin, setGroupToJoin] = useState("");

  const handleCreateGroupClick = () => {
    setIsCreatingGroup(true);
    setIsJoiningGroup(false);
  };

  const handleJoinGroupClick = () => {
    setIsJoiningGroup(true);
    setIsCreatingGroup(false);
  };

  const handleSubmitGroupName = async () => {
    try {
      console.log("Group Name Submitted:", groupName);

      setIsCreatingGroup(false);
      const res = await axios.post("http://localhost:5000/creategroup", {
        userid,
        groupName,
      });
    } catch (error) {
      console.log("error in creating group ", error);
    }
  };

  const handleSubmitJoinGroup = async () => {
    try {
      console.log("Group to Join Submitted:", groupToJoin);

      setIsJoiningGroup(false);
      setIsCreatingGroup(false);
      const res = await axios.post("http://localhost:5000/joingroup", {
        userid,
        groupName,
      });
      console.log(res.data);
    } catch (error) {
      console.log("error in joining group ", error);
    }
  };

  const handleCancelGroupCreation = () => {
    setIsCreatingGroup(false);
    setGroupName(""); // Clear the input field if canceled
  };

  const handleCancelJoinGroup = () => {
    setIsJoiningGroup(false);
    setGroupToJoin(""); // Clear the input field if canceled
  };
  const handleClose = () => {
    setDialogOpen(false);
  };
  return (
    <Dialog
      open={groupopen}
      onClose={handleClose}
      BackdropComponent={Backdrop}
      BackdropProps={{
        style: {
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          backdropFilter: "blur(5px)",
        },
      }}
    >
      <DialogTitle>Select Action</DialogTitle>
      <DialogContent>
        {isCreatingGroup && (
          <div>
            <TextField
              label="Group Name"
              variant="outlined"
              fullWidth
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>
        )}
        {isJoiningGroup && (
          <div>
            <TextField
              label="Group to Join"
              variant="outlined"
              fullWidth
              value={groupToJoin}
              onChange={(e) => setGroupToJoin(e.target.value)}
            />
          </div>
        )}
      </DialogContent>
      <DialogActions>
        {isCreatingGroup ? (
          <>
            <Button color="primary" onClick={handleSubmitGroupName}>
              Submit
            </Button>
            <Button onClick={handleCancelGroupCreation}>Cancel</Button>
          </>
        ) : isJoiningGroup ? (
          <>
            <Button color="primary" onClick={handleSubmitJoinGroup}>
              Submit
            </Button>
            <Button onClick={handleCancelJoinGroup}>Cancel</Button>
          </>
        ) : (
          <>
            <Button color="secondary" onClick={handleJoinGroupClick}>
              Join
            </Button>
            <Button color="primary" onClick={handleCreateGroupClick}>
              Create
            </Button>
            <Button onClick={handleClose}>Close</Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default GroupChat;
