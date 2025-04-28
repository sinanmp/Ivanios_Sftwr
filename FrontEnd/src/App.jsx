import { SidebarProvider } from "./context/SidebarContext";
import LayoutRoutes from "./routes/LayoutRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <SidebarProvider>
      <LayoutRoutes />
      <ToastContainer />
    </SidebarProvider>
  );
}

export default App;
