import React from 'react'
import { Link } from 'react-router-dom'

function Nav() {
  return (
    <div className="nav-container">
      <nav>
        <div className="logo">Indian Bus Services</div>
        <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/manage">Fleet Manage</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/bus-manage">Bus Routes</Link></li>
            <li><Link to="/price-manage">Fare Management</Link></li>
        </ul>
      </nav>
    </div>
  )
}

export default Nav

