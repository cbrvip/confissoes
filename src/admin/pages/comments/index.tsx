import { Container } from "../../components/container";
import './index.scss'
import { useState, useEffect } from "react";
import {
    collection,
    query,
    getDocs,
    orderBy,
    where,
    deleteDoc,
    doc
} from "firebase/firestore";
import { db } from "../../../services/firebaseConnection";
import { Link } from "react-router-dom";
import { Navbar } from '../../components/navbar';
import { FaTrash } from 'react-icons/fa6';

interface PostProps {
  id: string;
  title: string;
  description: string;
  uid: string;
  comments: CommentProps[];
  owner: string;
}

interface CommentProps {
  id: string;
  text: string;
  userId: string;
  username: string;
  createdAt: Date;
}

export function CommentAdm() {
  const [posts, setPosts] = useState<PostProps[]>([]);

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
          const comments = await getCommentsForPost(doc.id);
          postsData.push({
              id: doc.id,
              title: postData.title,
              description: postData.description,
              uid: postData.uid,
              comments: comments,
              owner: postData.owner
          });
      }
  }

    setPosts(postsData);
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
        const commentData = doc.data();
        comments.push({
            id: doc.id,
            text: commentData.text,
            userId: commentData.userId,
            username: commentData.username,
            createdAt: commentData.createdAt.toDate(),
        });
    });

    return comments;
}

async function handleDeleteComment(postId: string, commentId: string) {
    try {
        
      await deleteDoc(doc(db, "comments", commentId));

      setPosts(prevPosts => {
        return prevPosts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              comments: post.comments.filter(comment => comment.id !== commentId)
            };
          }
          return post;
        });
      });
    } catch (error) {
    }
  }

  return (
      <>
      <Container>
          <main>
            <Navbar/>
            <div className="listComments">
              {posts.map( post => (
              <section className="infoPost" key={post.id}>
                  <Link key={post.id} to={`/post/${post.id}`}><h1>Postagem de: {post.owner}</h1></Link>
                  <p>Descrição: {post.description}</p>
                  <div className="comments">
                    <h2>Comentários:</h2>
                      {post.comments.map(comment => (
                          <h3 key={comment.id}>
                              {comment.username}: {comment.text}
                              <button className="btnDelete" onClick={() => handleDeleteComment(post.id, comment.id)}><FaTrash size={16} /></button>
                          </h3>
                      ))}
                  </div>
              </section>
              ))}
          </div>
          </main>
      </Container>
      </>
  )
}