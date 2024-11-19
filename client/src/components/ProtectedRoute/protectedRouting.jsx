import React, { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../Context/UserContext";

const ProtectedRoute = ({ element }) => {
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    if (!user) {
      const storedRole = localStorage.getItem("userRole");
      if (storedRole) {
        setUser({ role: storedRole });
      }
    }
  }, [user, setUser]);

  return user && user.role === "admin" ? element : <Navigate to="/" />;
};

export default ProtectedRoute;
