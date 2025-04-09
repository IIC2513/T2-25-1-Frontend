import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function MemeDetailView() {
  const { id } = useParams()
  const [meme, setMeme] = useState(null)

  useEffect(() => {
    axios.get(`https://tu-backend.com/api/memes/${id}`)
      .then(res => setMeme(res.data))
      .catch(err => console.error(err))
  }, [id])

  if (!meme) return <p>Cargando...</p>

  return (
    <div className="body">
      <div className="meme">
        <h2 className="title">{meme.titulo}</h2>
        <img src={meme.imagen} alt={meme.titulo} />
      </div>
      <div className="comments">
        <h3>Comentarios</h3>
        <ul>
          {meme.comentarios.map((c, i) => <li key={i}>{c}</li>)}
        </ul>
      </div>
    </div>
  )
}
