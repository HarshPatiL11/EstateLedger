import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import './components/CSS/GlobalCss.css'
import Home from "./components/Pages/Home.jsx";
import LoginPage from "./components/Pages/AuthPages/NewLogin.jsx";
import Layout from "./components/Layout/Layout.jsx";
import UserRegister from "./components/Pages/AuthPages/UserRegister.jsx";
import LoginPageB from "./components/Pages/AuthPages/Login3.jsx";
import PropertyFilter from "./components/Pages/FilterComponent.jsx";
import PopularProps from "./components/Pages/PopularPropsAll.jsx";
import UserProfile from "./components/Pages/UserPages/Profile.jsx";
import PropBuy from "./components/Pages/PropsBuyHome.jsx";
import PropertyOnLease from "./components/Pages/PropsLeaseHome.jsx";
import PropertyLocation from "./components/Pages/PropertyLocation.jsx";
import AddProperty from "./components/Pages/OwnerPages/PropertyAdd.jsx";
import PropertyById from "./components/Pages/PropertyById.jsx";
import ADMLogin from "./components/Pages/AdminPages/AdmLogin.jsx";
import UserProfile2 from "./components/Pages/UserPages/Profile2.jsx";
import "@fortawesome/fontawesome-free/css/all.min.css";
import PopularPropsALl from "./components/Pages/PopularPropsAll.jsx";


function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />

          {/* User Routes */}
          <Route path="/user/register" element={<UserRegister />} />
          <Route path="/user/login" element={<LoginPageB />} />
          <Route path="/user/profile" element={<UserProfile2 />} />

          {/* Property routes */}
          <Route
            path="/properties/all-properties"
            element={<PopularPropsALl />}
          />
          <Route path="/properties/filter" element={<PropertyFilter />} />
          <Route path="/properties/Buy" element={<PropBuy />} />
          <Route path="/properties/Rent" element={<PropertyOnLease />} />
          <Route path="/properties/location" element={<PropertyLocation />} />
          <Route path="/properties/get/:id" element={<PropertyById />} />
          {/* Owner Routes */}
          <Route path="/owner/become-owner" />
          <Route path="/owner/property/add" element={<AddProperty />} />
          {/* admin Routes */}
          <Route path="/admin" element={<ADMLogin />} />
          <Route path="/admin/manage/users/:id" />
          <Route path="/admin/manage/properties/all" />
          <Route path="/admin/manage/properties/:id" />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
