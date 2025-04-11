import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faTrash } from '@fortawesome/free-solid-svg-icons';
import { getUserName } from '../utils/getUserName';



export default function TopMemesView() {
  const [topMemes, setTopMemes] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  
  const currentUserId = localStorage.getItem('userId');
  const fetchMemes = async () => {
    try {
      const res = await axios.get('http://localhost:3000/memes/sorted');
      const memesWithNames = await Promise.all(
        res.data.map(async (meme) => {
          let userName = '';
          try {
            userName = await getUserName(meme.userId);
          } catch (error) {
            userName = 'Usuario desconocido';
            console.log('Error fetching user name:', error);
          }
          return { ...meme, userName };
        })
      );
      setTopMemes(memesWithNames);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMemes();
  }, []);

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  const postMeme = async (event) => {
    event.preventDefault();
    const title = event.target.title.value;
    const url = event.target.url.value;
    try {
      await axios.post('http://localhost:3000/memes', {
        title,
        url,
        likecount: 0,
        userId: currentUserId,
      });
      fetchMemes();
      closeDialog();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMeme = async (meme) => {
    try {
      if (meme.userId != currentUserId) {
        alert('You are not authorized to delete this meme');
        return;
      }
      await axios.delete(`http://localhost:3000/memes/${meme.id}`);
      fetchMemes();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLikeToggle = async (meme) => {
    try {
      // Verificamos si el usuario ya dio like consultando el endpoint de likes.
      const isLiked = await axios.get(`http://localhost:3000/likes?memeId=${meme.id}&userId=${currentUserId}`);
      if (isLiked.data) {
        // Si ya dio like, se elimina.
        await axios.delete(`http://localhost:3000/likes?memeId=${meme.id}&userId=${currentUserId}`);
        fetchMemes();
      } else {
        // Si no, se da like.
        await axios.post('http://localhost:3000/likes', {
          userId: currentUserId,
          memeId: meme.id,
        });
        fetchMemes();
      }
    } catch (err) {
      console.error('Error toggling like:', err.response?.data || err);
    }
  };

  return (
    <div className="body">
      <h2 className="title">Mejores Memes</h2>
      <div className="memes-column-content">
        {topMemes.map((meme) => (
          <div key={meme.id} className="meme-card">
            <p className="meme-title"><strong>{meme.userName}</strong>: <em>{meme.title}</em></p>
            <Link to={`/memes/${meme.id}`}>
              <img src={meme.url} alt={meme.title} className="meme-img" />
            </Link>
            <div className="meme-actions">
              <button onClick={() => handleLikeToggle(meme)} className="meme-likes">
                <FontAwesomeIcon icon={faThumbsUp} /> {meme.likeCount}
              </button>
              {meme.userId == currentUserId && (
                <button onClick={() => handleDeleteMeme(meme)} className="button">
                  <FontAwesomeIcon icon={faTrash} /> Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <button onClick={openDialog} className="button">Crear Meme</button>
      <Link to="/memes">
        <button className="button">Todos los Memes</button>
      </Link>

      {isOpen && (
        <div className="modal-overlay" onClick={closeDialog}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-button" onClick={closeDialog}>&times;</button>
            <h3>Crear Meme</h3>
            <form onSubmit={postMeme}>
              <input type="text" name="title" placeholder="Título" required />
              <input type="text" name="url" placeholder="URL de la imagen" required />
              <button type="submit" className="button">Crear</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
