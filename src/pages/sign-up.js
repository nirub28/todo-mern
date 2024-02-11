import React, { useState } from "react";
import "../styles/signup.css";
import BASE_URL from "../utils/config";


import { toast } from "react-toastify"; // to add notifications
import "react-toastify/dist/ReactToastify.css";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleUsernameChange = (e) => {
    // console.log("username is", e.target.value);
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const responseData="";
    try {
      // Make API call to add user
      const response = await fetch(`${BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password,
          confirmPassword,
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        // Registration successful, show success message
        toast.success(responseData.message);
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        // Registration failed, show error message from server
        toast.error(responseData.error || "Failed to sign up");
      }
    } catch (error) {
      // Error occurred during API call
      toast.error("Failed to sign up");
    }
  };

  return (
    <div className="container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          className="input"
          value={username}
          required
          onChange={handleUsernameChange}
        />
        <input
          type="password"
          placeholder="Password"
          className="input"
          value={password}
          required
          onChange={handlePasswordChange}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="input"
          value={confirmPassword}
          required
          onChange={handleConfirmPasswordChange}
        />
        <button type="submit" className="button">
          Sign Up
        </button>
      </form>

      <div className="signup-link">Already have an account? <a href='/login'>Sign In</a></div>

    </div>
  );
};

export default SignUp;
