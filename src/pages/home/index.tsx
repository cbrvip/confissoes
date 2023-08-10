import { Container } from "../../components/container";
import './index.scss'
import CommentList from "../../components/comments";
import { useState, useEffect, useContext } from "react";
import {
    collection,
    query,
    getDocs,
    orderBy,
    where,
    addDoc,
    serverTimestamp
} from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

interface PostProps {
  id: string;
  title: string;
  description: string;
  uid: string;
  images: PostImageProps[];
  comments: CommentProps[];
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
    const [input, setInput] = useState("");
    const { user } = useContext(AuthContext);

    useEffect(() => {
      loadPostsAndComments();
    }, []);

    async function loadPostsAndComments() {
      const postsRef = collection(db, "posts");
      const queryRef = query(postsRef, orderBy("created", "desc"));
  
      const querySnapshot = await getDocs(queryRef);
      const postsWithComments: PostProps[] = [];
  
      for (const doc of querySnapshot.docs) {
        const postData = doc.data();
        const comments = await getCommentsForPost(doc.id);
        postsWithComments.push({
          id: doc.id,
          title: postData.title,
          description: postData.description,
          images: postData.images,
          uid: postData.uid,
          comments: comments,
        });
      }
  
      setPosts(postsWithComments);
    }
  
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
          createdAt: doc.data().createdAt.toDate(),
        });
      });
  
      return comments;
    }

    async function addComment(postId: string, userId: string, text: string) {
      try {
        const newComment = {
          postId,
          userId,
          text,
          createdAt: serverTimestamp(),
        };
    
        await addDoc(collection(db, "comments"), newComment);
      } catch (error) {
        console.error("Erro ao adicionar o comentário:", error);
      }
    }

    function handleAddComment(postId: string) {

      if (!user || !user.uid) {
        return;
      }

      if (input.trim() === "") return;
      
      const userId = user.uid;
    
      addComment(postId, userId, input);
    
      setInput("");
    }

    
    function handleImageLoad(id: string) {
        setLoadImages((prevImageLoaded) => [...prevImageLoaded, id])
    }

    return (
        <>
        <Container>
            
            <div className="feed">
                {posts.map( post => (
                <section className="postFeed" key={post.id}>
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
                        <CommentList comments={post.comments} />
                        </div>
                        <input
                          className="inputComment"
                          type="text"
                          placeholder="Adicione um comentário..."
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                        />
                        <button onClick={() => handleAddComment(post.id)}>Enviar Comentário</button>
                    </article>
                </section>
                
                ))}
                
            </div>
        </Container>
        </>
    )
}