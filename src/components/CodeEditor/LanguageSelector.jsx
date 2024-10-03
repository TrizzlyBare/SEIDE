import React, { useState } from "react";
import "../../styles/LanguageSelector.css";
import { LANGUAGE_VERSIONS } from "../../middleware/constants";

const languages = Object.entries(LANGUAGE_VERSIONS);

const LanguageSelector = ({ language, onSelect }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <div className="language-selector">
      <div className="language-selector-text">Language:</div>
      <button className="menu-button" onClick={toggleMenu}>
        {language}
      </button>
      <div className={`menu-list ${menuOpen ? "show" : ""}`}>
        {languages.map(([lang, version]) => (
          <div
            key={lang}
            className={`menu-item ${lang === language ? "active" : ""}`}
            onClick={() => {
              onSelect(lang);
              setMenuOpen(false);
            }}
          >
            {lang}
            &nbsp;
            <span>({version})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;
