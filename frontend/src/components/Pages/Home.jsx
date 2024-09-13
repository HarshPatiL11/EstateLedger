import React from "react";
import Layout from "../Layout/Layout.jsx";
import "../CSS/Home.css";
import PopularPropsHomeCard from "./PopularPropsHomeCard.jsx";

import PropertyLocationCard from "./PropertyLocationCard.jsx";
import InterestedUsersList from "./OwnerPages/InterestedUsersList.jsx";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

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
      <ToastContainer/>
      {/* <InterestedUsersList/> */}
    </>
  );
};

export default Home;
