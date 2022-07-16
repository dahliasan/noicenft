import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="nav">
      <Link to="/nft-flipper-helper/" className="site-title">
        Home
      </Link>
    </nav>
  )
}
