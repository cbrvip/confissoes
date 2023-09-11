import React, { useState, useEffect, useRef } from 'react';
import './index.scss'
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { signOut } from "firebase/auth";
import { FaHouseChimney, FaUser, FaPhotoFilm, FaUserPlus, FaCircleLeft } from 'react-icons/fa6';
import { auth } from "../../services/firebaseConnection";

const NavMobile: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signed, loadingAuth } = useContext(AuthContext);

  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  async function handleLogout() {
    await signOut(auth);
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <div className="menu-icon" onClick={toggleMenu}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
      <nav ref={menuRef} className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
        <ul>
          <li>
            <Link to="/" onClick={closeMenu}>
              <span><FaHouseChimney size={24} /></span> Página Inicial
            </Link>
          </li>
          {!loadingAuth && signed && (
            <li>
              <Link to={`/profile/${user?.uid}`} onClick={closeMenu}>
                <span><FaUser size={24} /></span> Meu Perfil
              </Link>
            </li>
          )}
          {!loadingAuth && signed && (
            <li>
              <Link to="/profile/post" onClick={closeMenu}>
                <span><FaPhotoFilm size={24} /></span> Novo Post
              </Link>
            </li>
          )}
          {!loadingAuth && signed && (
            <li>
              <Link to="/" onClick={() => { closeMenu(); handleLogout(); }}>
                <span><FaCircleLeft size={24} /></span> Logout
              </Link>
            </li>
          )}
          {!loadingAuth && !signed && (
            <li>
              <Link to="/login" onClick={closeMenu}>
                <span><FaUser size={24} /></span> Login
              </Link>
            </li>
          )}
          {!loadingAuth && !signed && (
            <li>
              <Link to="/register" onClick={closeMenu}>
                <span><FaUserPlus size={24} /></span> Cadastrar-se
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </>
  );
};

export default NavMobile;