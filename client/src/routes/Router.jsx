import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../Home";
import LeadList from "../pages/LeadList";
import NotFound from "../pages/NotFound";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import ProtectedLogout from "./ProtectedLogout";
import ProtectedLogin from "./ProtectedLogin";

const Router = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedLogin>
            {" "}
            <Home />
          </ProtectedLogin>
        }
      />
      <Route
        path="/signin"
        element={
          <ProtectedLogout>
            <SignIn />
          </ProtectedLogout>
        }
      />
      <Route
        path="/signup"
        element={
          <ProtectedLogout>
            {" "}
            <SignUp />{" "}
          </ProtectedLogout>
        }
      />
      <Route path="/list">
        <Route
          index
          element={
            <ProtectedLogin>
              {" "}
              <LeadList />
            </ProtectedLogin>
          }
        />
      </Route>
      <Route
        path="*"
        element={
          <ProtectedLogin>
            <NotFound />
          </ProtectedLogin>
        }
      />
    </Routes>
  );
};

export default Router;
