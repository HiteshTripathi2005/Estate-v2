import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Upload from "./pages/Upload";
import { useAuthStore } from "./store/auth.store";
import Properties from "./pages/Properties";
import Demo from "./pages/Demo";
import Map from "./pages/Map";
import PropertyInfo from "./pages/PropertyInfo";
import EditProperty from "./pages/EditProperty";
import Chat from "./pages/Chat";
import SyncLoader from "react-spinners/esm/SyncLoader";
import WatchList from "./pages/WatchList";
import Purchase from "./pages/Purchase";
import Comparison from "./pages/Comparison";
import ComparisonIndicator from "./components/common/ComparisonIndicator";
import MortgageCalculator from "./pages/MortgageCalculator";

const App = () => {
  const { user, fetchUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isDataFetched, setIsDataFetched] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsLoading(true);
        await fetchUser();
        setIsDataFetched(true);
      } catch (error) {
        console.error("Error fetching user", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, [fetchUser]);

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>
          <SyncLoader size={10} />
        </div>
      </div>
    );

  if (!isDataFetched) {
    return null;
  }

  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to={"/properties"} /> : <Home />}
        />
        <Route
          path="/login"
          element={user ? <Navigate to={"/properties"} /> : <Login />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to={"/properties"} /> : <Register />}
        />
        <Route
          path="/profile"
          element={user ? <Profile /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/upload"
          element={user ? <Upload /> : <Navigate to={"/"} />}
        />
        <Route
          path="/properties"
          element={user ? <Properties /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/properties/:id"
          element={user ? <PropertyInfo /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/properties/edit/:id"
          element={user ? <EditProperty /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/map"
          element={user ? <Map /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/chat"
          element={user ? <Chat /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/chat/:id"
          element={user ? <Chat /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/watchlist"
          element={user ? <WatchList /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/purchase"
          element={user ? <Purchase /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/comparison"
          element={user ? <Comparison /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/mortgage-calculator"
          element={user ? <MortgageCalculator /> : <Navigate to={"/login"} />}
        />
        <Route path="/demo" element={<Demo />} />
      </Routes>
      <ComparisonIndicator />
      <Toaster />
    </div>
  );
};

export default App;
