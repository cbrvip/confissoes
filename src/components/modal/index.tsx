import React from "react";

interface ModalProps {
  post: PostProps;
  onClose: () => void;
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

function Modal({ post, onClose }: ModalProps) {
  return (
    <div className="modal">
      <div className="modal-content">
        <button onClick={onClose}>&times;</button>
        <h2>{post.title}</h2>
        <p>{post.description}</p>
        <h3>{post.owner}</h3>
        {post.images?.[0]?.url && (
          <img src={post.images[0]?.url} alt="" />
        )}
        {post.comments.length > 0 && (
          <div>
            <h3>Comentários:</h3>
            <ul>
              {post.comments.map((comment) => (
                <li key={comment.id}>
                  <div className="user-info">
                    <img
                      width={30}
                      height={30}
                      src={comment.photo}
                      alt={comment.username}
                      className="user-photo"
                    />
                    <span>{comment.username}</span>
                  </div>
                  <p>{comment.text}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;