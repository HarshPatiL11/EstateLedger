import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./App.css";
import Home from "./components/Pages/Home.jsx";
import Login from "./components/Pages/Login.jsx";
import LoginPage from "./components/Pages/NewLogin.jsx";
import Layout from "./components/Layout/Layout.jsx";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        {" "}
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
                <LoginPage />
              </>
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
