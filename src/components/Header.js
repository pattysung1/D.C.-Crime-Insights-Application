// src/components/Header.js
import React from 'react';
import '../styles/Header.css';

const Header = () => {
  return (
    <header className="header">
      <img src="/photo/dc.png" alt="Left Logo" className="logo left-logo" />
      <h1 className="project-title">D.C. Crime Insights Application</h1>
      <img src="/photo/vt.png" alt="Right Logo" className="logo right-logo" />
    </header>
  );
};

export default Header;
