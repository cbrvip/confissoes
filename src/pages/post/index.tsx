import { useEffect, useState, useContext } from "react"
import { Container } from "../../components/container"
import { useNavigate, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { getDoc, doc, getDocs, collection, query, where, addDoc, orderBy, serverTimestamp } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { AuthContext } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import './index.scss';


interface CommentProps {
    id: string;
    text: string;
    userId: string;
    username: string;
    createdAt: Date;
}

interface ImagePostProps {
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
    comments: CommentProps[];
}

export function PostDetail() {

    const { id } = useParams();
    const [post, setPost] = useState<PostProps>();
    const [sliderPerView] = useState<number>(1);
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [input, setInput] = useState("");

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

            const comments = await getCommentsForPost(id);

            setPost({
                id: postSnapshot.id,
                title: postData.title,
                description: postData.description,
                name: postData.name,
                uid: postData.uid,
                owner: postData.owner,
                created: postData.created,
                images: postData.images,
                comments: comments,
            });
        }

        loadPost();
    }, [id]);

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
            });
        });

        return comments;
    }

    async function addComment(postId: string, userId: string, username: string, text: string) {
        try {
          const newComment = {
            postId,
            userId,
            username,
            text,
            createdAt: serverTimestamp(),
          };
      
          await addDoc(collection(db, "comments"), newComment);
        } catch (error) {
          console.error("Erro ao adicionar o comentário:", error);
        }
      }
  
      function handleAddComment() {
        if (!user || !user.uid || !user.username || !post) {
            return;
        }
    
        if (input.trim() === "") return;
    
        const userId = user.uid;
        const username = user.username;
        const postId = post.id;
    
        
        addComment(postId, userId, username, input);
    
        setInput("");
    }
    

    
    
    return (
        <Container>
            { post && (
                <main className="mainPost">
                    <div className="postImg">
                    <Swiper
                        slidesPerView={sliderPerView}
                        pagination={{ clickable: true }}
                        navigation
                        className="w-full"
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
                                {post.comments.map(comment => (
                                <p key={comment.id}>
                                    <Link to="">{comment.username} </Link>: <span>{comment.text}</span>
                                </p>
                            ))}
                        </div>
                        <input
                            className="inputComment"
                            type="text"
                            placeholder="Adicione um comentário..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button className="btn-comment" onClick={handleAddComment}>Enviar Comentário</button>
                    </article>
                </main>
            ) }
        </Container>
    )
}