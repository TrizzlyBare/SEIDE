import React, { useEffect, useState } from "react";
import {
  HeaderContainer,
  NavLinks,
  BaseLink,
  ProfileLink,
  LogoImage,
  AdminLink, // You'll need to add this to your styles
} from "./NavBarStyle";

const NavBar = () => {
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
      setUserRole(data.role);
    } catch (error) {
      console.error("Error checking user role:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkUserRole();
  }, []);

  if (isLoading) {
    return <HeaderContainer>Loading...</HeaderContainer>;
  }

  return (
    <HeaderContainer>
      <LogoImage src="https://www.se.kmitl.ac.th/assets/se.png" alt="Logo" />
      <NavLinks>
        <BaseLink to="/home">Home</BaseLink>
        <BaseLink to="/curriculum">Program</BaseLink>
        <BaseLink to="/editor">Code Editor</BaseLink>
        {userRole === "ADMIN" && (
          <BaseLink to="/admin" style={{ color: "#e74c3c" }}>
            Admin Panel
          </BaseLink>
        )}
        <ProfileLink to="/profile">Profile</ProfileLink>
      </NavLinks>
    </HeaderContainer>
  );
};

export default NavBar;
