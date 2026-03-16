import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// This wraps pages that require login or a specific role
function PrivateRoute({ children, roles }) {
  const { user } = useSelector((state) => state.auth);

  // If not logged in, send to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If logged in but wrong role, send to home
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default PrivateRoute;

