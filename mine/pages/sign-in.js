import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import styles from "../styles/signin.module.css";
import { login } from '../actions/index';
import { Navigate } from 'react-router-dom';



import { toast } from "react-toastify"; // to add notifications
import "react-toastify/dist/ReactToastify.css";

function SigninForm() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const dispatch = useDispatch();
  
  const user = useSelector((state) => state.user.user);




  // Check if the user is already logged in
  if (user) {
    // User is already authenticated, redirect to a specific page (e.g., profile)
    return <Navigate to="/profile" />;
  }


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Handle sign-in logic here
    try {
      // Make an HTTP POST request to your backend for sign-in
      const response = await fetch("http://localhost:8000/user/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usernameOrEmail: formData.username, 
          password: formData.password,
        }),
      });

      if (response.ok) {

        const data = await response.json();

          // Dispatch both user and token
        dispatch(login(data.user));

        // Sign-in successful,redirect the user or show a success message
        toast.success("User signed in successfully");
      } else {
        // Sign-in failed, handle the error
        toast.error("Signin Failed");
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  };


  return (
    <div className={styles.formDiv}>
      <div className={styles.formImage}>
        <img
          src="https://img.freepik.com/free-vector/mobile-chat_24877-50848.jpg?w=740&t=st=1694357398~exp=1694357998~hmac=4aeecc86b2719af4e2f187043268f73569d9a6067136c4963ba9d3db53d77f9a"
          alt="img-tag"
        />
      </div>
      <div className={styles.formDivInn}>
        <h2>
          <b>Pixel Feed</b>
        </h2>

        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <div>
            <input
              type="text"
              name="username"
              placeholder="Username/Email"
              onChange={handleInputChange}
              className={styles.formInput}
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleInputChange}
              className={styles.formInput}
            />
          </div>
          <div>
            <button type="submit" className={styles.submitButton}>
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SigninForm;
