import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';

export default function TopMemesView() {
  const [top, setTop] = useState([]);

  const fetchMemes = async () => {
    try {
      const res = await axios.get('http://localhost:3000/memes/sorted');
      setTop(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMemes();
  }, []);

  const currentUserId = localStorage.getItem('userId');

  const handleLikeToggle = async (meme) => {
    try {
      const isLiked = await axios.get(`http://localhost:3000/likes?memeId=${meme.id}&userId=${currentUserId}`);
      if (isLiked.data) {
        // DELETE /likes/:likeId?userId=...
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
    <div className="body memes-column">
      <h2 className="title">Mejores Memes</h2>
      <div className="memes-column-content">
        {top.map((meme) => (
          <div
            key={meme.id}
            className="meme-card"
          >
            <p className="meme-title">{meme.title}</p>
            <Link to={`/memes/${meme.id}`}>
              <img
                src={meme.url}
                alt={meme.title}
                className="meme-img"
              />
            </Link>
            <button
              onClick={() => handleLikeToggle(meme)}
              className="meme-likes"
            >
              <FontAwesomeIcon icon={faThumbsUp} />
              {meme.likeCount}
            </button>
          </div>
        ))}
      </div>
      <Link to="/memes">
        <button className="back-button">Todos los Memes</button>
      </Link>
    </div>
  );
}
