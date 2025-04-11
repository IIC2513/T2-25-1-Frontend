import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';

export default function TopMemesView() {
  const [top, setTop] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:3000/memes/sorted')
      .then((res) => setTop(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="body memes-column">
      <h2 className="title">Mejores Memes</h2>
      <div className="memes-column-content">
        {top.map((meme) => (
          <div
            key={meme.id}
            className="meme-card"
          >
            <Link to={`/memes/${meme.id}`}>
              <img
                src={meme.url}
                alt={meme.title}
                className="meme-img"
              />
            </Link>
            <p className="meme-likes">
              <FontAwesomeIcon icon={faThumbsUp} /> {meme.likeCount || 0}
            </p>
            <p style={{ marginTop: '10px', fontWeight: 'bold' }}>{meme.titulo}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
