import React from 'react';
import {Routes, Route} from 'react-router-dom';
import HomePage from '../pages/home';
import Login from '../pages/sign-in';
import SignUp from '../pages/sign-up';

const App: React.FC = () => {
  return (
    <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
}

export default App;
