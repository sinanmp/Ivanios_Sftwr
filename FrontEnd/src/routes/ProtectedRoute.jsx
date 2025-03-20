import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Spinner/>; // Show loading screen until user data is fetched
  }

  return user ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
