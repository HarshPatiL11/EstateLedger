import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../CSS/Layout.css"; // Create this CSS file to style the layout

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="main-content">{children}</main> {/* Add this */}
      <Footer />
    </>
  );
};

export default Layout;
