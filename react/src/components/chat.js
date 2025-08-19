import React, { useState, useEffect } from "react";
import Lottie from "lottie-react";
import animationData from "../chaty.json";
import styles from "../styles/sidebar.module.css";
import { Avatar, List, ListItem, ListItemText } from "@mui/material";
import axios from "axios";

const Chat = ({ receiverid, userid, socket }) => {
  const [conversation, setConversation] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const res = await axios.post("http://localhost:3000/conversation", {
          userid,
          receiverid,
        });
        if (res && res.data) {
          const { conversation } = res.data;
          if (conversation && conversation.messages) {
            setConversation(conversation.messages);
          } else {
            console.error("Messages not found in conversation");
          }
        }
      } catch (error) {
        console.log("Error fetching conversation:", error);
      }
    };

    if (receiverid) {
      fetchConversation();
    }
  }, [receiverid]);

  useEffect(() => {
    if (socket) {
      socket.on("sendermessage", (data) => {
        const { userid, message, createdAt } = data;
        setArrivalMessage({ userid, message, createdAt });
      });
    }

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.off("sendermessage");
      }
    };
  }, [socket]);

  useEffect(() => {
    if (arrivalMessage) {
      setConversation((prevMessages) => [...prevMessages, arrivalMessage]);
      setArrivalMessage(null);
    }
  }, [arrivalMessage]);

  return (
    <div>
      {conversation.length === 0 ? (
        <div className={styles.lottieContainer}>
          <Lottie animationData={animationData} loop={true} />
        </div>
      ) : (
        <List>
          <div className={styles.lottie}>
            {conversation.map((chat, index) => (
              <ListItem key={index}>
                <div
                  className={
                    chat.userid._id.toString() === userid.toString()
                      ? styles.chatBubbleSender
                      : styles.chatBubble
                  }
                >
                  <Avatar
                    src={chat.userid.profilePicture}
                    alt={chat.userid.userName}
                  />
                  <ListItemText
                    primary={chat.message}
                    secondary={new Date(chat.createdAt).toLocaleTimeString()}
                  />
                </div>
              </ListItem>
            ))}
          </div>
        </List>
      )}
    </div>
  );
};

export default Chat;
