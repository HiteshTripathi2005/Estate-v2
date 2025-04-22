import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Activities from "./pages/Activities";
import { Toaster } from "react-hot-toast";
import useAdminStore from "./store/useAdmin";
import Users from "./pages/Users";
import Properties from "./pages/Properties";

const App = () => {
  const { admin } = useAdminStore();

  return (
    <div>
      <Routes>
        <Route path="/" element={admin ? <Home /> : <Navigate to="/login" />} />
        <Route
          path="/activities"
          element={admin ? <Activities /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={admin ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/users"
          element={admin ? <Users /> : <Navigate to="/login" />}
        />
        <Route
          path="properties"
          element={admin ? <Properties /> : <Navigate to="/login" />}
        />

        <Route
          path="/register"
          element={admin ? <Navigate to="/" /> : <Register />}
        />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
