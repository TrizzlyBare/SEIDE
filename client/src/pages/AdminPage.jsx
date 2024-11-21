import React from "react";
import Admin from "../components/Admin/Admin";
import Sidebar from "../components/Sidebar/Sidebar";
import "./AdminPage.css";

const AdminPage = () => {
  return (
    <div className="admin-page">
      <Sidebar />
      <div className="admin-content">
        <Admin />
      </div>
    </div>
  );
};

export default AdminPage;
