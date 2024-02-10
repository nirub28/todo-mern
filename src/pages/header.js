import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LOGOUT } from '../actions';
import "../styles/header.css";

import { toast } from "react-toastify"; // to add notifications
import "react-toastify/dist/ReactToastify.css";


const Header = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.user.isLoggedIn);
  const user = useSelector(state => state.user); 

//   console.log("det", user);


  const handleLogout = () => {
    // Dispatch action to clear user data
    dispatch({ type: LOGOUT });
    window.location.href = "/login";
    toast.success("Logged out");
  };

  return (
    <div className="header">
      <h1>{user.currentUser ? user.currentUser.username : ""}</h1>
      {isLoggedIn ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <div>Not logged in</div>
      )}
    </div>
  );
};

export default Header;
