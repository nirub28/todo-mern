import React, { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import styles from '../styles/CreatePost.module.css';

const CreatePost = () => {
  const user = useSelector((state) => state.user.user);
  const [step, setStep] = useState(1);
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [postPicture, setPostPicture] = useState(null);

  const handleImageChange = (e) => {

    e.stopPropagation();
    setPostPicture(e.target.files[0]);
    converToBase64(e);

    // Move to the next step when an image is selected
    setStep(2);
  };

  // create base 64
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

  const handleCaptionChange = (e) => {
    setCaption(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if both image and caption are provided
    if (image && caption) {
      try {
        // Create a FormData object to send the image and caption
        const formData = new FormData();
        formData.append('Picture', postPicture); // Assuming 'image' is the key for the image file
        formData.append('caption', caption);
  
        // Make an API call to send the data to the server
        const response = await fetch(`http://localhost:8000/post/create/${user.id}`, {
          method: 'POST',
          body: formData,
        });
  
        if (response.ok) {
          // Handle the success case here, e.g., show a success message
          console.log('Post created successfully');
          // Reset form fields if needed
          setImage(null);
          setCaption('');
          // Move back to the first step
          setStep(1);
          <Navigate to="/profile" />
        } else {
          // Handle the error case here, e.g., show an error message
          console.error('Failed to create a post');
        }
      } catch (error) {
        // Handle network error
        console.error('Network error:', error);
      }
    } else {
      // Handle form validation or show an error message to the user.
      console.error('Image and caption are required.');
    }
  };
  

  return (
    <div className={styles.createPost}>
      <h2 className={styles.h2}>Create a Post</h2>
      {step === 1 && (
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className={styles.formGroup}>
            <label htmlFor="postImage">Choose an Image:</label>
            <input
              type="file"
              id="postImage"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
          </div>
          <button className={styles.createBtn}  type="submit">Next</button>
        </form>
      )}
      {step === 2 && (
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className={styles.div1} >
             {image == "" || image == null ? (
                ""
              ) : (
                <img className={styles.innImg} src={image} />
              )}
          <div className={styles.formGroup}>
            <label htmlFor="caption">Caption:</label>
            <textarea
            className={styles.captionInput}
              id="caption"
              value={caption}
              onChange={handleCaptionChange}
              required
              placeholder='Write a caption...'
            />
          </div>
          </div>
          <button className={styles.createBtn} type="submit">Create Post</button>
        </form>
      )}
    </div>
  );
};

export default CreatePost;
