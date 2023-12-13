import React from "react";
import { Navigate } from "react-router-dom";
/**
 * ? condition that only if there is token there the children is render
 */
const ProtectedLogin = ({ children }) => {

  if (localStorage.getItem("token")) {
 
    return children;
  }
  return <Navigate to="/signin" replace />;
};

export default ProtectedLogin;
