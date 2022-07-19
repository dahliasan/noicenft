import { React } from 'react'
// import './assets/styles.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import { Routes, Route } from 'react-router-dom'

// TODO:
// allow fetch api to refresh every 5 min

function App() {
  return (
    <div className="App">
      {/* <Navbar /> */}
      <main>
        <Routes>
          <Route exact path="/" element={<Home />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
