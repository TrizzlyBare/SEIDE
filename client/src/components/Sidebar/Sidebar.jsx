import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul>
        <li>
          <Link to="/admin">Subjects Management</Link>
        </li>
        <li>
          <Link to="/admin/users">User Management</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
