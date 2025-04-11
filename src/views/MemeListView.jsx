import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp, faTrash } from '@fortawesome/free-solid-svg-icons'


export default function MemeListView() {
  const [memes, setMemes] = useState([])
  const [isOpen, setIsOpen] = useState(false);
  
  const currentUserId = localStorage.getItem('userId');
  const fetchMemes = async () => {
    try {
      const res = await axios.get('http://localhost:3000/memes')
      setMemes(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchMemes()
  }, [])

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
      const isLiked = await axios.get(`http://localhost:3000/likes?memeId=${meme.id}&userId=${currentUserId}`);
      if (isLiked.data) {
        // DELETE /likes?memeId=...&userId=...
        await axios.delete(`http://localhost:3000/likes?memeId=${meme.id}&userId=${currentUserId}`);
        fetchMemes();
      } else {
        // POST /likes
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
      <h2 className="title">Todos los Memes</h2>
      <div className="memes-column-content">
        {memes.map((meme) => (
          <div key={meme.id} className="meme-card">
            <p className="meme-title">{meme.title}</p>
            <Link to={`/memes/${meme.id}`}>
              <img src={meme.url} alt={meme.title} className="meme-img" />
            </Link>
            <button
              onClick={() => handleLikeToggle(meme)}
              className="meme-likes"
            >
              <FontAwesomeIcon icon={faThumbsUp} />
              {meme.likeCount}
            </button>
            <button
              onClick={() => handleDeleteMeme(meme)}
              className="button"
            >
              <p>Delete</p>
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        ))}
      </div>

      <button onClick={openDialog} className="button">Crear Meme</button>
      <Link to="/top">
        <button className="button">Top Memes</button>
      </Link>

      {isOpen && (
        <div className="modal-overlay" onClick={closeDialog}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-button" onClick={closeDialog}>
              &times;
            </button>
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
