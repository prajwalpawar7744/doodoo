import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Name from './pages/Name'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/name" element={<Name />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
