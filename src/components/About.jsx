import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import './About.css'

function About() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');
    const [submitStatus, setSubmitStatus] = useState(''); // 'success' or 'error'

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage('');
        setSubmitStatus('');

        try {
            const response = await axios.post('/api/contact', formData);
            
            if (response.data.success) {
                setSubmitStatus('success');
                setSubmitMessage(response.data.message);
                setFormData({ name: '', email: '', message: '' });
            }
        } catch (error) {
            setSubmitStatus('error');
            setSubmitMessage(
                error.response?.data?.message || 
                'Failed to send message. Please try again later.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className=''>
            <div class="hero-section">
                <div class="hero-content">
                    <h1>About Us</h1>
                    <p>Learn more about our mission, values, and the team behind our success</p>
                </div>
            </div>

            <div class="about-content">
                <div class="container">
                    <div class="about-grid">
                        <div class="about-text">
                            <h2>Our Story</h2>
                            <p>
                                Founded in 2020, we started with a simple mission: to make technology 
                                accessible and beneficial for everyone. What began as a small team of 
                                passionate developers has grown into a thriving company that serves 
                                thousands of customers worldwide.
                            </p>
                            <p>
                                Our journey has been marked by continuous innovation, customer-centric 
                                approach, and unwavering commitment to quality. We believe that great 
                                software should not only solve problems but also inspire and empower 
                                users to achieve more.
                            </p>
                        </div>
                        <div class="about-image">
                            <img src="/api/placeholder/500/400" alt="Our team working together" />
                        </div>
                    </div>

                    <div class="values-section">
                        <h2>Our Values</h2>
                        <div class="values-grid">
                            <div class="value-card">
                                <div class="value-icon">🚀</div>
                                <h3>Innovation</h3>
                                <p>We constantly push boundaries and embrace new technologies to deliver cutting-edge solutions.</p>
                            </div>
                            <div class="value-card">
                                <div class="value-icon">🤝</div>
                                <h3>Collaboration</h3>
                                <p>We believe in the power of teamwork and foster an environment of open communication and mutual respect.</p>
                            </div>
                            <div class="value-card">
                                <div class="value-icon">⭐</div>
                                <h3>Excellence</h3>
                                <p>We strive for excellence in everything we do, from code quality to customer service.</p>
                            </div>
                            <div class="value-card">
                                <div class="value-icon">🌱</div>
                                <h3>Growth</h3>
                                <p>We are committed to continuous learning and helping our team members reach their full potential.</p>
                            </div>
                        </div>
                    </div>

                    <div class="team-section">
                        <h2>Meet Our Team</h2>
                        <div class="team-grid">
                            <div class="team-member">
                                <img src="/api/placeholder/200/200" alt="John Smith" />
                                <h3>John Smith</h3>
                                <p class="role">CEO & Founder</p>
                                <p>With over 15 years of experience in tech leadership, John guides our vision and strategy.</p>
                            </div>
                            <div class="team-member">
                                <img src="/api/placeholder/200/200" alt="Sarah Johnson" />
                                <h3>Sarah Johnson</h3>
                                <p class="role">CTO</p>
                                <p>Sarah leads our technical team and ensures we stay at the forefront of technological innovation.</p>
                            </div>
                            <div class="team-member">
                                <img src="/api/placeholder/200/200" alt="Mike Chen" />
                                <h3>Mike Chen</h3>
                                <p class="role">Head of Design</p>
                                <p>Mike brings creativity and user-centered thinking to every product we build.</p>
                            </div>
                            <div class="team-member">
                                <img src="/api/placeholder/200/200" alt="Emily Davis" />
                                <h3>Emily Davis</h3>
                                <p class="role">Head of Marketing</p>
                                <p>Emily helps us connect with our community and share our story with the world.</p>
                            </div>
                        </div>
                    </div>

                    <div class="contact-section">
                        <div class="contact-content">
                            <div class="contact-info">
                                <h2>Get in Touch</h2>
                                <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
                                
                                <div class="contact-details">
                                    <div class="contact-item">
                                        <strong>📧 Email:</strong>
                                        <span>hello@company.com</span>
                                    </div>
                                    <div class="contact-item">
                                        <strong>📞 Phone:</strong>
                                        <span>+1 (555) 123-4567</span>
                                    </div>
                                    <div class="contact-item">
                                        <strong>📍 Address:</strong>
                                        <span>123 Tech Street, San Francisco, CA 94105</span>
                                    </div>
                                </div>
                            </div>

                            <div class="contact-form">
                                <h2>Send Us a Message</h2>
                                <form onSubmit={handleSubmit}>
                                    <div class="form-group">
                                        <label for="name">Your Name</label>
                                        <input 
                                            type="text" 
                                            id="name" 
                                            placeholder="Enter your name" 
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div class="form-group">
                                        <label for="email">Email Address</label>
                                        <input 
                                            type="email" 
                                            id="email" 
                                            placeholder="Enter your email" 
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div class="form-group">
                                        <label for="message">Your Message</label>
                                        <textarea 
                                            id="message" 
                                            placeholder="How can we help you?"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            required
                                        ></textarea>
                                    </div>

                                    <button 
                                        type="submit" 
                                        class="submit-btn"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Sending...' : 'Send Message'}
                                    </button>

                                    {submitMessage && (
                                        <div 
                                            style={{
                                                marginTop: '15px',
                                                padding: '12px',
                                                borderRadius: '6px',
                                                backgroundColor: submitStatus === 'success' ? '#d4edda' : '#f8d7da',
                                                color: submitStatus === 'success' ? '#155724' : '#721c24',
                                                border: `1px solid ${submitStatus === 'success' ? '#c3e6cb' : '#f5c6cb'}`
                                            }}
                                        >
                                            {submitMessage}
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About