import React from 'react';
import '../styles/signin.css'; 

const Login: React.FC = () => {
  return (
    <div className='container' > 
       
      <h2>Login</h2>
      <form>
        <input type="text" placeholder="Username" className='input' />
        <input type="password" placeholder="Password" className='input' />
        <button type="submit" className='button'>Login</button>
      </form>
    </div>
  );
}

export default Login;
