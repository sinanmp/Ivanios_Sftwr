import { useState } from "react";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import LayoutRoutes from "./routes/LayoutRoutes";

function App() {
  return (
    <>
      {/* <Login/> */}
      <BrowserRouter>
         <LayoutRoutes/>
      </BrowserRouter>
    </>
  );
}

export default App;
