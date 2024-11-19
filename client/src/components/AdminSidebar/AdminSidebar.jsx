import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/AdminSidebar.css";
import logo from "./se_logo.png";
import dash from "./dashboard.png"; // Ensure this path is correct
import profileIcon from "./Profile Icon Design.jpg"; // Ensure this path is correct
import logoutlogo from "./Logout.png"; // Ensure this path is correct

const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const [email, setEmail] = useState("");

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    document.body.classList.toggle("collapsed");
  };

  const handleLinkClick = (href) => {
    setActiveLink(href);
  };

  const checkLogin = async () => {
    const token = localStorage.getItem("token");
    console.log(token);
    if (!token) {
      window.location.href = "/signin";
    }
    fetch("http://localhost:8000/api/users/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,  // Use the token stored in localStorage
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setEmail(data.email);
      })
      .catch((error) => console.error("Error:", error));
    
  }

  const handleSearchFocus = () => {
    if (isCollapsed) {
      setIsCollapsed(false);
    }
  };

  useEffect(() => {
    checkLogin();
  } , []);

  return (
    <nav className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-top-wrapper">
        <div className="sidebar-top">
          <Link
            to="/"
            className="logo-wrapper"
            onClick={() => handleLinkClick("/")}
          >
            <img
              src={logo}
              alt="Software Engineer Logo"
              className="logo-small"
            />
            <span className="hide seide" id="seide">
              SEIDE
            </span>
          </Link>
        </div>
        <div className="expand-btn" onClick={toggleSidebar}>
          <svg>{/* Your SVG here */}</svg>
        </div>
      </div>

      <div className="search-wrapper">
        <input type="search" placeholder="Home" onFocus={handleSearchFocus} />
      </div>

      <div className="sidebar-links">
        <h2>Main</h2>
        <ul>
          <li>
            <Link
              to="/dashboard"
              title="Dashboard"
              className={`tooltip ${
                activeLink === "/dashboard" ? "active" : ""
              }`}
              onClick={() => handleLinkClick("/dashboard")}
            >
              {/* Dashboard icon */}
              <img src={dash} alt="dash" />
              <span className="link hide">Dashboard</span>
              <span className="tooltip-content">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              to="/editor"
              title="Code Editor"
              className={`tooltip ${activeLink === "/editor" ? "active" : ""}`}
              onClick={() => handleLinkClick("/editor")}
            >
              {/* Code Editor icon */}
              {/* <img src={htmllogo} alt="editor" /> */}
              <span className="link hide">Code Editor</span>
              <span className="tooltip-content">Code Editor</span>
            </Link>
          </li>
          <li>
            <Link
              to="/admin"
              title="Admin"
              className={`tooltip ${activeLink === "/admin" ? "active" : ""}`}
              onClick={() => handleLinkClick("/admin")}
            >
              {/* Code Editor icon */}
              {/* <img src={htmllogo} alt="editor" /> */}
              <span className="link hide">Admin</span>
              <span className="tooltip-content">Admin</span>
            </Link>
          </li>
          <li>
            <Link
              to="/answers"
              title="Answers"
              className={`tooltip ${activeLink === "/answers" ? "active" : ""}`}
              onClick={() => handleLinkClick("/answers")}
            >
              {/* Code Editor icon */}
              {/* <img src={htmllogo} alt="editor" /> */}
              <span className="link hide">Answers</span>
              <span className="tooltip-content">Answers</span>
            </Link>
          </li>
          <li>
            <Link
              to="/questions"
              title="Questions"
              className={`tooltip ${activeLink === "/questions" ? "active" : ""}`}
              onClick={() => handleLinkClick("/questions")}
            >
              {/* Code Editor icon */}
              {/* <img src={htmllogo} alt="editor" /> */}
              <span className="link hide">Questions</span>
              <span className="tooltip-content">Questions</span>
            </Link>
          </li>
        </ul>
      </div>

      <div className="sidebar-links bottom-links"></div>

      <div className="divider"></div>

      <div className="sidebar-profile">
        <Link
          to="/profile"
          title="Profile"
          className={`tooltip ${activeLink === "/profile" ? "active" : ""}`}
          onClick={() => handleLinkClick("/profile")}
        >
          <div className="avatar-wrapper">
            {/* <img className="avatar" src={profileIcon} alt="Profile Icon" /> */}
            <div className="online-status"></div>
          </div>
          <section className="avatar-name hide">
            <div className="username">John Doe</div>
            <div className="email">{email}</div>
          </section>
        </Link>
        <Link
          to="/logout"
          className="logout"
          onClick={() => handleLinkClick("/logout")}
        >
          {/* <img src={logoutlogo} alt="dash" className="logout-logo" /> */}
        </Link>
      </div>
    </nav>
  );
};

export default AdminSidebar;
