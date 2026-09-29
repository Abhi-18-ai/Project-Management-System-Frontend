
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  // Authentication check 
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-white text-lg">
          Loading...
        </p>
      </div>
    );
  }

  // if user not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // User authenticated 
  return <Outlet />;
};

export default ProtectedRoute;

