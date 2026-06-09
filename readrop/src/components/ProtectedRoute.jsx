import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

/*
 * Gate any route behind authentication. While the session is resolving we
 * render nothing meaningful (avoids a flash of protected content); once
 * resolved, unauthenticated users are bounced to /login with a return path.
 *
 * Note: this is a UX guard. Real protection of data lives in the backend API.
 */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="container section">Checking your session…</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
