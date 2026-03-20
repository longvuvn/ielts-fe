import { React } from "react";
import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";
import HomePage from "./pages/Home";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <Header />
      {/* <HomePage /> */}
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
