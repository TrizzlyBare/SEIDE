import React from "react";
import Sidebar from "../Sidebar/Sidebar";

const ProfilePage = () => {
  return (
    <div className="profile-page">
      <div className="content">
        <div className="content__cover">
          <div className="content__avatar"></div>
          <div className="content__bull">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <div className="content__actions">
          <a href="#">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
              <path
                fill="currentColor"
                d="M192 256A112 112 0 1 0 80 144a111.94 111.94 0 0 0 112 112zm76.8 32h-8.3a157.53 157.53 0 0 1-68.5 16c-24.6 0-47.6-6-68.5-16h-8.3A115.23 115.23 0 0 0 0 403.2V432a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48v-28.8A115.23 115.23 0 0 0 268.8 288z"
              ></path>
              <path
                fill="currentColor"
                d="M480 256a96 96 0 1 0-96-96 96 96 0 0 0 96 96zm48 32h-3.8c-13.9 4.8-28.6 8-44.2 8s-30.3-3.2-44.2-8H432c-20.4 0-39.2 5.9-55.7 15.4 24.4 26.3 39.7 61.2 39.7 99.8v38.4c0 2.2-.5 4.3-.6 6.4H592a48 48 0 0 0 48-48 111.94 111.94 0 0 0-112-112z"
              ></path>
            </svg>
            <span>Edit Profile</span>
          </a>
        </div>
        <div className="content__title">
          <h1>Samantha Jones</h1>
          <span>66xxxxxx</span>
        </div>
        <div className="content__description">
          <p>Software Engineering - Year 2</p>
          <p>KMITL</p>
        </div>
        <ul className="profile-content">
          <h2>Skills</h2>
          <ul>
            <li>C++</li>
            <li>Java</li>
            <li>Rust</li>
            <li>HTML & CSS</li>
            <li>Assembly</li>
          </ul>

          <h2>Projects</h2>
          <ul>
            <li>PokÃ©mon Go-Inspired Game</li>
            <li>Space-Themed Video Game</li>
            <li>Carbon Emissions System</li>
            <li>Chatbot UI with Qt</li>
          </ul>
        </ul>
      </div>
      <div className="bg">
        <div>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div className="theme-switcher-wrapper" id="theme-switcher-wrapper">
        <span>Themes color</span>
        <ul>
          <li>
            <em className="is-active" data-theme="orange"></em>
          </li>
          <li>
            <em data-theme="green"></em>
          </li>
          <li>
            <em data-theme="purple"></em>
          </li>
          <li>
            <em data-theme="blue"></em>
          </li>
        </ul>
      </div>
      <div className="theme-switcher-button" id="theme-switcher-button">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
          <path
            fill="currentColor"
            d="M352 0H32C14.33 0 0 14.33 0 32v224h384V32c0-17.67-14.33-32-32-32zM0 320c0 35.35 28.66 64 64 64h64v64c0 35.35 28.66 64 64 64s64-28.65 64-64v-64h64c35.34 0 64-28.65 64-64v-32H0v32zm192 104c13.25 0 24 10.74 24 24 0 13.25-10.75 24-24 24s-24-10.75-24-24c0-13.26 10.75-24 24-24z"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default ProfilePage;
