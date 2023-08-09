import { useEffect, useState } from "react"
import { Container } from "../../components/container"
import { FaWhatsapp } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import './index.scss';


interface PostProps{
    id: string;
    title: string;
    description: string;
    name: string;
    uid: string;
    owner: string;
    created: string;
    images: ImagePostProps[];
}

interface ImagePostProps{
    uid: string;
    name: string;
    url: string;
}

export function PostDetail() {

    const { id } = useParams();
    const [post, setPost] = useState<PostProps>();
    const [sliderPerView, setSliderPerView] = useState<number>(2);
    const navigate = useNavigate();

    useEffect(() => {

        async function loadPost() {
            if(!id) { return }

            const docRef = doc(db, "posts", id)
            getDoc(docRef)
            .then((snapshot) => {

                if(!snapshot.data()){
                    navigate("/")
                }

                setPost({
                    id: snapshot.id,
                    title: snapshot.data()?.title,
                    description: snapshot.data()?.description,
                    name: snapshot.data()?.name,
                    uid: snapshot.data()?.uid,
                    owner: snapshot.data()?.owner,
                    created: snapshot.data()?.created,
                    images: snapshot.data()?.images,
                })
            })
        }

        loadPost();
        
    }, [id])

    useEffect(() => {
        function handleResize() {
            if(window.innerWidth < 720) {
                setSliderPerView(1);
            } else {
                setSliderPerView(2);
            }
        }

        handleResize();

        window.addEventListener("resize", handleResize)

        return() => {
            window.removeEventListener("resize", handleResize)
        }
    }, [])
    
    return (
        <Container>
            { post && (
                <main className="mainPost">
                    <div className="postImg">
                        <Swiper
                        slidesPerView={sliderPerView}
                        pagination={{ clickable: true }}
                        navigation
                        >
                        {post?.images.map ( image => (
                            <SwiperSlide key={image.name}>
                                <img src={image.url} className="imgPost" />
                            </SwiperSlide>
                        ))}
        
                        </Swiper>
                    </div>
                    <div className="postDetail">
                        <h1>{post.title}</h1>
                        <p>{post.description}</p>
                    </div>
                    <article className="postComments">
                        <div className="comment">
                            <p>Fulano de tal: <span>Eu nao acredito que to vendo isso kkk</span></p>
                            <p><span>Ver todos os comentários...</span></p>
                        </div>
                        <input className="inputComment" type="text" placeholder="Adicione um comentário..." />
                    </article>
                </main>
            ) }
        </Container>
    )
}