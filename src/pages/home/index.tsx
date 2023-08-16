import { Container } from "../../components/container";
import './index.scss'
import { useState, useEffect } from "react";
import {
    collection,
    query,
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
            });
        }
    }

      setPosts(postsData);
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
                      className="w-full rounded-lg bg-slate-200"
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
              </section>
              
              ))}
              
          </div>
      </Container>
      </>
  )
}