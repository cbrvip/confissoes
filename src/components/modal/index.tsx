import React from "react";

function Modal({ post, onClose }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <h1>{post.title}</h1>
        <p>{post.description}</p>
        <p>Nome: {post.name}</p>
        <p>UID: {post.uid}</p>
        {/* Exibir outros detalhes do post aqui */}
        <h2>Comentários:</h2>
        <ul>
          {selectedPostComments.map((comment) => (
            <li key={comment.id}>
              <p>{comment.text}</p>
              <p>Usuário: {comment.username}</p>
              {/* Exibir outros detalhes do comentário aqui */}
            </li>
          ))}
        </ul>
        <button onClick={onClose}>Fechar</button>
      </div>
    </div>
  );
}

export default Modal;