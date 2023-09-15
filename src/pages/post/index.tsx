import { useEffect, useState, useContext, useRef } from "react";
import { Container } from "../../components/container";
import { useNavigate, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  getDoc,
  doc,
  getDocs,
  collection,
  query,
  where,
  addDoc,
  orderBy
} from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { AuthContext } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import "./index.scss";
import { FaArrowLeft } from "react-icons/fa6"

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

export function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState<PostProps>();
  const [sliderPerView] = useState<number>(1);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [input, setInput] = useState("");
  const [commentList, setCommentList] = useState<CommentProps[]>([]);
  const [showError, setShowError] = useState(false);
  const [postOwner, setPostOwner] = useState<string | null>(null);
  const [postOwnerPhoto, setPostOwnerPhoto] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    async function loadPost() {
      if (!id) {
        return;
      }
    
      const postRef = doc(db, "posts", id);
      const postSnapshot = await getDoc(postRef);
    
      if (!postSnapshot.exists()) {
        navigate("/");
        return;
      }
    
      const postData = postSnapshot.data();
    
      setPost({
        id: postSnapshot.id,
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
  
      const userRef = doc(db, "users", postData.uid);
      const userSnapshot = await getDoc(userRef);
    
      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        setPostOwner(userData.username);
        setPostOwnerPhoto(userData.photo || null);
      }
    
      loadComments();
    }
  
    loadPost();
  }, [id, navigate]);
  
  async function getCommentsForPost(postId: string) {
    const commentsRef = collection(db, "comments");
    const queryRef = query(
      commentsRef,
      where("postId", "==", postId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(queryRef);
    const comments: CommentProps[] = [];

    querySnapshot.forEach((doc) => {
      comments.push({
        id: doc.id,
        text: doc.data().text,
        userId: doc.data().userId,
        username: doc.data().username,
        createdAt: doc.data().createdAt.toDate(),
        photo: doc.data().photo
      });
    });

    return comments;
  }

  async function addComment(
    postId: string,
    userId: string,
    username: string,
    text: string
  ) {
    try {
      const newComment = {
        postId,
        userId,
        username,
        text,
        createdAt: new Date(),
      };

      await addDoc(collection(db, "comments"), newComment);
    } catch (error) {
      console.error("Erro ao adicionar o comentário:", error);
    }
  }

  function handleAddComment() {
    if (!user || !user.uid || !user.username || !post) {
      setShowError(true);
      return;
    }
  
    if (input.trim() === "") return;
  
    const userId = user.uid;
    const username = user.username;
    const postId = post.id;
  
    addComment(postId, userId, username, input);
    setInput("");
    loadComments();
  }
  
  async function loadComments() {
    if (!id) {
      return;
    }
  
    const comments = await getCommentsForPost(id);
  
    const commentsWithPhotos = await Promise.all(comments.map(async (comment) => {
      const userRef = doc(db, "users", comment.userId);
      const userSnapshot = await getDoc(userRef);
      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        return {
          ...comment,
          photo: userData.photo || ''
        };
      } else {
        return comment;
      }
    }));
  
    setCommentList(commentsWithPhotos);
    console.log("Comment List:", commentsWithPhotos);
  }

  useEffect(() => {
    async function loadPost() {
      if (!id) {
        return;
      }
    
      const postRef = doc(db, "posts", id);
      const postSnapshot = await getDoc(postRef);
    
      if (!postSnapshot.exists()) {
        navigate("/");
        return;
      }
    
      const postData = postSnapshot.data();
    
      setPost({
        id: postSnapshot.id,
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
  
      const userRef = doc(db, "users", postData.uid);
      const userSnapshot = await getDoc(userRef);
    
      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        setPostOwner(userData.username);
        setPostOwnerPhoto(userData.photo || null);
      }
    
      loadComments();
    }
  
    loadPost();
  }, [id, navigate]);

  return (
    <Container>
      
      {post && (
        <main className="mainPost">
          <div className="return">
            <Link to={`/`}>
              <h1><span><FaArrowLeft size={25} /></span> Voltar</h1>
            </Link>
          </div>
          <div className="postDetail">
          <Link to={`/profile/${post.username}`}>
            {postOwnerPhoto && (
              <img width={50} height={50} src={postOwnerPhoto} alt={postOwner || ""} className="postOwnerPhoto" />
            )}
          </Link>
            {postOwner && <Link to={`/profile/${post.username}`}><h1>{post.owner}</h1></Link>}
          </div>
          <div className="postDetail">
          <p>{post.description}</p>
          </div>
          <div className="postImg">
            {post?.images.length > 0 ? (
              <Swiper
                slidesPerView={sliderPerView}
                pagination={{ clickable: true }}
                navigation
              >
                {post?.images.map((image) => (
                  <SwiperSlide key={image.name}>
                    <img src={image.url} className="imgPosts" alt={image.name} />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="videoplayer">
              <video
                id="my-player"
                ref={videoRef}
                className="playerVideo"
                preload="auto"
                controls
                controlsList="nodownload"
              >
                <source src={post?.videos[0].url} type="video/mp4" />
              </video>
              </div>
            )}
          </div>
          <article className="postComments">
            <div className="comments">
            {commentList.map((comment) => (
              <div key={comment.id} className="comment">
                <div className="user-info">
                  <Link to={`/profile/${comment.username}`}>
                    <img width={30} height={30} src={comment.photo} alt={comment.username} className="user-photo"/>
                    <span>{comment.username}</span>
                  </Link>
                </div>
                <p>{comment.text}</p>
              </div>
            ))}
            </div>
            <input
              className="inputComment"
              type="text"
              placeholder="Adicione um comentário..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            {showError && (
              <div className="error-message">Você precisa estar logado para adicionar um comentário. <span><Link to={`/login`}>Logar</Link> / <Link to={`/register`}>Cadastrar</Link></span></div>
            )}
            <button className="btn-comment" onClick={handleAddComment}>
              Enviar Comentário
            </button>
            
          </article>
        </main>
      )}
    </Container>
  );
}