import React from "react";
import Header from "./components/layouts/Header/index.jsx";
import Footer from "./components/layouts/Footer";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
