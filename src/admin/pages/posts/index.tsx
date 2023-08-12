import { Container } from "../../components/container";
import { useState, useEffect } from "react";
import {
    collection,
    query,
    getDocs,
    orderBy,
    updateDoc,
    doc
} from "firebase/firestore";
import { db } from "../../../services/firebaseConnection";
import { Link } from "react-router-dom";
import './index.scss';
import { Navbar } from "../../components/navbar";

interface PostProps {
  id: string;
  title: string;
  description: string;
  uid: string;
  approved: number;
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


export function PostsAdmin() {
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
          if (postData.approved === 0) {
            postsData.push({
                id: doc.id,
                title: postData.title,
                description: postData.description,
                images: postData.images,
                approved: postData.approved,
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

  async function approvePost(postId: string) {
    const postRef = doc(db, "posts", postId);

    try {
        await updateDoc(postRef, {
            approved: 1,
        });

        setPosts((prevPosts) =>
            prevPosts.map((post) =>
                post.id === postId ? { ...post, approved: 1 } : post
            )
        );

        console.log("Post approved successfully!");
    } catch (error) {
        console.error("Error approving post:", error);
    }
}

  return (
      <>
      <Container>
        <main>
          <Navbar />
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
                  <div className="adminControls">
                                {post.approved === 0 && (
                                    <button
                                        onClick={() => approvePost(post.id)}
                                        className="approveButton"
                                    >
                                        Approve
                                    </button>
                                )}
                            </div>
              </section>

              
              
              ))}
              
          </div>
          </main>
      </Container>
      </>
  )
}