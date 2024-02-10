import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import styles from "../styles/messages.module.css";

const MessageList = () => {
  const user = useSelector((state) => state.user.user);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    // Fetch conversations for the logged-in user
    const fetchConversations = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/message/conversations/${user.id}`
        );

        if (response.ok) {
          const conversationData = await response.json();
        //   console.log("data",conversationData);
          setConversations(conversationData);
        } else {
          console.error("Error fetching conversations:", response.status);
        }
      } catch (error) {
        console.error("Network error:", error);
      }
    };

    fetchConversations();
  }, [user.id]);

  const formatTimestamp = (timestamp) => {
    // Implement your logic to format the timestamp (e.g., 1m, 2m, 1w)
    // This is a basic example, you may need a library like moment.js for more advanced formatting
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInMilliseconds = now - messageTime;
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds}s`;
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)}m`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)}h`;
    } else {
      return `${Math.floor(diffInSeconds / 86400)}d`;
    }
  };


  return (
    
    <div className={styles.messageContainer}>
    <div className={styles.conversationList}>
      <p>{user.username}</p>
      <hr />
      <p>Messages</p>
      <hr />
      <ul>

      {conversations.map((conversation) => (
  <li className={styles.litag} key={conversation._id}>
    <Link to={`/messages/${conversation._id}`}>
      {/* Display other user's profile pic and name */}
      {conversation.participants && conversation.participants.length > 0 && (
        <>
          <img
            className={styles.profilePic}
            src={
              (conversation.participants.find(
                (participant) => participant._id !== user.id
              ) || {}).profilepic ||
              "https://img.icons8.com/fluency/48/test-account.png"
            }
            alt={
              (conversation.participants.find(
                (participant) => participant._id !== user.id
              ) || {}).username
            }
          />
          <span className={styles.username}>
            {
              (conversation.participants.find(
                (participant) => participant.username !== user.username
              ) || {}).username
            }
          </span>
          <p className={styles.messageContent}>
            {conversation.messages.length > 0 ? (
              <>
                {conversation.messages[conversation.messages.length - 1]
                  .sender === user.id ? (
                  `You: ${conversation.messages[conversation.messages.length - 1].content}`
                ) : (
                  conversation.messages[conversation.messages.length - 1].content
                )}
                &nbsp; -{" "}
                {`${formatTimestamp(conversation.messages[conversation.messages.length - 1].timestamp)} ago`}
              </>
            ) : (
              "No messages"
            )}
          </p>
        </>
      )}
    </Link>
  </li>
))}

      
      </ul>
    </div>
  </div>
   
  );
};

export default MessageList;
