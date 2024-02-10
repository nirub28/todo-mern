import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/home.css';

const HomePage = () => {
  return (
    <div className="container">
      <h2>Welcome to ToDo App</h2>
      <div className="buttons">
        <Link to="/login">
          <button>Sign In</button>
        </Link>
        <Link to="/signup">
          <button>Sign Up</button>
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
