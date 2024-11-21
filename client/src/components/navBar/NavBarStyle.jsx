import styled from "styled-components";
import { Link } from "react-router-dom";

export const HeaderContainer = styled.header`
  width: 100%;
  background-color: #2d3748;
  color: white;
  padding: 15px;
  position: fixed; /* Fixed position */
  top: 0;
  left: 0;
  z-index: 1000;
  height: 80px; /* Set a fixed height for the header */
  display: flex;
  align-items: center; /* Center items vertically */
  justify-content: space-between; /* Add space between logo and nav links */
`;

export const LogoImage = styled.img`
  height: 50px; /* Adjust the height as needed */
  margin-right: 20px; /* Space between the logo and the nav links */
  aspect-ratio: auto 50 / 50; /* Maintain aspect ratio */
  padding: 5px; /* Add padding inside the border */
  transition: transform 0.3s ease-in-out; /* Smooth transition for hover effect */

  &:hover {
    transform: scale(1.1); /* Slightly enlarge the image on hover */
  }
`;

export const NavLinks = styled.nav`
  display: flex;
  justify-content: flex-end;
  margin-right: 20px;
  gap: 10px;
`;

export const BaseLink = styled(Link)`
  color: white;
  text-decoration: none;
  padding: 10px;
  font-size: 1.2rem;
  position: relative;
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: #4a5568; /* Background color change on hover */
    color: #fbbf24; /* Text color change to yellow on hover */
    border-radius: 8px; /* Rounded corners on hover */

    &::before {
      content: "";
      position: absolute;
      left: -10px;
      width: 5px;
      height: 100%;
      background-color: #fbbf24; /* Yellow bar on hover */
      border-radius: 5px 0 0 5px;
    }
  }
`;

export const ProfileLink = styled(Link)`
  color: white;
  text-decoration: none;
  padding: 10px;
  font-size: 1.2rem;
  position: relative;
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: #4a5568; /* Background color change on hover */
    color: #fbbf24; /* Text color change to yellow on hover */
    border-radius: 8px; /* Rounded corners on hover */

    &::before {
      content: "";
      position: absolute;
      left: -10px;
      width: 5px;
      height: 100%;
      background-color: #fbbf24; /* Yellow bar on hover */
      border-radius: 5px 0 0 5px;
    }

    &::after {
      content: "View and edit your profile";
      position: absolute;
      top: 110%; /* Position below the Profile link */
      left: 50%;
      transform: translateX(-50%);
      padding: 8px 12px;
      background-color: #333; /* Dark background for the text box */
      color: #fff;
      font-size: 0.9rem;
      white-space: nowrap;
      border-radius: 4px;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
    }

    &:hover::after {
      opacity: 1;
      visibility: visible;
    }
  }
`;

export const AdminLink = styled(BaseLink)`
  color: #e74c3c; // Red color for admin link
  font-weight: 600;

  &:hover {
    color: #c0392b; // Darker red on hover
  }

  // Optional: Add an admin icon
  &::before {
    content: "🔧 "; // You can replace this with an icon of your choice
    margin-right: 4px;
  }
`;
