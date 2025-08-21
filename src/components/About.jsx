import React from 'react'
import './About.css'

function About() {
    return (
        <div className=''>
            <div class="hero-section">
                <div class="hero-content">
                    <h1>Driving Innovation Forward</h1>
                    <p>At Adibus, we're committed to creating solutions that shape the future</p>
                </div>
            </div>

            <div class="main">
                <div class="flex-container">
                    <div class="container c1">
                        About Us
                    </div>
                    <div class="container c2">
                        <p>We are a team of passionate developers dedicated to creating innovative solutions that make a difference. Our mission is to deliver high-quality software that meets the needs of our users and exceeds their expectations.</p>
                        <p>With years of experience in the industry, we pride ourselves on our ability to adapt to new challenges and continuously improve our skills. We believe in the power of collaboration and strive to foster a positive and inclusive work environment.</p>
                    </div>
                    <div class="container c3">
                        <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Our Team" />
                    </div>
                    {/* contact */}
                    <div class="contact-container">
                        <div class="contact-header">
                            <h1>Get in Touch With Us</h1>
                            <p>We'd love to hear from you. Here's how you can reach us.</p>
                        </div>

                        <div class="contact-content">
                            <div class="contact-info">
                                <h2>Contact Information</h2>
                                <p>We're here to help and answer any questions you might have. We look forward to hearing from you.</p>

                                <div class="contact-details">
                                    <div class="contact-item">
                                        <div class="icon">
                                            <i class="fas fa-envelope"></i>
                                        </div>
                                        <div class="details">
                                            <h3>Email</h3>
                                            <p>info@adibus.com</p>
                                        </div>
                                    </div>

                                    <div class="contact-item">
                                        <div class="icon">
                                            <i class="fas fa-phone"></i>
                                        </div>
                                        <div class="details">
                                            <h3>Phone</h3>
                                            <p>+1 (555) 123-4567</p>
                                        </div>
                                    </div>

                                    <div class="contact-item">
                                        <div class="icon">
                                            <i class="fas fa-map-marker-alt"></i>
                                        </div>
                                        <div class="details">
                                            <h3>Address</h3>
                                            <p>123 Innovation Drive, Tech City</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="contact-form">
                                <h2>Send Us a Message</h2>
                                <form>
                                    <div class="form-group">
                                        <label for="name">Your Name</label>
                                        <input type="text" id="name" placeholder="Enter your name" />
                                    </div>

                                    <div class="form-group">
                                        <label for="email">Email Address</label>
                                        <input type="email" id="email" placeholder="Enter your email" />
                                    </div>

                                    <div class="form-group">
                                        <label for="message">Your Message</label>
                                        <textarea id="message" placeholder="How can we help you?"></textarea>
                                    </div>

                                    <button type="submit" class="submit-btn">Send Message</button>
                                </form>
                            </div>
                        </div>

                        <div class="map">
                            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095343008!2d-74.00425872426637!3d40.74076987932881!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259bf5c8eef01%3A0x7b0d4d62c552c5ba!2sTech%20Hub%20Area!5e0!3m2!1sen!2sus!4v1690833664258!5m2!1sen!2sus" allowfullscreen="" loading="lazy"></iframe>
                        </div>
                    </div>
                    {/* contact end */}
                </div>

                <div class="team-section">
                    <h2 class="section-title">Our Leadership Team</h2>
                    <div class="team-grid">
                        <div class="team-member">
                            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Team Member" class="team-img" />
                            <div class="team-info">
                                <h3>Michael Johnson</h3>
                                <p>CEO & Founder</p>
                            </div>
                        </div>
                        <div class="team-member">
                            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Team Member" class="team-img" />
                            <div class="team-info">
                                <h3>Sarah Williams</h3>
                                <p>Chief Technology Officer</p>
                            </div>
                        </div>
                        <div class="team-member">
                            <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Team Member" class="team-img" />
                            <div class="team-info">
                                <h3>David Chen</h3>
                                <p>Lead Developer</p>
                            </div>
                        </div>
                        <div class="team-member">
                            <img src="https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Team Member" class="team-img" />
                            <div class="team-info">
                                <h3>Emily Rodriguez</h3>
                                <p>Product Manager</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="values-section">
                    <h2 class="section-title">Our Values</h2>
                    <div class="values-grid">
                        <div class="value-card">
                            <div class="value-icon">
                                <i class="fas fa-lightbulb"></i>
                            </div>
                            <h3>Innovation</h3>
                            <p>We constantly push boundaries and explore new ideas to create cutting-edge solutions.</p>
                        </div>
                        <div class="value-card">
                            <div class="value-icon">
                                <i class="fas fa-users"></i>
                            </div>
                            <h3>Collaboration</h3>
                            <p>We believe that the best results come from working together and sharing knowledge.</p>
                        </div>
                        <div class="value-card">
                            <div class="value-icon">
                                <i class="fas fa-medal"></i>
                            </div>
                            <h3>Excellence</h3>
                            <p>We are committed to delivering the highest quality in everything we do.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About
