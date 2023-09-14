import './index.scss';
import NavMobile from '../navbar/mobile';
import logoImg from '../../assets/logo.svg';
import { Link } from 'react-router-dom';
import { Container } from '../container';
import { Navbar } from '../navbar';

export function Header() {
    return(
        <div className="header">
            <div className="boxing">
            <Container>
                <NavMobile />
                
                <div className="logo">
                    <Link to={`/`}>
                        <img src={logoImg} alt="" />
                    </Link>
                </div>

                <Navbar />

            </Container>
            </div>
        </div>
    )
}