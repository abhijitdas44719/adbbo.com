import React from 'react'
import './About.css'

function About() {
  return (
    <div>
      <div className='main' style={{ display: 'flex', width: '100%'}}>
        <div className='container c1'>
          About Us
        </div>
        <div className='container c2'>
          <p>We are a team of passionate developers dedicated to creating innovative solutions that<br/> make a difference. Our mission is to deliver high-quality software that meets the needs<br/> of our users and exceeds their expectations.</p>
          <p>With years of experience in the industry, we pride ourselves on our ability to adapt to<br/> new challenges and continuously improve our skills. We believe in the power of collaboration<br/> and strive to foster a positive and inclusive work environment.</p>
        </div>
        <div className='container c3'>
          <img src="https://via.placeholder.com/150" alt="About Us" />
        </div>
        <div className='container c4'>
          Contact us at:
        </div>
      </div>
    </div>
  )
}

export default About
