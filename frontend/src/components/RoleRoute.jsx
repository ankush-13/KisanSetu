import { Navigate, Outlet } from "react-router-dom";

const RoleRoute = ({ allowedRole }) => {
  const token = localStorage.getItem("kisansetu_token");

  const user = JSON.parse(
    localStorage.getItem("kisansetu_user") || "null"
  );

  // Not logged in
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Wrong role
  if (user.role !== allowedRole) {
    if (user.role === "farmer") {
      return <Navigate to="/dashboard" replace />;
    }

    if (user.role === "buyer") {
      return <Navigate to="/my-orders" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;