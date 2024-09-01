import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./components/Pages/Home.jsx";
import PopularProps from "./components/Pages/PopularProps.jsx";

function App() {
  return (
      <Routes>

        <Route path="/" element={<>
        <Home/>
        </>} />
       
      </Routes>
  );
}

export default App;
