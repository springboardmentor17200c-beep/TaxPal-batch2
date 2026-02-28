import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><p className="text-slate-500 font-medium">Loading...</p></div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}