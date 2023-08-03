import './index.scss';
import logoImg from '../../assets/logo.svg';
import { FaHouseChimney, FaUser } from 'react-icons/fa6';


export function Navbar() {
    return (
        <>
        <div className="navbar">
            <nav>
                <div className="logo">
                    <img src={logoImg} alt="" />
                </div>
                <ul>
                    <li><a href="/"><span><FaHouseChimney size={24} /></span> Página Inicial</a></li>
                    <li><a href="/profile"><span><FaUser size={24} /></span> Meu Perfil</a></li>
                    <li><a href="/register"><span><FaUser size={24} /></span> Novo Post</a></li>
                    <li><a href="/register"><span><FaUser size={24} /></span> Login</a></li>
                    <li><a href="/register"><span><FaUser size={24} /></span> Cadastro</a></li>
                    <li><a href="/register"><span><FaUser size={24} /></span> Logout</a></li>
                </ul>
            </nav>
        </div>
        </>
    )
}