import { Container } from "../../components/container";
import { useEffect, useState, useContext } from "react";
import { FiTrash2 } from "react-icons/fi";

import { collection, getDocs, where, query, doc, deleteDoc } from "firebase/firestore";
import { db, storage } from "../../services/firebaseConnection";
import { ref, deleteObject } from "firebase/storage";
import { AuthContext } from "../../contexts/AuthContext";
import './index.scss';
import { Link } from "react-router-dom";

interface PostProps{
    id: string;
    name: string;
    title: string;
    description: string;
    images: ImagePostProps[];
    uid: string;
}

interface ImagePostProps{
    name: string;
    uid: string;
    url: string;
}

export function Profile() {
    const [posts, setPosts] = useState<PostProps[]>([]);
    const { signed, user } = useContext(AuthContext);

    useEffect(() => {
        function loadPosts() {

            if (!signed || !user) {
                return;
            }
            

            const postsRef = collection(db, "posts")
            const queryRef = query(postsRef, where("uid", "==", user.uid))

            getDocs(queryRef)
            .then((snapshot) => {
                let listposts = [] as PostProps[];

                snapshot.forEach( doc => {
                    listposts.push({
                        id: doc.id,
                        name: doc.data().name,
                        title: doc.data().title,
                        description: doc.data().description,
                        images: doc.data().images,
                        uid: doc.data().uid
                    })
                })

                setPosts(listposts);

            })
        }

        loadPosts();

    }, [signed, user]);

    async function handleDeletePost(post: PostProps) {

        const itemPost = post;

        const docRef = doc(db, "posts", itemPost.id);
        await deleteDoc(docRef);

        itemPost.images.map( async (image) => {
            const imagePath = `images/${image.uid}/${image.name}`
            const imageRef = ref(storage, imagePath)

            try {
                await deleteObject(imageRef)
                setPosts(posts.filter(post => post.id !== itemPost.id));
            } catch(err) {

            }
            
        })

        
    }

    return (
        <Container>
            
            <div className="mainProfile">
            <div className="userPhoto">
                    <img src="https://img.freepik.com/fotos-gratis/retrato-de-homem-feliz-e-sorridente_23-2149022620.jpg" alt="" />
                </div>
                <h1>{user?.name || "Nome do Usuário"}</h1>
                <p><a href={`/${user?.username}`}>{user?.username || "Username"}</a></p>

                <div className="buttons">
                    <Link to={`/profile/edit`}>
                    <button className="btnProfile">Editar Perfil</button>
                    </Link>
                    <Link to={`/profile/post`}>
                    <button className="btnProfile">Novo Post</button>
                    </Link>
                </div>

                <div className="myPosts">
                    <h2>Publicações</h2>

                    <div className="posts">
                    {posts.map( post => (
                        <section key={post.id} className="recentPost">
                            <button
                            className="absolute bg-white w-14 h-14 rounded-full flex items-center justify-center right-2 top-2 drop-shadow"
                            onClick={ () =>  handleDeletePost(post) }
                            >
                                <FiTrash2 size={26} color="#000" />
                            </button>
                            <Link key={post.id} to={`/post/${post.id}`}>
                                <img
                                src={post.images[0]?.url}
                                alt=""
                                />
                            </Link>
                        </section>
                        ))}
                    </div>
                
                </div>
            </div>
            
        </Container>
    )
}