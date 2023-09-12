import { Container } from "../../components/container";
import './index.scss'
import { useState, useEffect } from "react";
import {
    collection,
    query,
    doc,
    getDoc,
    getDocs,
    orderBy
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
  owner: string;
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
                uid: postData.uid,
                comments: [],
                owner: postData.owner
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
    // Carregue os detalhes do usuário para cada post
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
              {posts.map( post => (
              <section className="postFeed" key={post.id}>
                <div className="infoPost">
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
                    <h1>{post.owner}</h1>
                    <h2>{post.description}</h2>
                </div>
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