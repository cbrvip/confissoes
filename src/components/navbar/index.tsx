import './index.scss';
import { FaHouseChimney, FaUser, FaPhotoFilm, FaUserPlus, FaCircleLeft } from 'react-icons/fa6';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebaseConnection";


export function Navbar() {

    const { user, signed, loadingAuth } = useContext(AuthContext);

    const isAdmin = user && user.admin === 1;

    async function handleLogout() {
        await signOut(auth);
    }

    return (
        <>
        <div className="navbar">
            <nav>
                <ul>
                    <li><a href="/"><span><FaHouseChimney size={24} /></span> Página Inicial</a></li>
                    {!loadingAuth && signed && (
                    <Link to={`/profile/${user?.username}`}>
                        <li><span><FaUser size={24} /></span> Meu Perfil</li>
                    </Link>
                    )}
                    {isAdmin && (
                    <Link to={`/admin`}>
                        <li><span><FaUser size={24} /></span> Administrador</li>
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
        </div>
        </>
    )
}