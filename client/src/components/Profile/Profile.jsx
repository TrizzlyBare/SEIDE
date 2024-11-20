import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Context/UserContext";
import "../../styles/Profilestyle.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("access_token");

        // Debug token
        console.log("Token from localStorage:", {
          token,
          tokenLength: token?.length,
          firstChars: token?.substring(0, 20),
          lastChars: token?.substring(token?.length - 20),
        });

        if (!token) {
          console.warn("No token found in localStorage");
          navigate("/");
          return;
        }

        // Create headers and log them
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };
        console.log("Request headers:", headers);

        const response = await fetch("http://localhost:8000/api/profile", {
          method: "GET",
          headers,
        });

        // Log full response
        console.log("Response:", {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
        });

        if (response.status === 401) {
          const errorData = await response.json();
          console.log("401 Error full details:", errorData);

          // Clear auth state and redirect
          localStorage.removeItem("access_token");
          localStorage.removeItem("userRole");
          setUser(null);
          navigate("/");
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setProfile(data);
        setUser({
          ...data,
          role: localStorage.getItem("userRole") || "user",
        });
      } catch (error) {
        console.error("Full error details:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, setUser]);

  // Common button styles
  const buttonClasses =
    "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 max-w-md bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button onClick={() => navigate("/")} className={buttonClasses}>
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 max-w-md bg-white rounded-lg shadow-lg">
          <p className="text-gray-700 mb-6">No profile data available</p>
          <button onClick={() => navigate("/")} className={buttonClasses}>
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="content">
        <div className="content__cover">
          <div className="content__avatar">
            <div className="text-2xl font-bold">
              {profile.first_name?.[0]}
              {profile.last_name?.[0]}
            </div>
          </div>
        </div>

        <div className="content__title">
          <h1>
            {profile.first_name} {profile.last_name}
          </h1>
          <span>{profile.email}</span>
        </div>

        <div className="content__description">
          <p>Software Engineering - Year {profile.year}</p>
          <p>KMITL</p>
        </div>

        <div className="profile-content">
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">Skills</h2>
            <ul className="grid grid-cols-2 gap-2">
              <li>Python</li>
              <li>JavaScript</li>
              <li>React</li>
              <li>FastAPI</li>
              <li>SQL</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">Projects</h2>
            <ul className="space-y-2">
              <li>Student Management System</li>
              <li>Portfolio Website</li>
              <li>E-commerce Platform</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;
