import React from "react";

interface CommentProps {
    id: string;
    text: string;
    userId: string;
    createdAt: Date;
  }

interface CommentListProps {
  comments: CommentProps[];
}

const CommentList: React.FC<CommentListProps> = ({ comments }) => {
  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <div key={comment.id} className="comment-item">
          <p>{comment.text}</p>
          <p>Usuário: {comment.userId}</p>
          <p>Data: {comment.createdAt.toISOString()}</p>
        </div>
      ))}
    </div>
  );
};

export default CommentList;