import './index.scss';
import NavMobile from '../navbar/mobile';
import logoImg from '../../assets/logo.svg';
import { Link } from 'react-router-dom';

export function Header() {
    return(
        <div className="header">
        <NavMobile />
        <div className="logo">
            <Link to={`/`}>
                <img src={logoImg} alt="" />
            </Link>
            </div>
        </div>
    )
}