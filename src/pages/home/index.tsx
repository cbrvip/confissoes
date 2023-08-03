import { Container } from "../../components/container";
import { Input } from "../../components/input";
import './index.scss'
export function Home() {
    return (
        <>
        <Container>
            <div className="feed">
                <section className="postFeed">
                    <img
                    className="pictureFeed"
                    src="https://img.freepik.com/fotos-premium/retrato-de-um-homem-de-casal-caucasiano-carregando-o-amante-ruivo-nas-costas-aproveitando-as-ferias-de-fim-de-semana-de-luz-solar_129180-7251.jpg"
                    alt=""
                    />
                    <div className="infoPost">
                        <h1>Fernando Noronha</h1>
                        <h2>Da só uma olhadinha no que rolou ontem no nosso DESAFIO DA EMBAIXADINHA!! E o que não pode faltar? Prêmio e cupom!! ⚽️🤩</h2>
                    </div>

                    <article className="postComments">
                        <div className="comment">
                            <p>Fulano de tal: <span>Eu nao acredito que to vendo isso kkk</span></p>
                            <p><span>Ver todos os comentários...</span></p>
                        </div>
                        <input className="inputComment" type="text" placeholder="Adicione um comentário..." />
                    </article>
                </section>
                <section className="postFeed">
                    <div className="infoPost">
                        <h1>Fernando Noronha</h1>
                    </div>
                    <img
                    className="pictureFeed"
                    src="https://img.freepik.com/fotos-premium/retrato-de-um-homem-de-casal-caucasiano-carregando-o-amante-ruivo-nas-costas-aproveitando-as-ferias-de-fim-de-semana-de-luz-solar_129180-7251.jpg"
                    alt=""
                    />
                    <div className="infoPost">
                        <h1>Fernando Noronha</h1>
                        <h2>Da só uma olhadinha no que rolou ontem no nosso DESAFIO DA EMBAIXADINHA!! E o que não pode faltar? Prêmio e cupom!! ⚽️🤩</h2>
                    </div>

                    <article className="postComments">
                        <div className="comment">
                            <p>Fulano de tal: <span>Eu nao acredito que to vendo isso kkk</span></p>
                            <p><span>Ver todos os comentários...</span></p>
                        </div>
                        <input className="inputComment"type="text" placeholder="Adicione um comentário..." />
                    </article>
                </section>
            </div>
        </Container>
        </>
    )
}