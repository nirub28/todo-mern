import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "../styles/profile.module.css";
import { Link } from "react-router-dom";
import { updateUser } from "../actions/index";

import ImagePopup from "./imagepop";

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  // const hasProfilePicture = user && user.profilePicture;
  const [showFollowersPopup, setShowFollowersPopup] = useState(false);
  const [showFollowingPopup, setShowFollowingPopup] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false); //showProfileEdit state
  const [ShowProfileSettings,setShowProfileSettings]=useState(false);
  const [followersListDetails, setFollowersList] = useState([]);
  const [followingListDetails, setFollowingList] = useState([]);
  const [postList, setPostList] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const [image, setImage] = useState("");

  // console.log("selectedImage", selectedImage);

  // State variables for profile edit form
  const [profilePicture, setProfilePicture] = useState(
    user.profilePicture || ""
  );

  const [bio, setBio] = useState(user.bio || "");
  const followersList = user.followers || [];
  const followingList = user.following || [];

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

  // Function to handle opening the profile edit form
  const openProfileEdit = () => {
    setShowProfileEdit(true);
  };

  const openProfileSettings = () =>{
    setShowProfileSettings(true);
  }

  // Function to handle closing the profile edit form
  const closeProfileEdit = () => {
    setShowProfileEdit(false);
  };

  const closeSettingsProfileEdit = () =>{
    setShowProfileSettings(false);
  }

  const handleFileInputChange = (e) => {
    e.stopPropagation();
    setProfilePicture(e.target.files[0]);
    converToBase64(e);
  };

  function converToBase64(e) {
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.onerror = (error) => {
      console.log("error", error);
    };
  }

  // get posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/post/${user.id}/posts`
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

  //get user details fo followers and following
  const fetchUserById = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/user/profile/${userId}`
      );
      if (response.ok) {
        const userData = await response.json();
        return userData;
      } else {
        // Handle error
        console.error("Error fetching user profile");
        return null;
      }
    } catch (error) {
      // Handle network error
      console.error("Network error:", error);
      return null;
    }
  };

  // Function to handle profile update form submission
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      if (profilePicture) {
        // Append the image (base64 string) to the form data with the key 'profilePicture'
        formData.append("profilePicture", profilePicture);
      }
      if (bio) {
        // Append the bio to the form data with the key 'bio'
        formData.append("bio", bio);
      }

      // Send the form data to the backend
      const response = await fetch(
        `http://localhost:8000/user/update-profile/${user.id}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const updatedUserData = await response.json();

        // Dispatch the updated data to the reducer or use it as needed
        dispatch(updateUser(updatedUserData.profilepic, updatedUserData.bio));

        setShowProfileEdit(false);
      }
    } catch (error) {
      // Handle network error
      console.error("Network error:", error);
    }
  };

  // Function to fetch and update follower and following details
  const fetchFollowerDetails = async () => {
    const followerDetails = [];
    for (const followerId of followersList) {
      const user = await fetchUserById(followerId);
      if (user) {
        followerDetails.push(user);
      }
    }
    setFollowersList(followerDetails);
  };

  const fetchFollowingDetails = async () => {
    const followingDetails = [];
    for (const followingId of followingList) {
      const user = await fetchUserById(followingId);
      if (user) {
        followingDetails.push(user);
      }
    }
    setFollowingList(followingDetails);
  };

  // Call these functions to fetch follower and following details
  useEffect(() => {
    fetchFollowerDetails();
    fetchFollowingDetails();
  }, []);

  return (
    <div className={styles.profile}>
      <div className={styles.userProfile}>
        {user.profilePicture ? ( // Check if profile picture URL exists
          <img
            src={user.profilePicture} // Use the profile picture URL
            alt={user?.username}
            className={styles.profilePicture}
          />
        ) : (
          <img
            src="https://img.icons8.com/fluency/48/test-account.png"
            alt="Default"
            className={styles.profilePicture}
          />
        )}
        <h1 className={styles.username}>{user.username}</h1>
        <p className={styles.name}>{user.name}</p>
        {/* Render "Edit Profile" button for your own profile */}
        <button className={styles.editProfileButton} onClick={openProfileEdit}>
          Edit Profile
        </button>
        
      </div>
      <img src="https://as2.ftcdn.net/v2/jpg/01/13/94/83/1000_F_113948390_gRY4UwSTxm2bNX8jD2oIjpEuwJPELTTr.jpg" 
          alt="Default"
          className={styles.settingsIcon}
          onClick={openProfileSettings}
        />
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
        <p className={styles.bio}>{user.bio}</p>
      </div>

      {showFollowersPopup && (
        <div className={styles.popupContainer} onClick={closeFollowersPopup}>
          <div className={styles.popup}>
            <div className={styles.inDiv}>
              <div>
                <h2>Followers</h2>
              </div>
              <div className={styles.closeBtn} onClick={closeFollowersPopup}>
                Close
              </div>
            </div>
            <hr />
            <ul className={styles.scrollableList}>
              {followersListDetails.map((follower) => (
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
                      <Link to="/profile">
                        {" "}
                        {follower.username}
                        <div>{follower.name}</div>
                      </Link>
                    ) : (
                      <Link to={`/user/profile/${follower._id}`}>
                        {follower.username}
                        <div>{follower.name}</div>
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
              <div>
                <h2>Following</h2>
              </div>
              <div className={styles.closeBtn} onClick={closeFollowingPopup}>
                Close
              </div>
            </div>
            <hr />
            <ul className={styles.scrollableList}>
              {followingListDetails.map((following) => (
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
                      <Link to="/profile">
                        {" "}
                        {following.username}
                        <div>{following.name}</div>
                      </Link>
                    ) : (
                      <Link to={`/user/profile/${following._id}`}>
                        {following.username}
                        <div>{following.name}</div>
                      </Link>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      { ShowProfileSettings && (
         <div className={styles.settingsPopupContainer}>
          <p><a className={styles.atagbluetick}
           href="/bluetick"
          >Buy Bluetick</a></p>
          <div className={styles.line}></div>
          <p>Change Password</p>
          <div className={styles.line}></div>
          <p>Settings & Privacy</p>
          <div className={styles.line}></div>
          <p>Log Out</p>
          <div className={styles.line}></div>
          <p className={styles.closeBtnOfSettings} onClick={closeSettingsProfileEdit}>
           Cancel
          </p>
           
        </div>) }

      {showProfileEdit && (
        // Profile edit form
        <div className={styles.popupContainer}>
          <div className={styles.popup}>
            <div className={styles.inDiv}>
              <div>
                <h2>Edit Profile</h2>
              </div>
              <div className={styles.closeBtn} onClick={closeProfileEdit}>
                Close
              </div>
            </div>
            <hr />
            <form
              className={styles.profileEditForm}
              encType="multipart/form-data"
            >
              <label htmlFor="profilePicture">Profile Picture:</label>
              <input
                type="file"
                id="profilePicture"
                accept="image/*" // to Specify that only image files are allowed
                onChange={handleFileInputChange}
                //onChange={converToBase64}
              />
              {image == "" || image == null ? (
                ""
              ) : (
                <img width={100} height={100} src={image} />
              )}

              <label htmlFor="bio">Bio:</label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
              <button
                type="button"
                className={styles.saveProfileButton}
                onClick={handleProfileUpdate}
              >
                Save
              </button>
            </form>
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

export default Profile;
