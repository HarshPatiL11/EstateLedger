import React from "react";
import Layout from "../Layout/Layout.jsx";
import "../CSS/Home.css";
import PopularPropsHomeCard from "./PopularPropsHomeCard.jsx";

import PropertyLocationCard from "./PropertyLocationCard.jsx";
import InterestedUsersList from "./OwnerPages/InterestedUsersList.jsx";
import NewHome from "./NewPages/NewHome.jsx";

const Home = () => {
  return (
    <>
      {/* <div className="HomeMain">
        <div className="HomeContent">
          <p>Find Your Dream</p>
        </div>
      </div> */}
      <NewHome/>
      <PopularPropsHomeCard />
      <PropertyLocationCard />
    </>
  );
};

export default Home;
