import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LoginView from './views/LoginView'
import MemeListView from './views/MemeListView'
import MemeDetailView from './views/MemeDetailView'
import TopMemesView from './views/TopMemesView'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginView />} />
        <Route path="/memes" element={<MemeListView />} />
        <Route path="/memes/:id" element={<MemeDetailView />} />
        <Route path="/top" element={<TopMemesView />} />
      </Routes>
    </Router>
  )
}
