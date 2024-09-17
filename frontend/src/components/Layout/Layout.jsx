import React from "react";
import Navbar from "./Navbar";
import "../CSS/Layout.css";
import Footer2 from "./Footer2";
import NewHeader1 from "./NewHeader1";
const Layout = ({ children }) => {
  return (
    <div className="layout-container">
      {/* <Navbar /> */}
      <NewHeader1/>
      <main className="main-content">{children}</main>
      <Footer2  />
    </div>
  );
};

export default Layout;
