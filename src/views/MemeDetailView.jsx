import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faTrash } from '@fortawesome/free-solid-svg-icons';

// Replace with real user info in your app
const currentUserId = 1;

export default function MemeDetailView() {
  const { id } = useParams();
  const [meme, setMeme] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  // Fetch meme data
  const fetchMeme = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/memes/${id}`);
      setMeme({
        ...res.data,
        likedByUser: false,
        likeId: null,
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch comments for this meme
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

  // Like/unlike handler
  const handleLikeToggle = async () => {
    try {
      if (meme.likedByUser) {
        await axios.delete(`http://localhost:3000/likes/${meme.likeId}?userId=${currentUserId}`);
        setMeme({
          ...meme,
          likedByUser: false,
          likeId: null,
          likeCount: meme.likeCount - 1,
        });
      } else {
        const res = await axios.post('http://localhost:3000/likes', {
          userId: currentUserId,
          memeId: meme.id,
        });
        setMeme({
          ...meme,
          likedByUser: true,
          likeId: res.data.id,
          likeCount: meme.likeCount + 1,
        });
      }
    } catch (err) {
      console.error('Error toggling like:', err.response?.data || err);
    }
  };

  // Post new comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await axios.post('http://localhost:3000/comments', {
        userId: currentUserId,
        memeId: meme.id,
        body: newComment,
      });
      setNewComment('');
      fetchComments(); // Refresh comments
    } catch (err) {
      console.error('Error posting comment:', err.response?.data || err);
    }
  };

  // Delete a comment
  const handleDeleteComment = async (commentId, authorId) => {
    if (authorId !== currentUserId) return;

    try {
      await axios.delete(`http://localhost:3000/comments/${commentId}?userId=${currentUserId}`);
      fetchComments();
    } catch (err) {
      console.error('Error deleting comment:', err.response?.data || err);
    }
  };

  if (!meme) return <p>Cargando...</p>;

  return (
    <div className="body">
      <div className="meme">
        <h2 className="title">{meme.title}</h2>
        <img src={meme.url} alt={meme.title} />
        <button
          onClick={handleLikeToggle}
          className="meme-likes"
          style={{
            color: meme.likedByUser ? 'blue' : '#444',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '1rem',
            marginTop: '10px',
          }}
        >
          <FontAwesomeIcon icon={faThumbsUp} />
          {meme.likeCount}
        </button>
      </div>

      <div className="comments">
        <h3>Comentarios</h3>

        <form onSubmit={handleCommentSubmit} style={{ marginBottom: '1rem', width: '100%' }}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows="3"
            placeholder="Escribe un comentario..."
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '10px',
              border: '1px solid #ccc',
              resize: 'none',
            }}
          />
          <button
            type="submit"
            style={{
              marginTop: '8px',
              padding: '8px 16px',
              borderRadius: '10px',
              backgroundColor: '#333',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Publicar
          </button>
        </form>

        <div className="comments-list">
          {comments.map((comment) => (
            <div className="comment" key={comment.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>
                  <span className="username">{comment.username}:</span> {comment.body}
                </span>
                {comment.userId === currentUserId && (
                  <FontAwesomeIcon
                    icon={faTrash}
                    onClick={() => handleDeleteComment(comment.id, comment.userId)}
                    style={{ color: 'red', cursor: 'pointer' }}
                    title="Eliminar"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
