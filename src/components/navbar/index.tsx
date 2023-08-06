import './index.scss';
import logoImg from '../../assets/logo.svg';
import { FaHouseChimney, FaUser, FaPhotoFilm, FaUserPlus, FaCircleLeft } from 'react-icons/fa6';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';


export function Navbar() {

    const { signed, loadingAuth } = useContext(AuthContext);

    return (
        <>
        <div className="navbar">
            <nav>
                <div className="logo">
                    <img src={logoImg} alt="" />
                </div>
                <ul>
                    <li><a href="/"><span><FaHouseChimney size={24} /></span> Página Inicial</a></li>
                    {!loadingAuth && signed && (
                    <Link to={"/profile"}>
                        <li><a><span><FaUser size={24} /></span> Meu Perfil</a></li>
                    </Link>
                    )}
                    {!loadingAuth && signed && (
                    <Link to={"/profile/post"}>
                        <li><a><span><FaPhotoFilm size={24} /></span> Novo Post</a></li>
                    </Link>
                    )}
                    {!loadingAuth && signed && (
                    <Link to={"/"}>
                        <li><a><span><FaCircleLeft size={24} /></span> Logout</a></li>
                    </Link>
                    )}
                    {!loadingAuth && !signed && (
                        <Link to={"/login"}>
                            <li><a><span><FaUser size={24} /></span> Login</a></li>
                        </Link>
                    )}
                    {!loadingAuth && !signed && (
                        <Link to={"/register"}>
                            <li><a><span><FaUserPlus size={24} /></span> Cadastrar-se</a></li>
                        </Link>
                    )}
                    
                </ul>
            </nav>
        </div>
        </>
    )
}