import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Context/UserContext";
import "../../styles/Profilestyle.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";

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

        if (!token) {
          navigate("/");
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        const response = await fetch("http://localhost:8000/api/profile", {
          method: "GET",
          headers,
        });

        if (response.status === 401) {
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
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, setUser]);

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
          <div className="text-2xl font-bold">
            {profile.first_name?.[0]}
            {profile.last_name?.[0]}
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

        {/* Font Awesome Icon positioned at bottom right */}
        <div className="icon-bottom-right" onClick={() => navigate("/")}>
          <FontAwesomeIcon icon={faArrowRightFromBracket} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
