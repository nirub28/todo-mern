// NotificationPage.js
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "../styles/notification.module.css";
import ImagePopup from "./imagepop";

const NotificationPage = () => {
  const user = useSelector((state) => state.user.user);
  const [notifications, setNotifications] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    // Fetch notifications for the logged-in user
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/notification/user/${user.id}`
        );

        if (response.ok) {
          const notificationData = await response.json();
          // console.log("data",notificationData);
          setNotifications(notificationData);
        } else {
          console.error("Error fetching notifications:", response.status);
        }
      } catch (error) {
        console.error("Network error:", error);
      }
    };

    fetchNotifications();
  }, [user.id]);

  const deleteNotifications = async () => {
    try {
      console.log("making call");
      const response = await fetch(
        `http://localhost:8000/notification/delete-notifications/${user.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        console.log("Notifications deleted successfully");
        // Update state to an empty array to clear notifications
        setNotifications([]);
      } else {
        console.error("Error deleting notifications:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting notifications:", error);
    }
  };

  return (
    <div className={styles.notificationContainer}>
      <h1>Notifications</h1>
      <button className={styles.notibtn} onClick={deleteNotifications}>Clear Notifications</button>
      <ul>
        {notifications.reverse().map((notification) => (
          <li key={notification._id} className={styles.notificationItem}>
            <img
              src={
                notification.sender.profilepic ||
                "https://img.icons8.com/fluency/48/test-account.png"
              }
              alt="Sender Profile"
              className={styles.notificationProfilePic}
            />
            <div className={styles.notificationContent}>
              {notification.type === "like" && (
                <div className={styles.div1}>
                  <div className={styles.inndiv1}>
                    <span
                      className={styles.notificationUsername}
                      onClick={() => {
                        const profileRedirectUrl =
                          notification.sender._id === user.id
                            ? `/profile`
                            : `/user/profile/${notification.sender._id}`;
                        window.location.href = profileRedirectUrl;
                      }}
                    >
                      {notification.sender.username}
                    </span>{" "}
                    liked your post.
                  </div>
                  <div className={styles.inndiv2}
                    onClick={() => setSelectedImage(notification.postId._id)}
                  >
                    <img
                      className={styles.smallimg}
                      src={notification.postId.image}
                      alt="Sender Profile"
                    ></img>
                  </div>
                </div>
              )}
              {notification.type === "comment" && (
                <div className={styles.div1}>
                  <div>
                  <span
                    className={styles.notificationUsername}
                    onClick={() => {
                      const profileRedirectUrl =
                        notification.sender._id === user.id
                          ? `/profile`
                          : `/user/profile/${notification.sender._id}`;
                      window.location.href = profileRedirectUrl;
                    }}
                  >
                    {notification.sender.username}
                  </span>{" "}
                  commented on your post.
                </div>
                <div
                    onClick={() => setSelectedImage(notification.postId._id)}
                  >
                    <img
                      className={styles.smallimg}
                      src={notification.postId.image}
                      alt="Sender Profile"
                    ></img>
                  </div>
                </div>
              )}
              {notification.type === "follow" && (
                <div className={styles.div1}>
                  <div>
                    <span
                      className={styles.notificationUsername}
                      onClick={() => {
                        const profileRedirectUrl =
                          notification.sender._id === user.id
                            ? `/profile`
                            : `/user/profile/${notification.sender._id}`;
                        window.location.href = profileRedirectUrl;
                      }}
                    >
                      {notification.sender.username}
                    </span>{" "}
                    followed you.
                  </div>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>

      {selectedImage !== null && (
        <ImagePopup
          imageId={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
};

export default NotificationPage;
