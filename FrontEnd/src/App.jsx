import { useState } from "react";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import LayoutRoutes from "./routes/LayoutRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      {/* <Login/> */}
      <BrowserRouter>
      <ToastContainer />
         <LayoutRoutes/>
      </BrowserRouter>
    </>
  );
}

export default App;
