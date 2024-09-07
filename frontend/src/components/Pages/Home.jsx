import React from "react";
import Layout from "../Layout/Layout.jsx";
import "../CSS/Home.css";
import PopularPropsHomeCard from "./PopularPropsHomeCard.jsx";

import PropBuy from "./PropsBuyHome.jsx";
import PropertyOnLease from "./PropsLeaseHome.jsx";
import PropertyLocationCard from "./PropertyLocationCard.jsx";
import PropertyList from "./OwnerPages/ManageProps.jsx";

const Home = () => {
  return (
    <>
      <div className="HomeMain">
        <div className="HomeContent">
          <p>Find Your Dream</p>
        </div>
      </div>
      <PopularPropsHomeCard />
      <PropertyLocationCard />
      <PropBuy />
      <PropertyOnLease />
      <PropertyList/>
    </>
  );
};

export default Home;
