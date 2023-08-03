import React, { useState } from 'react';
import './index.scss'

const NavMobile: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <div className="menu-icon" onClick={toggleMenu}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
      <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">Sobre nós</a></li>
          <li><a href="#">Serviços</a></li>
          <li><a href="#">Contato</a></li>
        </ul>
      </nav>
    </>
  );
};

export default NavMobile;