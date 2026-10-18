import { Navigate, useLocation } from "react-router-dom";
import { getToken } from "../utils/auth.js";

// Wraps any page that only staff should see. No token means redirect to login.
function ProtectedRoute({ children }) {
  const location = useLocation();
  if (!getToken()) {
    return (
      <Navigate to="/staff-login" replace state={{ from: location.pathname }} />
    );
  }
  return children;
}

export default ProtectedRoute;
