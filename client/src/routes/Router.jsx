import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { GlobalNav } from "../common/global-nav";
import { sidebarRoutes } from "../lib/demos";
import Dashboard from "../pages/Dashboard";
import LeadList from "../pages/LeadList";
import NotFound from "../pages/NotFound";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import UsersList from "../pages/UsersList";
import ProtectedLogin from "./ProtectedLogin";
import ProtectedLogout from "./ProtectedLogout";

const Router = () => {
  const location = useLocation()
  return (
    <>
      {sidebarRoutes?.includes(location?.pathname) && <GlobalNav />}
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedLogin>
              <Dashboard />
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
              <SignUp />
            </ProtectedLogout>
          }
        />
        <Route path="/dashboard">
          <Route
            index
            element={
              <ProtectedLogin>
                <Dashboard />
              </ProtectedLogin>
            }
          />
        </Route>
        <Route path="/leads">
          <Route
            index
            element={
              <ProtectedLogin>
                <LeadList />
              </ProtectedLogin>
            }
          />
        </Route>
        <Route path="/users">
          <Route
            index
            element={
              <ProtectedLogin>
                <UsersList />
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
    </>
  );
};

export default Router;
