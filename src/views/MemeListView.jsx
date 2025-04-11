import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons'

const currentUserId = localStorage.getItem('userId');

export default function MemeListView() {
  const [memes, setMemes] = useState([])

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
    <div className="body">
      <h2 className="title">Todos los Memes</h2>
      <div className="memes-column-content">
        {memes.map((meme) => (
          <div key={meme.id} className="meme-card">
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
          </div>
        ))}
      </div>
      <Link to="/top">
        <button className="back-button">Top Memes</button>
      </Link>
    </div>
  )
}
