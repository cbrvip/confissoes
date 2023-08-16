import React, { useState } from 'react';
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

    async function handleLogout() {
        await signOut(auth);
    }

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
        <li><a href="/"><span><FaHouseChimney size={24} /></span> Página Inicial</a></li>
                    {!loadingAuth && signed && (
                    <Link to={`/profile/${user?.uid}`}>
                        <li><span><FaUser size={24} /></span> Meu Perfil</li>
                    </Link>
                    )}
                    {!loadingAuth && signed && (
                    <Link to={"/profile/post"}>
                        <li><span><FaPhotoFilm size={24} /></span> Novo Post</li>
                    </Link>
                    )}
                    {!loadingAuth && signed && (
                    <Link to={"/"} onClick={handleLogout}>
                        <li><span><FaCircleLeft size={24} /></span> Logout</li>
                    </Link>
                    )}
                    {!loadingAuth && !signed && (
                        <Link to={"/login"}>
                            <li><span><FaUser size={24} /></span> Login</li>
                        </Link>
                    )}
                    {!loadingAuth && !signed && (
                        <Link to={"/register"}>
                            <li><span><FaUserPlus size={24} /></span> Cadastrar-se</li>
                        </Link>
                    )}
        </ul>
      </nav>
    </>
  );
};

export default NavMobile;