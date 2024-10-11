import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/Sidebar.css";
import logo from "./se_logo.png";
import htmllogo from "./coding.png";
import profileIcon from "./Profile Icon Design.jpg";
import logoutlogo from "./Logout.png";
import dash from "./dashboard.png";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeLink, setActiveLink] = useState("");

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    document.body.classList.toggle("collapsed");
  };

  const handleLinkClick = (href) => {
    setActiveLink(href);
  };

  const handleSearchFocus = () => {
    if (isCollapsed) {
      setIsCollapsed(false);
    }
  };

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
              <img src={htmllogo} alt="editor" />
              <span className="link hide">Code Editor</span>
              <span className="tooltip-content">Code Editor</span>
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
            <img className="avatar" src={profileIcon} alt="Profile Icon" />
            <div className="online-status"></div>
          </div>
          <section className="avatar-name hide">
            <div className="username">John Doe</div>
            <div className="email">john.doe@gmail.com</div>
          </section>
        </Link>
        <Link
          to="/logout"
          className="logout"
          onClick={() => handleLinkClick("/logout")}
        >
          <img src={logoutlogo} alt="dash" className="logout-logo" />
        </Link>
      </div>
    </nav>
  );
};

export default Sidebar;
