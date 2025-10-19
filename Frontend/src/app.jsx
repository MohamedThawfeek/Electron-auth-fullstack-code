import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./page/home";
import Login from "./page/login";
import Signup from "./page/signup";
import PrivateRoute from "./components/PrivateRoute";
import ForgotPassword from "./page/forgot-password";
import ResetPassword from "./page/reset-password";

const App = () => {
  return (
    <div className="w-screen h-screen">
      <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/" element={<PrivateRoute />}>
            <Route path="/" element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
