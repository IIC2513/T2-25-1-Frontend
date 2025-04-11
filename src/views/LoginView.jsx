import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function LoginView() {
  const [username, setUsername] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const { data, status } = await axios.post(`http://localhost:3000/users/`, { username })
      if (status === 200 || status === 201) {
        navigate('/memes');
        localStorage.setItem('username', username);
        localStorage.setItem('userId', data.id);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        alert('Usuario no encontrado');
      } else if (err.response?.status === 400) {
        alert('Error en la petición');
      } else if (err.response?.status === 500) {
        alert('Error en el servidor');
      } else {
        alert('Error al iniciar sesión');
      }
    }
  }

  return (
    <div className="body login">
        <form className="login-box" onSubmit={handleLogin}>
            <h2>Iniciar sesión</h2>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                />
            <button type="submit">Entrar</button>
        </form>
    </div>
  )
}
