import { useEffect, useState } from 'react'
import axios from 'axios'

export default function TopMemesView() {
  const [top, setTop] = useState([])

  useEffect(() => {
    axios.get('https://tu-backend.com/api/memes/top')
      .then(res => setTop(res.data))
      .catch(err => console.error(err))
  }, [])

  return (
    <div className="body">
      <h2 className="title">Mejores Memes</h2>
      {top.map(meme => (
        <div key={meme.id}>
          <img src={meme.imagen} alt={meme.titulo} width="200" />
          <p>{meme.titulo}</p>
        </div>
      ))}
    </div>
  )
}
