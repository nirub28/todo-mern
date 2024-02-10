import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "../styles/ImagePopup.module.css";
import { formatDistanceToNow, format } from "date-fns";

const ImagePopup = ({ imageId, onClose }) => {
  const userhere = useSelector((state) => state.user.user);
  const [imageDetails, setImageDetails] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState(""); // Store the new comment input
  const [likes, setLikes] = useState({ count: 0, likedByUser: false });
  const [post, setPost] = useState(null);
  const [user, setUser] = useState({});

  // console.log("user is",user);

  const [commentToDelete, setCommentToDelete] = useState(null);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    // Send a POST request to the API endpoint to add the comment
    try {
      const response = await fetch(`http://localhost:8000/post/add-comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: imageId, // Pass the ID of the post to which the comment belongs
          text: newComment, // The text of the comment
          userId: userhere.id,
        }),
      });

      if (response.ok) {
        // Comment added successfully, update the comments in the state
        const addedComment = await response.json(); // Assuming your backend sends the added comment as JSON

        setComments([...comments, addedComment]);
        setNewComment(""); // Clear the input field after adding the comment
      } else {
        console.error("Error adding comment:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
    
    if(userhere.id !== user._id){
      await sendNotification(user._id, "comment");
    }
    };

  // Function to fetch and display comments
  const fetchAndDisplayComments = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/post/info/${imageId}`
      );

      if (response.ok) {
        const data = await response.json();
        setComments(data.comments);
      } else {
        console.error("Error fetching image details:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching image details:", error);
    }
  };

  // Call fetchAndDisplayComments when the component mounts
  useEffect(() => {
    fetchAndDisplayComments();
    fetchLikesData();
  }, [imageId]);

  // Function to open the popup for a comment
  const openPopup = (commentIndex) => {
    setCommentToDelete(commentIndex);
  };

  const closePopup = () => {
    setCommentToDelete(null);
  };

  const fetchLikesData = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/post/likes/${imageId}`
      );

      if (response.ok) {
        const likesData = await response.json();
        setLikes({
          count: likesData.count,
          likedByUser: likesData.users.includes(userhere.id),
        });
      } else {
        console.error("Error fetching likes data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching likes data:", error);
    }
  };

  // Function to handle comment deletion
  const deleteComment = async (commentId) => {
    try {
      // Make an API call to delete the comment on the server
      const response = await fetch(
        `http://localhost:8000/post/delete-comment/${imageId}/${commentId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // If the deletion was successful on the server, remove the comment from the list
        setComments((prevComments) =>
          prevComments.filter((comment) => comment._id !== commentId)
        );

        // Close the popup
        setCommentToDelete(null);
      } else {
        console.error("Error deleting comment:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  useEffect(() => {
    // Define an async function to fetch image details and comments
    const fetchImageDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/post/info/${imageId}`
        );

        if (response.ok) {
          const data = await response.json();
          setPost(data);
          setImageDetails(data);
          setComments(data.comments);
          getUserDetails(data.user);
        } else {
          console.error("Error fetching image details:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching image details:", error);
      }
    };

    // Call the async function to fetch image details and comments
    fetchImageDetails();
  }, [imageId]);

  const getUserDetails = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/user/profile/${userId}`
      );

      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        console.error("Error fetching user details:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  if (!imageDetails) {
    return null; // Loading or error handling can be added here
  }

  const handleLikeClick = async () => {
    try {
      // Send a POST request to the API endpoint to add or remove a like
      var likeorunlike = 0;
      const response = await fetch(
        `http://localhost:8000/post/like/${imageId}`,
        {
          method: "POST", // You might want to use DELETE if you're toggling the like
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userhere.id,
          }),
        }
      );

      if (response.ok) {
        // Like action was successful, update the likes count and likedByUser
        const updatedLikesData = await response.json();
        setLikes({
          count: updatedLikesData.count,
          likedByUser: updatedLikesData.users.includes(userhere.id),
        });
        likeorunlike = updatedLikesData.likeorunlike;
      } else {
        console.error("Error handling like:", response.statusText);
      }
    } catch (error) {
      console.error("Error handling like:", error);
    }
    if(userhere.id !== user._id && likeorunlike === -1){
      await sendNotification(user._id, "like");
    }
  };






  // Function to send a notification to the post owner
