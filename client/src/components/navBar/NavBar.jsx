import React, { useEffect, useState } from "react";
import {
  HeaderContainer,
  NavLinks,
  BaseLink,
  ProfileLink,
  LogoImage,
  AdminLink,
} from "./NavBarStyle";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons"; // Import the house icon
import { faCode } from "@fortawesome/free-solid-svg-icons"; // Import the code icon
import { faUser } from "@fortawesome/free-regular-svg-icons"; // Import the user icon
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons"; // Corrected icon for info


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
        {/* Home link with icon */}
        <BaseLink to="/home">
          <FontAwesomeIcon icon={faHouse} size="1x" />
        </BaseLink>

        {/* Program link */}
        <BaseLink to="/curriculum">
          <FontAwesomeIcon icon={faInfoCircle} size="1x" />
        </BaseLink>

        {/* Code Editor link with icon */}
        <BaseLink to="/editor">
          <FontAwesomeIcon icon={faCode} size="1x" />
        </BaseLink>

        {/* Admin Panel link only visible for ADMIN users */}
        {userRole === "ADMIN" && (
          <BaseLink to="/admin" style={{ color: "#e74c3c", fontSize: "1.2em" }}>
            Admin Panel
          </BaseLink>
        )}

        {/* Profile link with icon */}
        <ProfileLink to="/profile">
          <FontAwesomeIcon icon={faUser} size="1x" />
        </ProfileLink>
      </NavLinks>
    </HeaderContainer>
  );
};

export default NavBar;
