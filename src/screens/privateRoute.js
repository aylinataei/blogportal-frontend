import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../authContext";

const ProtectedRoute = ({
  isAllowed,
  redirectPath = "/",
  children,
  ...rest
}) => {
  const { user } = useAuth();

  if (!isAllowed(user)) {
    return <Navigate to={redirectPath} replace={true} />;
  }

  return children;
};

export default ProtectedRoute;