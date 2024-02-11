import React, { useState , useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LOGIN } from '../actions'; 
import '../styles/signin.css';
import { toast } from 'react-toastify';
import BASE_URL from "../utils/config";


const SignIn = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const user = useSelector(state => state.user); 

  // console.log("base url is", BASE_URL);

  useEffect(() => {
    // Check if user data is present in the store
    if (user.isLoggedIn) {
      // User already logged in, redirect to the todo application
      window.location.href = "/todo";
    }
  }, [user]);

  
  const signIn = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
  
      const responseData = await response.json();

  
      if (response.ok) {
        // Registration successful, show success message

        toast.success("Logged In");

        // toast.success(responseData.message);
  
        // Dispatch action to update Redux store with user information
        if (responseData.token) {
          dispatch({
               type:LOGIN,
               payload: { token: responseData.token, username: responseData.username }
              });
        }  


        setTimeout(() => {
          window.location.href = "/todo";
        }, 2000);
       
      } else {
        if (response.status === 401 || response.status === 404 ) {
          toast.error("Username or Password Mismatch");
        } else {
          // Registration failed, show error message from server
          toast.error(responseData.error || "Failed to sign in");
        }  
      }
    } catch (error) {
      // Error occurred during API call
      toast.error("Failed to sign in");
    }
  };

  

  

  return (
    <div className='container'>
      <h2>Login</h2>
      <form onSubmit={signIn}>
        <input
          type="text"
          placeholder="Username"
          className='input'
          value={username}
          required
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className='input'
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className='button'>Login</button>
      </form>

      <div className="signup-link">Don't have an account? <a href='/signup'>Sign Up</a></div>
    </div>
  );
}

export default SignIn;
