import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/** Only renders its children for a logged-in "admin" or "user"; otherwise redirects to the right login page. */
export default function ProtectedRoute({ role, children }) {
  const { loggedInUser, loggedInAdmin } = useAuth();

  if (role === "admin" && !loggedInAdmin) return <Navigate to="/admin-login" replace />;
  if (role === "user" && !loggedInUser) return <Navigate to="/user-login" replace />;
  return children;
}
