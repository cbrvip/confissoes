import { Container } from "../../components/container";
import { useEffect, useState, useContext, ChangeEvent } from "react";
import { FiTrash2 } from "react-icons/fi";
import { collection, getDocs, where, query, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../services/firebaseConnection";
import { AuthContext } from "../../contexts/AuthContext";
import './index.scss';
import { Link, useParams } from "react-router-dom";
import { ref, deleteObject, uploadBytes, getDownloadURL } from "firebase/storage";
import toast from "react-hot-toast";

interface PostProps {
    id: string;
    name: string;
    title: string;
    description: string;
    images: ImagePostProps[];
    videos: VideoPostProps[];
    uid: string;
  }
  
  interface VideoPostProps {
    name: string;
    uid: string;
    url: string;
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
interface UserInfo {
    name: string;
    email: string;
    photo: string;
  }


export function Profile() {
    const { signed, user } = useContext(AuthContext);
    const [posts, setPosts] = useState<PostProps[]>([]);
    const [profileImageUrl, setProfileImageUrl] = useState<string | null>("");
    const [photoProfile, setPhotoProfile] = useState<PhotoProfile[]>([]);
    const { username } = useParams(); // Obtenha o 'username' da URL
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

    useEffect(() => {
        async function fetchUserInfo() {
            console.log("Username da URL:", username);
          try {
            if (username && typeof username === 'string' && username.trim() !== '') {
              const userQuery = query(collection(db, "users"), where("username", "==", username));
              const userQuerySnapshot = await getDocs(userQuery);
    
              if (!userQuerySnapshot.empty) {
                const userData = userQuerySnapshot.docs[0].data() as UserInfo;
                setUserInfo(userData);
              } else {
                console.log("Usuário não encontrado");
                // Lide com o caso em que o usuário não é encontrado
              }
            }
          } catch (error) {
            console.error("Erro ao buscar informações do usuário:", error);
          }
        }
    
        fetchUserInfo();
      }, [username]);
    
    async function handleProfileImageUpload(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files[0]) {
            const image = e.target.files[0];
    
            if (image.type === 'image/jpeg' || image.type === 'image/png') {
                try {
                    const uploadRef = ref(storage, `profileImages/${user?.uid}/${image.name}`);
                    await uploadBytes(uploadRef, image);
    
                    const downloadURL = await getDownloadURL(uploadRef);
    
                    if (!user) return;
    
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
          if (!username) {
            return;
          }
          const usersRef = collection(db, "users");
          const userQuery = query(usersRef, where("username", "==", username));
          
          getDocs(userQuery)
            .then((userQuerySnapshot) => {
              if (!userQuerySnapshot.empty) {
                const userDoc = userQuerySnapshot.docs[0];
                const userUid = userDoc.id;
                const postsRef = collection(db, "posts");
                const queryRef = query(postsRef, where("uid", "==", userUid));
                
                getDocs(queryRef).then((snapshot) => {
                  // Atualize os posts com os dados do usuário cujo perfil está sendo visualizado
                  let listposts = [] as PostProps[];
      
                  snapshot.forEach((doc) => {
                    listposts.push({
                      id: doc.id,
                      name: doc.data().name,
                      title: doc.data().title,
                      description: doc.data().description,
                      images: doc.data().images,
                      videos: doc.data().videos,
                      uid: doc.data().uid,
                    });
                  });
      
                  setPosts(listposts);
                });
              }
            })
            .catch((error) => {
              console.error("Erro ao buscar usuário:", error);
            });
        }
      
        loadPosts();
      }, [username]);

      async function handleDeletePost(post: PostProps) {
        // Verifique se o usuário logado é o proprietário do post antes de permitir a exclusão
        if (user && user.uid === post.uid) {
            const itemPost = post;
            const docRef = doc(db, "posts", itemPost.id);
            await deleteDoc(docRef);

            itemPost.images.map(async (image) => {
                const imagePath = `images/${image.uid}/${image.name}`;
                const imageRef = ref(storage, imagePath)

                try {
                    await deleteObject(imageRef);
                    setPosts(posts.filter((post) => post.id !== itemPost.id));
                } catch (err) {
                    console.error("Erro ao excluir imagem:", err);
                }
            });
        } else {
            // Exiba uma mensagem de erro ou feedback para o usuário
            console.error("Você não tem permissão para excluir este post.");
            // Exibir uma mensagem de erro para o usuário (por exemplo, usando um toast)
            toast.error("Você não tem permissão para excluir este post.");
        }
    }

    return (
        <Container>
          <div className="mainProfile">
            {userInfo ? (
              <div>
                <div className="userPhoto">
                {signed && user && user.username === username && (
                  <input
                    type="file"
                    id="profileImageInput"
                    onChange={handleProfileImageUpload}
                    style={{ display: 'none' }}
                    accept="image/jpeg, image/png"
                  />
                  )}
                  <label htmlFor="profileImageInput">
                    <img
                      src={userInfo.photo || profileImageUrl || "https://publicdomainvectors.org/photos/abstract-user-flat-4.png"}
                      className="photoPerfil"
                      style={{ cursor: 'pointer' }}
                    />
                  </label>
                </div>
                <h1>{userInfo.name || "Nome do Usuário"}</h1>
                <p><Link to={`/profile/${username}`}>{username || "Username"}</Link></p>
                <div className="buttons">
                {signed && user && user.username === username && (
                    <Link to={`/profile/post`}>
                      <button className="btnProfile">Novo Post</button>
                    </Link>
                  )}
                </div>
                {posts.map((post) => (
                <div className="mainPost">
                  <div className="postDetail">
                  <img
                      src={userInfo.photo}
                      className="user-photo"
                      style={{ cursor: 'pointer' }}
                    />
                    <h2><Link to={`/profile/${username}`}>{username || "Username"}</Link></h2>
                    <Link key={post.id} to={`/post/${post.id}`}>
                    <h3>{post.description}</h3>
                    </Link>
                  </div>
                  
                  <div className="postImg">
                  {post.images.length > 0 ? (
                      <Link key={post.id} to={`/post/${post.id}`}>
                        <img src={post.images[0]?.url} alt="" className="imgPost" />
                      </Link>
                    ) : post.videos.length > 0 ? (
                        <div className="videoplayer">
                        <video
                            id="my-player"
                            className="playerVideo"
                            preload="auto"
                            controls
                            controlsList="nodownload"
                        >
                            <source src={post?.videos[0].url} type="video/mp4" />
                        </video>
                        </div>
                    ) : (
                      <p></p>
                    )}
                  </div>
                  {signed && user && user.uid === post.uid && (
                      <button
                        className="btn-delete"
                        onClick={() => handleDeletePost(post)}
                      >
                       <FiTrash2 size={24} /> Excluir
                      </button>
                    )}
                </div>
                ))}
              </div>
            ) : (
              <p>Carregando informações do usuário...</p>
            )}
          </div>
        </Container>
      )
}