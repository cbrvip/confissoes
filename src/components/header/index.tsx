import { Navbar } from "../navbar";
import './index.scss';
import NavMobile from '../navbar/mobile';
import logoImg from '../../assets/logo.svg';

export function Header() {
    return(
        <div className="header">
        <NavMobile />
        <div className="logo">
                <img src={logoImg} alt="" />
            </div>
        </div>
    )
}