const sendNotification = async (receiverId, type) => {
  try {
    await fetch("http://localhost:8000/notification/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        senderId: userhere.id,
        receiverId,
        type,
        postId: post._id,
      }),
    });
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};


  return (
    <div className={styles.imagePopupOverlay}>
      <div className={styles.imagePopup}>
        <div className={styles.imageContainer}>
          <img src={imageDetails.image} alt="Post" className={styles.image} />
        </div>
        <div className={styles.userInfo}>
          <div className={styles.userProfile}>
            <img
              src={
                user.profilepic ||
                "https://img.icons8.com/fluency/48/test-account.png"
              }
              alt="User Profile"
              className={styles.userProfilePic}
            />
            <p
              className={`${styles.username} ${styles.commentUsername}`}
              onClick={() =>
                (window.location.href =
                  user._id === userhere.id
                    ? `/profile`
                    : `/user/profile/${user._id}`)
              }
            >
              {user.username}
            </p>
          </div>
          <p className={styles.caption}>
            <b>Caption:</b> {imageDetails.caption}
          </p>
          <hr />
          <div className={styles.commentsSection}>
            {comments.length === 0 ? (
              <>
                <p className={styles.noComments}>
                  <b>No comments yet.</b>
                </p>
                <p className={styles.startConversation}>
                  Start the conversation below
                </p>
              </>
            ) : (
              comments.map((comment, index) => (
                <div key={index} className={styles.comment}>
                  <div className={styles.commentHeader}>
                    <div className={styles.commentUser}>
                      <img
                        src={
                          comment.profilepic || "https://img.icons8.com/fluency/48/test-account.png"
                        }
                        alt="User Profile"
                        className={styles.commentUserProfilePic}
                      />
                      <p
                        className={styles.commentUsername}
                        onClick={() =>
                          (window.location.href =
                            comment.user === userhere.id
                              ? `/profile`
                              : `/user/profile/${comment.user}`)
                        }
                      >
                        {comment.username}
                      </p>{" "}
                      &nbsp;&nbsp;
                      <div className={styles.commentText}>{comment.text}</div>
                    </div>
                    <div className={styles.commentOptions}>
                      <div className={styles.commentTime}>
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                        })}
                      </div>
                      <span
                        className={styles.commentOptionsDots}
                        onClick={() => openPopup(index)} // Open the popup
                      >
                        ...
                      </span>
                    </div>
                  </div>

                  {commentToDelete === index && (
                    <div className={styles.commentPopup}>
                      {comment.user === userhere.id ? (
                        <span
                          className={styles.commentDelete}
                          onClick={() => deleteComment(comment._id)}
                        >
                          Delete Comment
                        </span>
                      ) : null}
                      <span
                        className={styles.commentCancel}
                        onClick={closePopup}
                      >
                        Cancel
                      </span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
          <hr />
          <div className={styles.myDiv}>
            <div className={styles.likesAndComments}>
              {likes.likedByUser ? (
                // Display the liked icon
                <img
                  src="https://cdn-icons-png.flaticon.com/256/833/833558.png"
                  alt="Liked"
                  className={styles.likesIcon}
                  onClick={handleLikeClick}
                />
              ) : (
                // Display the not liked icon
                <img
                  src="https://cdn-icons-png.flaticon.com/256/2961/2961957.png"
                  alt="Likes"
                  className={styles.likesIcon}
                  onClick={handleLikeClick}
                />
              )}

              <img
                src="https://cdn-icons-png.flaticon.com/256/3031/3031126.png"
                alt="Comments"
                className={styles.commentsIcon}
              />
              <div>
                {" "}
                {likes.count === 1
                  ? `${likes.count} like,`
                  : `${likes.count} likes,`}
              </div>
              <div className={styles.postDate}>
                &nbsp;
                {format(new Date(post.createdAt), "MMMM d, yyyy")}
              </div>
            </div>
          </div>
          <hr />
          <form className={styles.commentForm} onSubmit={handleCommentSubmit}>
            <input
              type="text"
              placeholder="Add a comment..."
              className={styles.commentInput}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button type="submit" className={styles.commentSubmit}>
              Post
            </button>
          </form>
          <b onClick={onClose} className={styles.closeButton}>
            X
          </b>
        </div>
      </div>
    </div>
  );
};

export default ImagePopup;
