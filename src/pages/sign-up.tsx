import React from 'react';
import '../styles/signup.css'; 

const SignUp: React.FC = () => {
  return (
    <div className='container'>
      <h2>Sign Up</h2>
      <form>
        <input type="text" placeholder="Username" className='input'  />
        <input type="password" placeholder="Password" className='input'  />
        <input type="password" placeholder="Confirm Password"  className='input' />
        <button type="submit" className='button'>Sign Up</button>
      </form>
    </div>
  );
}

export default SignUp;
