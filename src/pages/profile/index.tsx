import { Container } from "../../components/container";
import './index.scss'

export function Profile() {
    return (
        <Container>
            <div className="mainProfile">
                <div className="userPhoto">
                    <img src="https://img.freepik.com/fotos-gratis/retrato-de-homem-feliz-e-sorridente_23-2149022620.jpg" alt="" />
                </div>
                <h1>Gustavo Henrique</h1>
                <p><a href="">@gustavohenrique</a></p>

                <div className="buttons">
                    <button className="btnProfile">Editar Perfil</button>
                    <button className="btnProfile">Novo Post</button>
                </div>

                <div className="myPosts">
                    <h2>Publicações</h2>

                    <div className="posts">
                        <section className="recentPost">
                            <img src="https://img.freepik.com/fotos-gratis/retrato-de-homem-feliz-e-sorridente_23-2149022620.jpg" alt="" />
                        </section>
                        <section className="recentPost">
                            <img src="https://img.freepik.com/fotos-gratis/retrato-de-homem-feliz-e-sorridente_23-2149022620.jpg" alt="" />
                        </section>
                        <section className="recentPost">
                            <img src="https://img.freepik.com/fotos-gratis/retrato-de-homem-feliz-e-sorridente_23-2149022620.jpg" alt="" />
                        </section>
                        <section className="recentPost">
                            <img src="https://img.freepik.com/fotos-gratis/retrato-de-homem-feliz-e-sorridente_23-2149022620.jpg" alt="" />
                        </section>
                        <section className="recentPost">
                            <img src="https://img.freepik.com/fotos-gratis/retrato-de-homem-feliz-e-sorridente_23-2149022620.jpg" alt="" />
                        </section>
                        <section className="recentPost">
                            <img src="https://img.freepik.com/fotos-gratis/retrato-de-homem-feliz-e-sorridente_23-2149022620.jpg" alt="" />
                        </section>
                        <section className="recentPost">
                            <img src="https://img.freepik.com/fotos-gratis/retrato-de-homem-feliz-e-sorridente_23-2149022620.jpg" alt="" />
                        </section>
                        <section className="recentPost">
                            <img src="https://img.freepik.com/fotos-gratis/retrato-de-homem-feliz-e-sorridente_23-2149022620.jpg" alt="" />
                        </section>
                        <section className="recentPost">
                            <img src="https://img.freepik.com/fotos-gratis/retrato-de-homem-feliz-e-sorridente_23-2149022620.jpg" alt="" />
                        </section>
                        <section className="recentPost">
                            <img src="https://img.freepik.com/fotos-gratis/retrato-de-homem-feliz-e-sorridente_23-2149022620.jpg" alt="" />
                        </section>
                        <section className="recentPost">
                            <img src="https://img.freepik.com/fotos-gratis/retrato-de-homem-feliz-e-sorridente_23-2149022620.jpg" alt="" />
                        </section>
                        <section className="recentPost">
                            <img src="https://img.freepik.com/fotos-gratis/retrato-de-homem-feliz-e-sorridente_23-2149022620.jpg" alt="" />
                        </section>
                    </div>
                
                </div>
            </div>
            
        </Container>
    )
}