import { Link } from "react-router-dom";
import './index.scss';

export function Navbar() {
    return (
        <>
        <nav className="navAdm">
            <ul>
                <Link to="/admin/posts/new"><li>Novo Posts</li></Link>
                <Link to="/admin/posts/approved"><li>Posts Aprovados</li></Link>
                <Link to="/admin/posts/pending"><li>Posts Pendentes</li></Link>
                <Link to=""><li>Usuários</li></Link>
                <Link to="/admin/comments"><li>Comentários</li></Link>
                <Link to="/"><li>Voltar para o Site</li></Link>
            </ul>
          </nav>
          </>
    )
}