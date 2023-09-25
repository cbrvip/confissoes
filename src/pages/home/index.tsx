import { Container } from "../../components/container";
import './index.scss'
import { useState, useEffect, useContext } from "react";
import {
    collection,
    query,
    doc,
    getDoc,
    getDocs,
    orderBy,
    addDoc,
    where
} from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

interface CommentProps {
  id: string;
  text: string;
  userId: string;
  username: string;
  createdAt: Date;
  photo: string;
}

interface ImagePostProps {
  uid: string;
  name: string;
  url: string;
}

interface VideoPostProps {
  uid: string;
  name: string;
  url: string;
}

interface PostProps {
  id: string;
  title: string;
  description: string;
  name: string;
  uid: string;
  owner: string;
  created: string;
  images: ImagePostProps[];
  videos: VideoPostProps[];
  comments: CommentProps[];
  username: string;
}


export function Home() {
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [loadImages, setLoadImages] = useState<string[]>([]);
  const [users, setUsers] = useState<Record<string, any>>({});
  const [commentList, setCommentList] = useState<Record<string, CommentProps[]>>({});
  const [input, setInput] = useState("");
  const [showError, setShowError] = useState(false);
  const { user } = useContext(AuthContext);
  const [commentVisibility, setCommentVisibility] = useState<Record<string, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

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
              name: postData.name,
              uid: postData.uid,
              owner: postData.owner,
              created: postData.created,
              images: postData.images,
              comments: [],
              videos: postData.videos,
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
      setUsers((prevUsers) => ({
        ...prevUsers,
        [uid]: userData,
      }));
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

  async function addComment(
    postId: string,
    userId: string,
    username: string,
    text: string
  ) {
    try {
      // Recupere o URL da foto do usuário que fez o comentário
      const userDocRef = doc(db, "users", userId);
      const userDocSnapshot = await getDoc(userDocRef);
  
      let userPhoto = "";
  
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        userPhoto = userData.photo;
      }
  
      const newComment = {
        postId,
        userId,
        username,
        text,
        createdAt: new Date(),
        photo: userPhoto,
      };
  
      await addDoc(collection(db, "comments"), newComment);
  
      // Após adicionar o comentário com sucesso, atualize os comentários do post
      loadCommentsForPost(postId);
    } catch (error) {
      console.error("Erro ao adicionar o comentário:", error);
    }
  }

  function handleAddComment(post: PostProps, commentText: string) {
    if (!user || !user.uid || !user.username || !post) {
      setShowError(true);
      return;
    }
  
    if (commentText.trim() === "") return;
  
    const userId = user.uid;
    const username = user.username;
    const postId = post.id;
  
    addComment(postId, userId, username, commentText);
    setInput(""); // Limpe o texto do comentário após adicionar
  }

async function loadCommentsForPost(postId: string) {
  try {
    const commentsRef = collection(db, 'comments');
    const queryRef = query(
      commentsRef,
      where('postId', '==', postId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(queryRef);
    const comments: CommentProps[] = [];

    querySnapshot.forEach((doc) => {
      const commentData = doc.data();
      comments.push({
        id: doc.id,
        text: commentData.text,
        userId: commentData.userId,
        username: commentData.username,
        createdAt: commentData.createdAt.toDate(),
        photo: commentData.photo,
      });
    });

    // Atualize os comentários do post com os comentários carregados
    setCommentList((prevCommentList) => ({
      ...prevCommentList,
      [postId]: comments,
    }));

    // Defina a visibilidade dos comentários como verdadeira
    setCommentVisibility((prevVisibility) => ({
      ...prevVisibility,
      [postId]: true,
    }));
  } catch (error) {
    console.error('Erro ao carregar comentários:', error);
  }
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
                  <article className="postComments">
  <div className="comments">
    {commentList[post.id]?.map((comment) => (
      <div key={comment.id} className="comment">
       <div className="user-info">
  {users[comment.userId] ? (
    <Link to={`/profile/${comment.username}`}>
      <img
        width={30}
        height={30}
        src={users[comment.userId].photo} // Acesse a foto do usuário usando o ID do usuário
        alt={comment.username}
        className="user-photo"
      />
      <span>{comment.username}</span>
    </Link>
  ) : (
    <div><img
    width={30}
    height={30}
    src="" // Acesse a foto do usuário usando o ID do usuário
    alt=""
    className="user-photo"
  /></div>
  )}
</div>
        <p>{comment.text}</p>
      </div>
    ))}
  </div>
  
  {commentVisibility[post.id] && ( // Mostrar apenas quando os comentários estão visíveis
    <div className="comment-input">
      <textarea
        className="inputComment"
        placeholder="Adicione um comentário..."
        value={commentInputs[post.id] || ''}
        onChange={(e) => {
          setCommentInputs((prevInputs) => ({
            ...prevInputs,
            [post.id]: e.target.value,
          }));
        }}
      />
      {showError && (
        <div className="error-message">Você precisa estar logado para adicionar um comentário. <span><Link to={`/login`}>Logar</Link> / <Link to={`/register`}>Cadastrar</Link></span></div>
      )}
      <button className="btn-comment" onClick={() => handleAddComment(post, commentInputs[post.id])}>
        Enviar Comentário
      </button>
    </div>
  )}
</article>
<div className="addComment">
  <button
    className="btn-comentar"
    onClick={() => {
      if (commentVisibility[post.id]) {
        // Se os comentários estiverem visíveis, oculte-os
        setCommentVisibility((prevVisibility) => ({
          ...prevVisibility,
          [post.id]: false,
        }));
      } else {
        // Se os comentários estiverem ocultos, carregue-os
        loadCommentsForPost(post.id);
      }
    }}
  >
    {commentVisibility[post.id] ? 'Fechar comentários' : 'Ver comentários'}
  </button>
</div>
              </section>
              
              ))}
          </div>
      </Container>
      </>
  )
}