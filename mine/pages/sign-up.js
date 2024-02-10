import React, { useState } from 'react';
import styles from '../styles/signup.module.css'; 
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';



import { toast } from "react-toastify"; // to add notifications
import "react-toastify/dist/ReactToastify.css";


function SignupForm() {
  const [step, setStep] = useState(1); // Track the registration step
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
  });

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

    if (step === 1) {
      // Check username availability via API (e.g., /api/check-username)
      // If username is available, proceed to the next step
      const isUsernameAvailable = await checkUsernameAvailability(formData.username);
      if (isUsernameAvailable) {
        setStep(2); // Move to the next step
      } else {
        // Display an error message or handle username unavailability
        toast.error("Username take, try different!");
      }
    } else if (step === 2) {
      // Handle email and password submission
      // Validate form data (e.g., check if passwords match)

      // Make an HTTP POST request to your backend to handle user registration
      // You can send formData.username, formData.email, formData.password to your backend
      try {
        const response = await fetch('http://localhost:8000/user/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

  
        if (response.ok) {
          // Registration successful, you can redirect the user or show a success message
          toast.success("User registered successfully");
        } else {
          // Registration failed, handle the error
          if (data.success === false) {
            // Passwords do not match
            toast.error(data.error);
          } else {
            console.error('User registration failed');
          }
        }
      } catch (error) {
        console.error('Error during registration:', error);
      }
    }
  };

  const checkUsernameAvailability = async (username) => {
     
    const response = await fetch(`http://localhost:8000/user/check-username?username=${username}`);
    const data = await response.json();
    return data.isAvailable; 
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

        {step === 1 && (
          <form onSubmit={handleSubmit} className={styles.formContainer}>
            <div>
              <input
                type="text"
                name="username"
                placeholder="Username"
                onChange={handleInputChange}
                className={styles.formInput}
              />
            </div>
            <div>
              <button type="submit" className={styles.submitButton}>
                Next
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className={styles.formContainer}>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                onChange={handleInputChange}
                className={styles.formInput}
              />
            </div>
            <div>
              <input
                type="text"
                name="name"
                placeholder="Name"
                required
                onChange={handleInputChange}
                className={styles.formInput}
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                onChange={handleInputChange}
                className={styles.formInput}
              />
            </div>
            <div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                required
                onChange={handleInputChange}
                className={styles.formInput}
              />
            </div>
            <div>
              <button type="submit" className={styles.submitButton}>
                Sign Up
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default SignupForm;
