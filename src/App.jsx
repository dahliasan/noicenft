import { React } from 'react'
import './styles.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import { Routes, Route } from 'react-router-dom'

// allow fetch api to refresh every 5 min
// fetch estimated token value
// style UI with chakra?
//

function App() {
  return (
    <div className="App">
      <Navbar />
      <main>
        <Routes>
          <Route exact path="/nft-flipper-helper" element={<Home />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
