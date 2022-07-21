import { React } from 'react'
// import './assets/styles.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import { Routes, Route } from 'react-router-dom'

// TODO:
// - if listed price is < highest trait floor price = it's the cheapest price (floor nft) for all traits.

function App() {
  return (
    <div className="App">
      {/* <Navbar /> */}
      <main>
        <Home />
      </main>
    </div>
  )
}

export default App
