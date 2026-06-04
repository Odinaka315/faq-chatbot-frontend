import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  // If the AuthContext says there is no valid user, bounce them
  if (!user) {
    return <Navigate to="/administration" replace />;
  }

  return children;
}
