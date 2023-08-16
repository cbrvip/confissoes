import { Container } from "../../components/container";
import { useEffect, useState, useContext, ChangeEvent } from "react";
import { FiTrash2 } from "react-icons/fi";
import { collection, getDocs, where, query, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../services/firebaseConnection";
import { AuthContext } from "../../contexts/AuthContext";
import './index.scss';
import { Link } from "react-router-dom";
import { ref, deleteObject, uploadBytes, getDownloadURL } from "firebase/storage";
import toast from "react-hot-toast";

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

interface PhotoProfile {
    name: string;
    uid: string;
    url: string;
}


export function Profile() {
    const { signed, user } = useContext(AuthContext);
    const [posts, setPosts] = useState<PostProps[]>([]);
    const [setProfileImageUrl] = useState<string | null>(null);
    const [photoProfile, setPhotoProfile] = useState<PhotoProfile[]>([]);

    async function handleProfileImageUpload(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files[0]) {
            const image = e.target.files[0];

            if (image.type === 'image/jpeg' || image.type === 'image/png') {
                try {
                    const uploadRef = ref(storage, `profileImages/${user?.uid}/${image.name}`);
                    await uploadBytes(uploadRef, image);

                    const downloadURL = await getDownloadURL(uploadRef);

                    if(!user) return;

                    const userDocRef = doc(db, "users", user?.uid);
                    await updateDoc(userDocRef, {
                        photo: downloadURL
                    });

                    setProfileImageUrl(downloadURL);

                    setPhotoProfile([
                        ...photoProfile,
                        {
                            uid: user?.uid || "",
                            name: image.name,
                            url: downloadURL
                        }
                    ]);

                    toast.success("Imagem do perfil carregada com sucesso!");
                } catch (error) {
                    console.error("Erro ao fazer o upload da imagem do perfil:", error);
                    toast.error("Erro ao carregar a imagem do perfil. Por favor, tente novamente.");
                }
            } else {
                toast.error('A imagem deve ser JPEG ou PNG!');
            }
        }
    }


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
            const imagePath = `images/<span class="math-inline">\{image\.uid\}/</span>{image.name}`
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
                    <img
                        src={user?.photo || "https://publicdomainvectors.org/photos/abstract-user-flat-4.png"}
                        className="photoPerfil"
                    />
                </div>

                <input type="file" onSubmit={handleProfileImageUpload} />
                
                <h1>{user?.name || "Nome do Usuário"}</h1>
                <p><Link to={`/profile/${user?.uid}`}>{user?.username || "Username"}</Link></p>

                <div className="buttons">
                    <Link to={`/profile/post`}>
                    <button className="btnProfile">Novo Post</button>
                    </Link>
                </div>

                <div className="myPosts">
                    <h2>Publicações</h2>

                    <div className="posts">
                    {posts.map( post => (
                        <section key={post.id} className="recentPost">
                            
                            <Link key={post.id} to={`/post/${post.id}`}>
                                <img
                                src={post.images[0]?.url}
                                alt=""
                                className="imgProfile"
                                />
                            </Link>
                            <button
                            className="btn-delete"
                            onClick={ () =>  handleDeletePost(post) }
                            >
                                <FiTrash2 size={26} color="#fff" />
                            </button>
                        </section>
                        ))}
                    </div>
                
                </div>
            </div>
            
        </Container>
    )
}