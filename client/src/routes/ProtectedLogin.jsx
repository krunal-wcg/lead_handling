import React from "react";
import { Navigate } from "react-router-dom";
import { decodedToken } from "../healpers/getDecodedToken";
/**
 * ? condition that only if there is token there the children is render
 */
const ProtectedLogin = ({ children }) => {

  if (localStorage.getItem("token")) {
 
    return children;
  }
  return <Navigate to="/signup" replace />;
};

export default ProtectedLogin;
