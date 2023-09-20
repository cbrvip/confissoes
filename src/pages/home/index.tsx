import { Container } from "../../components/container";
import './index.scss'
import { useState, useEffect } from "react";
import {
    collection,
    query,
    doc,
    getDoc,
    getDocs,
    orderBy,
} from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { Link } from "react-router-dom";

interface PostProps {
  id: string;
  title: string;
  description: string;
  uid: string;
  images: PostImageProps[];
  comments: CommentProps[];
  videos: VideoPostProps[];
  owner: string;
  username: string;
}
interface VideoPostProps {
  uid: string;
  name: string;
  url: string;
}
interface CommentProps {
  id: string;
  text: string;
  userId: string;
  createdAt: Date;
}

interface PostImageProps{
    name: string;
    uid: string;
    url: string;
}


export function Home() {
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [loadImages, setLoadImages] = useState<string[]>([]);
  const [users, setUsers] = useState<Record<string, any>>({});

  useEffect(() => {
      loadPosts();
  }, []);

  async function loadPosts() {
      const postsRef = collection(db, "posts");
      const queryRef = query(postsRef, orderBy("created", "desc"));

      const querySnapshot = await getDocs(queryRef);
      const postsData: PostProps[] = [];

      for (const doc of querySnapshot.docs) {
          const postData = doc.data();
          if (postData.approved === 1) {
            postsData.push({
                id: doc.id,
                title: postData.title,
                description: postData.description,
                images: postData.images,
                videos: postData.videos,
                uid: postData.uid,
                comments: [],
                owner: postData.owner,
                username: postData.username
            });
        }
    }

      setPosts(postsData);
  }

  async function loadUser(uid: string) {
    const userDocRef = doc(db, "users", uid);
    const userDocSnapshot = await getDoc(userDocRef);
    if (userDocSnapshot.exists()) {
      const userData = userDocSnapshot.data();
      console.log("Dados do usuário carregados com sucesso:", userData);
      setUsers((prevUsers) => ({
        ...prevUsers,
        [uid]: userData,
      }));
      console.log("Estado users atualizado:", users);
    } else {
      console.log("Dados do usuário não encontrados para UID:", uid);
    }
  }

  useEffect(() => {
    posts.forEach((post) => {
      if (!users[post.uid]) {
        loadUser(post.uid);
      }
    });
  }, [posts, users]);

  function handleImageLoad(id: string) {
      setLoadImages((prevImageLoaded) => [...prevImageLoaded, id])
  }

  return (
      <>
      <Container>
      <div className="feed">
        <div className="sendConfission">
          <Link to={`/profile/post`}>
          <button className="btn-confission">
            Envie sua Confissão
          </button>
          </Link>
        </div>
              {posts.map( post => (
              <section className="postFeed" key={post.id}>
                <div className="infoPost">
                  <Link to={`/profile/${post.username}`}>
                    {users[post.uid] ? (
                        <img
                        src={users[post.uid].photo}
                        alt={`Foto de ${users[post.uid].name}`}
                        width={45}
                        height={45}
                        className="userPhoto"
                        />
                        ) : (
                            <div>Carregando...</div>
                        )}
                  </Link>
                   <Link to={`/profile/${post.username}`}><h1>{post.owner}</h1></Link>
                </div>
                <div className="infoPost">
                <h2>{post.description}</h2>
                </div>
                  <div className="pictureFeed">
                  <Link key={post.id} to={`/post/${post.id}`}>
                  {post.images?.[0]?.url && (
                    <img
                      src={post.images[0]?.url}
                      alt=""
                      onLoad={() => handleImageLoad(post.id)}
                      style={{ display: loadImages.includes(post.id) ? "block" : "none" }}
                    />
                  )}

                  {post.videos?.[0]?.url && (
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
                  )}
                </Link>
                  
                  </div>
                  <div className="addComment">
                  
                <Link key={post.id} to={`/post/${post.id}`}>
                    <button className="btn-comentar">
                        Comentar
                    </button>
                </Link>
                </div>
              </section>
              
              ))}
          </div>
      </Container>
      </>
  )
}