import React, { useState, useEffect , useRef} from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
// import {io} from 'socket.io-client';
import styles from "../styles/messagenotList.module.css";

const Message = ({ socket }) => {
  const user = useSelector((state) => state.user.user);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  // const dispatch = useDispatch();
  const { conversationId } = useParams();
  const scroll = useRef();


  const userId = user.id;

  useEffect(() => {
    socket.emit("join_room", conversationId);

    // Listen for new messages from the server
    socket.on("newMessage", (messageData) => {
      // Update the UI with the new message
      setMessages((prevMessages) => [...prevMessages, messageData]);
    });

    return () => {
      // Clean up the socket listener when the component unmounts
      socket.off("newMessage");
    };
  }, [conversationId, socket]);

  useEffect(() => {
    const fetchConversationData = async () => {
      // Fetch conversation details based on conversationId
      await fetchConversationDetails(conversationId, userId);
      // Fetch messages for the conversation
      await fetchMessages(conversationId);
    };

    fetchConversationData();
  }, [conversationId, userId]);

  useEffect(() => {
    // Scroll to the last message when messages change
     scroll.current?.scrollIntoView({behavior:"auto"});
  }, [messages]);


  const fetchConversationDetails = async (conversationId, userId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/message/conversation-details/${conversationId}?userId=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const conversationData = await response.json();
        setSelectedUser(conversationData.otherUser);
      }
    } catch (error) {
      console.error("Error fetching conversation details:", error);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/message/get-messages/${conversationId}`
      );
      if (response.ok) {
        const messageData = await response.json();
        setMessages(messageData);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      // Make an API call to send the message
      const messageData = {
        sender: user.id,
        room: conversationId,
        content: newMessage,
        timestamp: new Date().toISOString(),
      };

      fetch("http://localhost:8000/message/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageData),
      })
        .then((response) => {
          if (response.ok) {
            // Message sent successfully, you can update the conversation's messages
            // setMessages((prevMessages) => [...prevMessages, messageData]);

            // Clear the new message input
            setNewMessage("");
            // Emit Socket.IO event to notify the server about the new message
            socket.emit("newMessage", messageData);
          } else {
            console.error("Error sending message");
          }
        })

        .catch((error) => {
          console.error("Error sending message:", error);
        });
    }
  };


  const formatDate = (timestamp) => {
    const messageDate = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (
      messageDate.toDateString() === today.toDateString()
    ) {
      return "Today";
    } else if (
      messageDate.toDateString() === yesterday.toDateString()
    ) {
      return "Yesterday";
    } else {
      return messageDate.toLocaleDateString();
    }
  };


 

  return (
    <div className={styles.messageContainer}>
      <div className={styles.conversationList}>
        <p>{user.username}</p>
        <hr />
        <p>Messages</p>
        <hr />
      </div>
      <div className={styles.chatBox}>
        <div className={styles.selectedUser}>
          {selectedUser && (
            <>
              {selectedUser.profilepic ? (
                <img
                  className={styles.profilepicc}
                  src={selectedUser.profilepic}
                  alt="User profile"
                />
              ) : (
                <img
                  className={styles.profilepicc}
                  src="https://img.icons8.com/fluency/48/test-account.png"
                  alt="Default profile"
                />
              )}
              <span className={styles.username}>{selectedUser.username}</span>
            </>
          )}
        </div>

        <div className={styles.chatContent} >
          <div className={styles.messages}>
            {messages.map((message, index) => (
              <div key={index} className={styles.message}>
              {index === 0 || formatDate(message.timestamp) !== formatDate(messages[index - 1].timestamp) ? (
                <div className={styles.dateContainer}>
                <div className={styles.date}>{formatDate(message.timestamp)}</div>
              </div>
              ) : null}

              <div
               ref={scroll}
                key={index}
                className={`${styles.message} ${
                  message.sender === user.id
                    ? styles.sentMessage
                    : styles.receivedMessage
                }`}
              >
                {message.content}
                {message.timestamp && (
                  <span className={styles.timestamp}>
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                )}
              </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.messageInput}>
          <input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Message;
