import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';

export default function MemeDetailView() {
  const { id } = useParams();
  const [meme, setMeme] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const navigate = useNavigate();

  // Obtener los datos del meme
  const fetchMeme = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/memes/${id}`);
      setMeme({
        ...res.data,
        likeId: null,
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Obtener los comentarios del meme
  const fetchComments = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/memes/${id}/comments`);
      setComments(res.data);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  useEffect(() => {
    fetchMeme();
    fetchComments();
  }, [id]);

  const currentUserId = localStorage.getItem('userId');

  // Manejo de dar o quitar like
  const handleLikeToggle = async () => {
    try {
      const isLiked = await axios.get(`http://localhost:3000/likes?memeId=${meme.id}&userId=${currentUserId}`);
      if (isLiked.data) {
        // DELETE /likes/:likeId?userId=...
        await axios.delete(`http://localhost:3000/likes?memeId=${meme.id}&userId=${currentUserId}`);
        fetchMeme();
      } else {
        // POST /likes
        await axios.post('http://localhost:3000/likes', {
          userId: currentUserId,
          memeId: meme.id,
        });
        fetchMeme();
      }
    } catch (err) {
      console.error('Error toggling like:', err.response?.data || err);
    }
  };

  // Enviar un nuevo comentario
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      // POST /comments
      await axios.post('http://localhost:3000/comments', {
        userId: currentUserId,
        memeId: meme.id,
        body: newComment,
      });
      setNewComment('');
      fetchComments(); // Refrescar comentarios
    } catch (err) {
      console.error('Error posting comment:', err.response?.data || err);
    }
  };

  // Eliminar un comentario
  const handleDeleteComment = async (commentId, authorId) => {
    if (authorId != currentUserId) return;

    try {
      // DELETE /comments/:id?userId=...
      await axios.delete(`http://localhost:3000/comments/${commentId}?userId=${currentUserId}`);
      fetchComments();
    } catch (err) {
      console.error('Error deleting comment:', err.response?.data || err);
    }
  };

  const handleDeleteMeme = async () => {
    try {
      await axios.delete(`http://localhost:3000/memes/${meme.id}`);
      navigate('/memes');
    } catch (err) {
      console.error(err);
    }
  };

  if (!meme) return <p>Cargando...</p>;

  return (
    <div className="body">
      <h2 className="title">{meme.title}</h2>
      {/* Contenedor que coloca la imagen a la izquierda y los comentarios a la derecha */}
      <div className="meme-detail-container">
        <div className="meme-content">
          <img src={meme.url} alt={meme.title} className="meme-img" />
        </div>

        <div className="comments">
          <h3>Comentarios</h3>
          <form onSubmit={handleCommentSubmit}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows="3"
              placeholder="Escribe un comentario..."
            />
            <div className="comment-buttons">
              <button type="submit" className="button">Publicar</button>
              <button
                onClick={handleLikeToggle}
                className="meme-likes"
              >
                <FontAwesomeIcon icon={faThumbsUp} />
                {meme.likeCount}
              </button>
              <button onClick={() => handleDeleteMeme()} className="button">
                <FontAwesomeIcon icon={faTrash} /> Delete
              </button>
            </div>
          </form>

          <div className="comments-list">
            {comments.map((comment) => (
              <div className="comment" key={comment.id}>
                <span>
                  <span className="username">{comment.username}:</span> {comment.body}
                </span>
                {comment.userId == currentUserId && (
                  <FontAwesomeIcon
                    icon={faTrash}
                    onClick={() => handleDeleteComment(comment.id, comment.userId)}
                    title="Eliminar"
                    style={{ cursor: 'pointer' }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Link to={-1}>
        <button className="button">Volver</button>
      </Link>
    </div>
  );
}
