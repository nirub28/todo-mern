import React, { useState } from 'react';
import axios from 'axios';
import '../styles/signin.css'; 

const SignIn: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/signin', { username, password });
      const { token } = response.data;

      // Storing the username and token in local storage
      localStorage.setItem('username', username);
      localStorage.setItem('token', token);

    } catch (error) {
      console.error('Error signing in:', error);
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
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className='input'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className='button'>Login</button>
      </form>
    </div>
  );
}

export default SignIn;
