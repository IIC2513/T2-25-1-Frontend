import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

export default function MemeListView() {
  const [memes, setMemes] = useState([])

  useEffect(() => {
    axios.get('https://tu-backend.com/api/memes')
      .then(res => setMemes(res.data))
      .catch(err => console.error(err))
  }, [])

  return (
    <div className="body">
      <h2 className="title">Todos los Memes</h2>
      {memes.map(meme => (
        <div key={meme.id}>
          <Link to={`/memes/${meme.id}`}>
            <img src={meme.imagen} alt={meme.titulo} width="200" />
            <p>{meme.titulo}</p>
          </Link>
        </div>
      ))}
    </div>
  )
}
