import React from 'react'
import './Contact.css'
function Contact() {
  return (
    <div>
      <h1>Contact Us</h1>
      <p>If you have any questions, feel free to reach out!</p>
      <form>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="name" required />
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" required />
        <label htmlFor="message">Message:</label>
        <textarea id="message" name="message" required></textarea>
        <button type="submit">Send</button>
      </form>
      <p>Thank you for reaching out! We will get back to you as soon as possible!</p>
      
      <p>Follow us on social media for updates!</p>
      <div className="social-links">
            <a href="#"><i class="fab fa-facebook facebook"></i></a>
            <a href="#"><i class="fab fa-twitter twitter"></i></a>
            <a href="#"><i class="fab fa-instagram instagram"></i></a>
            <a href="#"><i class="fab fa-linkedin linkedin"></i></a>
      </div>
      <p>We appreciate your feedback! Have a great day! Contact us anytime!Your support means a lot to us!</p>
      
      <p>Looking forward to hearing from you! Best regards, Stay safe and healthy!</p>
      
      <p className='last'>ADIBUS</p>
      
    </div>
  )
}

export default Contact

