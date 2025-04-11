import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons'

// Mocked user ID — replace with actual user state
const currentUserId = 1;

export default function MemeListView() {
  const [memes, setMemes] = useState([])

  useEffect(() => {
    axios.get('http://localhost:3000/memes')
      .then(res => setMemes(res.data))
      .catch(err => console.error(err))
  }, [])

  const handleLikeToggle = async (meme) => {
    try {
      if (meme.likedByUser) {
        // DELETE like
        await axios.delete(`http://localhost:3000/likes/${meme.likeId}?userId=${currentUserId}`)
        setMemes((prev) =>
          prev.map((m) =>
            m.id === meme.id
              ? {
                  ...m,
                  likedByUser: false,
                  likeId: null
                }
              : m
          )
        )
      } else {
        // POST like
        const res = await axios.post('http://localhost:3000/likes', {
          userId: currentUserId,
          memeId: meme.id
        })
        setMemes((prev) =>
          prev.map((m) =>
            m.id === meme.id
              ? {
                  ...m,
                  likedByUser: true,
                  likeId: res.data.id
                }
              : m
          )
        )
      }
    } catch (err) {
      console.error('Error toggling like:', err.response?.data || err)
    }
  }

  return (
    <div className="body memes-column">
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
              style={{
                color: meme.likedByUser ? 'blue' : '#444',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '1rem',
                marginTop: '10px'
              }}
            >
              <FontAwesomeIcon icon={faThumbsUp} />
              {meme.likeCount}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
