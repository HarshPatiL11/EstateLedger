import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./components/Pages/Home.jsx";
import PopularProps from "./components/Pages/PopularProps.jsx";
import Login from "./components/Pages/Login.jsx";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <Home />
          </>
        }
      />
      <Route
        path="/login"
        element={
          <>
            <Login />
          </>
        }
      />
    </Routes>
  );
}

export default App;
