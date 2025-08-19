import React, { useState } from "react";
import { IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import styles from "../styles/sidebar.module.css";
const Sendmessage = ({ socket, userid, receiverid }) => {
  const [message, setMessage] = useState("");
  const handleSendMessage = () => {
    if (socket) {
      socket.emit("notify", { userid, receiverid });
      socket.emit("message", { userid, message, receiverid });
      setMessage(""); // Clear message input after sending
    }
  };
  return (
    <div>
      {receiverid && (
        <div className={styles.chatInputContainer}>
          <button className={styles.emojiButton}>😊</button>
          <input
            type="text"
            className={styles.chatInput}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <IconButton
            aria-label="send-message"
            className={styles.sendButton}
            onClick={handleSendMessage}
          >
            <SendIcon />
          </IconButton>
        </div>
      )}
    </div>
  );
};

export default Sendmessage;
