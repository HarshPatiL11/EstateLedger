import React from "react";
import Layout from "../Layout/Layout.jsx";
import "../CSS/Home.css";
import PopularProps from "./PopularProps.jsx";

const Home = () => {
  return (
    <Layout>
      <div className="HomeMain">
        <div className="HomeContent">
          <p>Find Your Dream</p>
        </div>
      </div>
      <PopularProps/> 
    </Layout>
  );
};

export default Home;
