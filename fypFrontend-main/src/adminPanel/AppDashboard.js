import React, { useState, useEffect } from "react";
import {Routes, Route, BrowserRouter} from 'react-router-dom'
import Home from "./pages/Home";
import About from "./pages/AboutDashboard";
import Settings from "./pages/Settings";
import Medicines from "./pages/Medicines";
import Account from "./pages/Account";
import UserFeedback from "./pages/UserFeedback";

function App() {


  return (
    <>
    {/* {
      currentUser.role == "admin" ? 
        <h1>admin</h1>
        :
        <h1>404 not found</h1>
    } */}
    {/* <BrowserRouter> */}
    <Routes>
      <Route exact path="/" element={<Home/>}></Route>
      <Route exact path="/donors" element={<About/>}></Route>
      <Route exact path="/recipients" element={<Settings/>}></Route>
      <Route exact path="/medicines" element={<Medicines/>}></Route>
      <Route exact path="/account" element={<Account/>}></Route>
      <Route exact path="/feedback" element={<UserFeedback/>}></Route>
    </Routes>
    {/* </BrowserRouter> */}
    </>
  );
}

export default App;
