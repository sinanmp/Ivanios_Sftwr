import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Login from "./components/Login";
import Sidebar from "./components/Sidebar";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <>
      {/* <Login/> */}
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    </>
  );
}

export default App;
