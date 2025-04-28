import { useState } from "react";
import "./App.css";
import LayoutRoutes from "./routes/LayoutRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      {/* <Login/> */}
      <ToastContainer />
      <LayoutRoutes />
    </>
  );
}

export default App;
