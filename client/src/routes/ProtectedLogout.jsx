import React from "react";
import { Navigate } from "react-router-dom";
/**
 * ? condition that  if there is  token is not there the children is render
 */
const ProtectedLogout = ({ children }) => {
  if (!localStorage.getItem('token')) {
    return children;
  }
  return <Navigate to="/" replace />;
};

export default ProtectedLogout;
