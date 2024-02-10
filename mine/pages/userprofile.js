import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "../styles/profile.module.css";
import { useParams, Link } from "react-router-dom";
import ImagePopup from "./imagepop";


const UserProfile = () => {
  const user = useSelector((state) => state.user.user); // Your user data from the store
  const [otherUser, setOtherUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [showFollowersPopup, setShowFollowersPopup] = useState(false);
  const [showFollowingPopup, setShowFollowingPopup] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [postList, setPostList] = useState([]);


  const { userid } = useParams();

  // console.log("user id:",user._id);

  // Function to check if the current user is following the other user
  const checkIfFollowing = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/user/checkIfFollowing?userId=${userid}&currentUserId=${user.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        setIsFollowing(result.isFollowing);
      } else {
        // Handle the case where the API call fails
        console.error("Failed to check if following:", response.status);
      }
    } catch (error) {
      // Handle network error
      console.error("Network error:", error);
    }
  };

   // Function to send a notification to the post owner
const sendNotification = async (receiverId, type) => {
  try {
    await fetch("http://localhost:8000/notification/sendfollow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        senderId: user.id,
        receiverId,
        type,
      }),
    });
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

  const followUser = async (userIdToFollow) => {
    try {
      // Make an API call to follow the user
      const response = await fetch(
        `http://localhost:8000/user/follow/${userIdToFollow}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ currentUserId: user.id }),
        }
      );

      if (response.ok) {
        // Update the user data in the Redux store with the updated user details
        // const / = await response.json();
        setIsFollowing(true);

        fetchFollowerAndFollowingCounts(userid);
          
        await sendNotification(userid, "follow");
        

      } else {
        // Handle the case where the API call fails
        console.error("Failed to follow user:", response.status);
      }
    } catch (error) {
      // Handle network error
      console.error("Network error:", error);
    }
  };

  const handleUnfollow = async (userIdToUnfollow) => {
    try {
      // Make an API call to unfollow the user
      const response = await fetch(
        `http://localhost:8000/user/unfollow/${userIdToUnfollow}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ currentUserId: user.id }),
        }
      );

      if (response.ok) {
        // Update the user data in the Redux store with the updated user details
        // const updatedUserData = await response.json();
        setIsFollowing(false);
        // Fetch the updated follower and following counts
         fetchFollowerAndFollowingCounts(userid);

        // Remove the unfollowed user from the followersList
        // const updatedFollowersList = followersList.filter(
        //   (followerId) => followerId !== userIdToUnfollow
        // );
        // setFollowersList(updatedFollowersList);
      } else {
        // Handle the case where the API call fails
        console.error("Failed to unfollow user:", response.status);
      }
    } catch (error) {
      // Handle network error
      console.error("Network error:", error);
    }
  };


  const fetchFollowerAndFollowingCounts = async (userId) => {
    try {
      // Fetch the updated follower and following counts
      const [followersResponse, followingResponse] = await Promise.all([
        fetch(`http://localhost:8000/user/followers/${userId}`),
        fetch(`http://localhost:8000/user/following/${userId}`),
      ]);
  
      if (followersResponse.ok) {
        const followersData = await followersResponse.json();
        setFollowersList(followersData.followers);
      } else {
        // Handle error
        console.error("Error fetching followers");
      }
  
      if (followingResponse.ok) {
        const followingData = await followingResponse.json();
        setFollowingList(followingData.following);
      } else {
        // Handle error
        console.error("Error fetching following");
      }
    } catch (error) {
      // Handle network error
      console.error("Network error:", error);
    }
  };
  
  
    // get posts
    useEffect(() => {
      const fetchPosts = async () => {
        try {
          const response = await fetch(
            `http://localhost:8000/post/${userid}/posts`
          );
          if (response.ok) {
            const postsData = await response.json();
            // console.log("posts list", postsData);
            setPostList(postsData);
          } else {
            console.error("Error fetching posts");
          }
        } catch (error) {
          console.error("Network error:", error);
        }
      };
  
      fetchPosts();
    }, [user.id]);
  
  
  
  

  // const sendMessage = (userIdToSendMessage) => {
  //   // Define your sendMessage logic here
  //   // For example, you can open a messaging component or make an API call to start a conversation
  // };

  const openFollowersPopup = () => {
    setShowFollowersPopup(true);
  };

  const closeFollowersPopup = () => {
    setShowFollowersPopup(false);
  };

  const openFollowingPopup = () => {
    setShowFollowingPopup(true);
  };

  const closeFollowingPopup = () => {
    setShowFollowingPopup(false);
  };

  useEffect(() => {
    // Fetch user profile details by username from the backend
    const fetchUserProfile = async () => {
      try {
        const [profileResponse, followersResponse, followingResponse] =
          await Promise.all([
            fetch(`http://localhost:8000/user/profile/${userid}`),
            fetch(`http://localhost:8000/user/followers/${userid}`),
            fetch(`http://localhost:8000/user/following/${userid}`),
          ]);

        if (profileResponse.ok) {
          const userData = await profileResponse.json();
          setOtherUser(userData);
          checkIfFollowing();
        } else {
          // Handle error
          console.error("Error fetching user profile");
        }

        if (followersResponse.ok) {
          const followersData = await followersResponse.json();
          setFollowersList(followersData.followers);
        } else {
          // Handle error
          console.error("Error fetching followers");
        }

        if (followingResponse.ok) {
          const followingData = await followingResponse.json();
          setFollowingList(followingData.following);
        } else {
          // Handle error
          console.error("Error fetching following");
        }
      } catch (error) {
        // Handle network error
        console.error("Network error:", error);
      }
    };

    fetchUserProfile();
  }, [userid]);

  if (!otherUser) {
    return <div>Loading...</div>; // You can add a loading state or error handling
  }

  // console.log("other user is", otherUser );


  // const handleSendMessage = (userId) => {
  //   // Navigate to the messaging route with the recipient's user ID = 
  //   window.location.href = `/messages/${userId}`;
  // };

  const handleSendMessage = async (userId) => {
    try {
      // Make an API call to check if a room exists for the two users
      const response = await fetch(
        `http://localhost:8000/message/check-room?user1=${user.id}&user2=${userId}`
      );
  
      if (response.ok) {
        const roomData = await response.json();
  
        // Check if a room exists
        if (roomData.roomExists) {
          // If the room exists, navigate to the messaging route with the room ID
          window.location.href = `/messages/${roomData.roomId}`;
        } else {
          // If the room doesn't exist, make an API call to create a new room
          const createRoomResponse = await fetch(
            "http://localhost:8000/message/create-room",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ user1: user.id, user2: userId }),
            }
          );
  
          if (createRoomResponse.ok) {
            const createdRoomData = await createRoomResponse.json();
  
            // Navigate to the messaging route with the newly created room ID
            window.location.href = `/messages/${createdRoomData.roomId}`;
          } else {
            console.error("Error creating room:", createRoomResponse.status);
          }
        }
      } else {
        console.error("Error checking room:", response.status);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };
  



  return (
    <div className={styles.profile}>
      <div className={styles.userProfile}>
        {otherUser.profilepic ? (
          <img
            src={otherUser.profilepic}
            alt={otherUser.username}
            className={styles.profilePicture}
          />
        ) : (
          <img
            src="https://img.icons8.com/fluency/48/test-account.png"
            alt="Default"
            className={styles.profilePicture}
          />
        )}
        <h1 className={styles.username}>{otherUser.username}</h1>
        <p className={styles.name}>{otherUser.name}</p>
        <div className={styles.actionButtons}>
          {isFollowing ? (
            <button
              className={styles.unfollowButton}
              onClick={() => handleUnfollow(userid)}
            >
              Unfollow
            </button>
          ) : (
            <button
              className={styles.followButton}
              onClick={() => followUser(userid)}
            >
              Follow
            </button>
          )}
               <button onClick={() => handleSendMessage(userid)}>Message</button>

        </div>
      </div>
      <div className={styles.userDetails}>
        <p className={styles.userStats}>
          <span>
            <b>{postList.length}</b>
          </span>{" "}
          posts
        </p>
        <p className={styles.userStats} onClick={openFollowersPopup}>
          <span>
            <b>{followersList.length}</b>
          </span>{" "}
          followers
        </p>
        <p className={styles.userStats} onClick={openFollowingPopup}>
          <span>
            <b>{followingList.length}</b>
          </span>{" "}
          following
        </p>
        <p className={styles.bio}>{otherUser.bio}</p>
      </div>

      {showFollowersPopup && (
        <div className={styles.popupContainer} onClick={closeFollowersPopup}>
          <div className={styles.popup}>
            <div className={styles.inDiv}>
              {" "}
              <div>
                <h2>Followers</h2>
              </div>{" "}
              <div className={styles.closeBtn} onClick={closeFollowersPopup}>
                Close
              </div>
            </div>
            <hr />
            <ul className={styles.scrollableList}>
              {followersList.map((follower) => (
                <li key={follower._id}>
                  <img
                    src={
                      follower.profilepic ||
                      "https://img.icons8.com/fluency/48/test-account.png"
                    }
                    alt={follower.username}
                  />
                  <div className={styles.divName}>
                  {user.id === follower._id ? (
                      <Link to="/profile"> {follower.username} <div>{follower.name}</div></Link>
                    ) : (
                      <Link to={`/user/profile/${follower._id}`}>
                        {follower.username} <div>{follower.name}</div>
                      </Link>
                    )}
                   
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {showFollowingPopup && (
        <div className={styles.popupContainer} onClick={closeFollowingPopup}>
          <div className={styles.popup}>
            <div className={styles.inDiv}>
              {" "}
              <div>
                <h2>Following</h2>
              </div>{" "}
              <div className={styles.closeBtn} onClick={closeFollowingPopup}>
                Close
              </div>
            </div>
            <hr />
            <ul className={styles.scrollableList}>
              {followingList.map((following) => (
                <li key={following._id}>
                  <img
                    src={
                      following.profilepic ||
                      "https://img.icons8.com/fluency/48/test-account.png"
                    }
                    alt={following.username}
                  />
                  <div className={styles.divName}>
                    {user.id === following._id ? (
                      <Link to="/profile"> {following.username}<div>{following.name}</div></Link>
                    ) : (
                      <Link to={`/user/profile/${following._id}`}>
                        {following.username}<div>{following.name}</div>
                      </Link>
                    )}
                    
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className={styles.hrDiv}>
        <hr className={styles.hrLine} />
      </div>
      <div className={styles.postsContainer}>
        <img
          className={styles.postsImg}
          src="https://cdn-icons-png.flaticon.com/256/11710/11710467.png"
          alt="posts"
        ></img>
        <b className={styles.postsText}>POSTS</b>{" "}
      </div>

      <div className={styles.postsList}>
        {postList.map((post, index) => (
          <div 
            key={index}
            className={styles.postItem}
            onClick={() => setSelectedImage(post._id)}
          >
            {/* <b>{post._id}</b> */}
            <img
              src={post.image}
              alt={`Post ${index}`}
              className={styles.postImage}
            />
          </div>
        ))}
      </div>


       {selectedImage !== null && (
        <ImagePopup
          imageId={selectedImage} 
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
};

export default UserProfile;
