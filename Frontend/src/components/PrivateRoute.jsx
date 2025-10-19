import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";

const PrivateRoute = () => {
  const navigate = useNavigate();
  const { userDetails } = useSelector((state) => state.users);

  console.log("userDetails", userDetails);

  useEffect(() => {
    if (!userDetails) {
      navigate("/login");
    }
  }, [userDetails, navigate]);

  return userDetails ? <Outlet /> : null;
};

export default PrivateRoute;
