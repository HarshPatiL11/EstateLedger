import React from "react";
import Layout from "../Layout/Layout.jsx";
import "../CSS/Home.css";
import PopularProps from "./PopularProps.jsx";
import { PropertyLocationCard } from "./PropertyLocationCard.jsx";
import PropBuy from "./PropsBuy.jsx";
import PropertyOnLease from "./PropsLease.jsx";

const Home = () => {
  return (
    <>
      <div className="HomeMain">
        <div className="HomeContent">
          <p>Find Your Dream</p>
        </div>
      </div>
      <PopularProps />
      <PropertyLocationCard/>
      <PropBuy/>
      <PropertyOnLease/>
    </>
  );
};

export default Home;
