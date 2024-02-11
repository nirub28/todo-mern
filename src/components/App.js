import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/home";
import Login from "../pages/sign-in";
import SignUp from "../pages/sign-up";
import Header from "../pages/header";
import ToDo from "../pages/todo";
import { useSelector } from 'react-redux';


import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";

const App = () => {

  const isAuthenticated = useSelector(state => state.user.isLoggedIn);

  return (
    <div>
      <ToastContainer // for notifications
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/todo" element={<>
          <Header />
          <ToDo />
        </>} />
      </Routes>
    </div>
  );
};

export default App;
