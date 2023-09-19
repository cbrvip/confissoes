import { Container } from "../../../components/container";
import { useState, useEffect } from "react";
import {
    collection,
    query,
    getDocs,
    orderBy,
    updateDoc,
    doc,
    getDoc
} from "firebase/firestore";
import { db } from "../../../../services/firebaseConnection";
import { Link } from "react-router-dom";
import './index.scss';
import { Navbar } from "../../../components/navbar";

interface PostProps {
    id: string;
    title: string;
    description: string;
    uid: string;
    approved: number;
    images: PostImageProps[];
    comments: CommentProps[];
    username: string;
    owner: string;
    videos: VideoPostProps[];
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
  
  interface VideoPostProps {
      uid: string;
      name: string;
      url: string;
    }
  
  
  export function PostsAdminApproved() {
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
                approved: postData.approved,
                uid: postData.uid,
                comments: [],
                username: postData.username,
                owner: postData.owner,
                videos: postData.videos
            });
        }
    }

      setPosts(postsData);
  }

  function handleImageLoad(id: string) {
      setLoadImages((prevImageLoaded) => [...prevImageLoaded, id])
  }

  async function disapprovePost(postId: string) {
    const postRef = doc(db, "posts", postId);

    try {
        await updateDoc(postRef, {
            approved: 0,
        });

        setPosts((prevPosts) =>
            prevPosts.map((post) =>
                post.id === postId ? { ...post, approved: 0 } : post
            )
        );

        console.log("Post disapproved successfully!");
        window.location.reload();
    } catch (error) {
        console.error("Error disapproving post:", error);
    }
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

  return (
    <>
    <Container>
    <Navbar />
    </Container>
    <div className="boxingg">
    <Container>
      <main>
        
        <div className="feedAdmin">
            {posts.map( post => (
            <section className="postFeedAdmin" key={post.id}>
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
                      <h1>{post.owner}</h1>
                </Link>
              </div>
                <div
                    className="w-full rounded-lg bg-slate-200"
                    style={{ display: loadImages.includes(post.id) ? "none": "block"}}
                ></div>
                <div className="pictureFeed">
                <Link key={post.id} to={`/post/${post.id}`}>
                {post.images?.[0]?.url && (
                  <img
                    src={post.images[0]?.url}
                    alt=""
                    className="imgPostAdminFeed"
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
                <h1>{post.description}</h1>
              </Link>
                </div>
                <div className="adminControls">
                {post.approved === 1 && (
                                    <button
                                    onClick={() => disapprovePost(post.id)}
                                    className="disapproveButton"
                                >
                                    Remover do Feed
                                </button>
                                )}
                              {post.approved === 1 && (
                                    <button
                                    onClick={() => disapprovePost(post.id)}
                                    className="disapproveButton"
                                >
                                    Rejeitar Postagem
                                </button>
                                )}
                          </div>
            </section>

            
            
            ))}
            
        </div>
        </main>
    </Container>
    </div>
    </>
)
}