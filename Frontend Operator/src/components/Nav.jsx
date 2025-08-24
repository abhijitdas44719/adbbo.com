import React from 'react'
import { Link } from 'react-router-dom'

function Nav() {
  return (
    <div className="nav-container">
      <nav>
        <div className="logo">
          <img src="ADIBUS.png"/>
          <div>ADIBUS Operator Services</div>
        </div>
        <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/bus-manage">Buses</Link></li>
            <li><Link to="/price-manage">Fare</Link></li>
        </ul>
      </nav>
    </div>
  )
}

export default Nav

