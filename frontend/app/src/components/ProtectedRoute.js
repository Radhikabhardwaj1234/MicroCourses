import { Navigate } from "react-router-dom";
const ProtectedRoute = ({ children, role, user, loading }) => {
  if (loading) {
    return <div>Loading...</div>; // or skeleton
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && !role.includes(user.role)) {
    return <Navigate to="/courses" replace />;
  }

  return children;
};


export default ProtectedRoute
