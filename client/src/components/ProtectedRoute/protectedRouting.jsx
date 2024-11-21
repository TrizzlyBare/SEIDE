import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const [userRole, setUserRole] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const location = useLocation();

  const checkUserRole = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await fetch("http://localhost:8000/api/role-check", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user role");
      }

      const data = await response.json();
      console.log("Role check response:", data);
      setUserRole(data.role);
    } catch (error) {
      console.error("Error checking user role:", error);
      // Clear token on error
      localStorage.removeItem("access_token");
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    checkUserRole();
  }, []);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        Loading...
      </div>
    );
  }

  if (!userRole || !allowedRoles.includes(userRole)) {
    console.log(
      `Access denied. User role: ${userRole}, Required roles: ${allowedRoles}`
    );
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
