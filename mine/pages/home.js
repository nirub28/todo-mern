import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "../styles/home.module.css";
import ImagePopup from "./imagepop";

const Home = () => {
  const user = useSelector((state) => state.user.user);
  const [followedUsers, setFollowedUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  // console.log("posts",posts );

  useEffect(() => {
    // Ensure user and followedUsers are both populated before fetching posts
    if (user && user.following) {
      setFollowedUsers(user.following);
    }
  }, [user]);

  useEffect(() => {
    if (followedUsers.length > 0) {
      // Fetch posts for followed users when 'followedUsers' changes
      const fetchPostsForFollowedUsers = async () => {
        try {
          const userIds = followedUsers.map((followedUser) => followedUser);
          userIds.push(user.id);// Add the user's own ID to the list

          const response = await fetch(
            `http://localhost:8000/post/all/?userIds=${userIds.join(",")}`
          );

          if (response.status === 200) {
            const data = await response.json();
            setPosts(data);
          } else {
            console.error("Error fetching posts:", response.statusText);
          }
        } catch (error) {
          console.error("Error fetching posts:", error);
        }
      };

      fetchPostsForFollowedUsers();
    }
  }, [followedUsers]);

  const handleLikeClick = async (imageId) => {
    // e.preventDefault();
    try {
      // Send a POST request to the API endpoint to add or remove a like
      const response = await fetch(
        `http://localhost:8000/post/liking/${imageId}`,
        {
          method: "POST", // You might want to use DELETE if you're toggling the like
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
          }),
        }
      );

      if (response.ok) {
        // Like action was successful, update the likes count and likedByUser

        // Assuming the response contains the updated post data
        const updatedPost = await response.json();

        // Find the index of the post in the posts array
        const postIndex = posts.findIndex(
          (post) => post._id === updatedPost._id
        );

        if (postIndex !== -1) {
          // Create a new array of posts with the updated post
          const updatedPosts = [...posts];
          updatedPosts[postIndex] = updatedPost;

          // Update the posts state with the new array
          setPosts(updatedPosts);
        }
      } else {
        console.error("Error handling like:", response.statusText);
      }
    } catch (error) {
      console.error("Error handling like:", error);
    }
  };

  // console.log("posts", posts);

  return (
    <div className={styles.profile}>
      <div className={styles.content}>
        {posts.map((post) => (
          <div key={post._id} className={styles.post}>
            <div className={styles.userInfo}>
              <img
                src={
                  post.user.profilepic ||
                  "https://img.icons8.com/fluency/48/test-account.png"
                }
                alt="User Profile"
                className={styles.userProfilePic}
              />
              <p
                className={`${styles.username} ${styles.commentUsername}`}
                onClick={() =>
                  (window.location.href =
                    post.user._id === user.id
                      ? `/profile`
                      : `/user/profile/${post.user._id}`)
                }
              >
                {post.user.username}
              </p>
            </div>
            <img src={post.image} alt="Post" className={styles.postImage} />
            <div className={styles.likesAndComments}>
              {post.likes.includes(user.id) ? (
                // Display the liked icon
                <img
                  src="https://cdn-icons-png.flaticon.com/256/833/833558.png"
                  alt="Liked"
                  className={styles.likesIcon}
                  onClick={() => handleLikeClick(post._id)}
                />
              ) : (
                // Display the not liked icon
                <img
                  src="https://cdn-icons-png.flaticon.com/256/2961/2961957.png"
                  alt="Likes"
                  className={styles.likesIcon}
                  onClick={() => handleLikeClick(post._id)}
                />
              )}

              <img
                src="https://cdn-icons-png.flaticon.com/256/3031/3031126.png"
                alt="Comments"
                className={styles.commentsIcon}
                onClick={() => setSelectedImage(post._id)}
              />
              <div className={styles.likesCount}>
                {" "}
                {post.likes.length === 1
                  ? `${post.likes.length} like`
                  : `${post.likes.length} likes`}
              </div>
            </div>
            <div className={styles.lastDiv}>
              {" "}
              <span
                className={`${styles.postUsername} ${styles.commentUsername}`}
                onClick={() =>
                  (window.location.href =
                    post.user._id === user.id
                      ? `/profile`
                      : `/user/profile/${post.user._id}`)
                }
              >
                {post.user.username}
              </span>{" "}
              &nbsp; <span>{post.caption}</span>
            </div>
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

export default Home;
