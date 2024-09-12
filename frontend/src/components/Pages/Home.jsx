import React from "react";
import Layout from "../Layout/Layout.jsx";
import "../CSS/Home.css";
import PopularPropsHomeCard from "./PopularPropsHomeCard.jsx";

import PropertyLocationCard from "./PropertyLocationCard.jsx";
import InterestedUsersList from "./OwnerPages/InterestedUsersList.jsx";

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
      <InterestedUsersList/>
    </>
  );
};

export default Home;
