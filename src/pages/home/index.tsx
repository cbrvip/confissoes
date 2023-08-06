import { Container } from "../../components/container";
import './index.scss'

import { useState, useEffect } from "react";
import {
    collection,
    query,
    getDocs,
    orderBy,
    where
} from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { Link } from "react-router-dom";

interface PostProps{
    id: string;
    title: string;
    description: string;
    uid: string;
    images: PostImageProps[];
}

interface PostImageProps{
    name: string;
    uid: string;
    url: string;
}


export function Home() {

    const [posts, setPosts] = useState<PostProps[]>([]);
    const [loadImages, setLoadImages] = useState<string[]>([]);
    const [input, setInput] = useState("");

    useEffect(() => {
        loadPosts();

    }, [])

    function loadPosts() {
        const postsRef = collection(db, "posts")
        const queryRef = query(postsRef, orderBy("created", "desc"))

        getDocs(queryRef)
        .then((snapshot) => {
            let listposts = [] as PostProps[];

            snapshot.forEach( doc => {
                listposts.push({
                    id: doc.id,
                    title: doc.data().title,
                    description: doc.data().description,
                    images: doc.data().images,
                    uid: doc.data().uid
                })
            })

            setPosts(listposts);

        })
    }

    function handleImageLoad(id: string) {
        setLoadImages((prevImageLoaded) => [...prevImageLoaded, id])
    }

    async function handleSearchPost() {
        if(input === '') {
            loadPosts();
            return;
        }

        setPosts([]);
        setLoadImages([]);

        const q = query(collection(db, "posts"),
        where("title", ">=", input.toUpperCase()),
        where("title", "<=", input.toUpperCase() + "\uf8ff")
        )

        const querySnapshot = await getDocs(q)

        let listposts = [] as PostProps[];

        querySnapshot.forEach((doc) => {

            listposts.push({
                id: doc.id,
                title: doc.data().title,
                description: doc.data().description,
                images: doc.data().images,
                uid: doc.data().uid
            })

        })

        setPosts(listposts);

    }

    return (
        <>
        <Container>
            
            <div className="feed">
                {posts.map( post => (
                <section className="postFeed">
                    <div
                        className="w-full h-72 rounded-lg bg-slate-200"
                        style={{ display: loadImages.includes(post.id) ? "none": "block"}}
                        ></div>
                    <div className="pictureFeed">
                    <Link key={post.id} to={`/post/${post.id}`}>
                        <img
                        src={post.images[0]?.url}
                        alt=""
                        onLoad={() => handleImageLoad(post.id)}
                        style={{ display: loadImages.includes(post.id) ? "block" : "none" }}
                        />
                    </Link>
                    </div>
                    <div className="infoPost">
                        <h1>{post.title}</h1>
                        <h2>{post.description}</h2>
                    </div>

                    <article className="postComments">
                        <div className="comment">
                            <p>Fulano de tal: <span>Eu nao acredito que to vendo isso kkk</span></p>
                            <p><span>Ver todos os comentários...</span></p>
                        </div>
                        <input className="inputComment" type="text" placeholder="Adicione um comentário..." />
                    </article>
                </section>
                
                ))}
                
            </div>
        </Container>
        </>
    )
}