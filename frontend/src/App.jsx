import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./App.css";
import Home from "./components/Pages/Home.jsx";
import LoginPage from "./components/Pages/NewLogin.jsx";
import Layout from "./components/Layout/Layout.jsx";
import UserRegister from "./components/Pages/UserRegister.jsx";
import LoginPageB from "./components/Pages/Login3.jsx";
import PropertyFilter from "./components/Pages/FilterComponent.jsx";

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
                <LoginPageB />
              </>
            }
          />
          <Route
            path="/filter"
            element={
              <>
                <PropertyFilter />
              </>
            }
          />
          <Route
            path="/register"
            element={
              <>
                <UserRegister />
              </>
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
