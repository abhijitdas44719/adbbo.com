@@ .. @@
 import React from 'react'
+import { useState } from 'react'
+import axios from 'axios'
 import './About.css'

 function About() {
+    const [formData, setFormData] = useState({
+        name: '',
+        email: '',
+        message: ''
+    });
+    const [isSubmitting, setIsSubmitting] = useState(false);
+    const [submitMessage, setSubmitMessage] = useState('');
+    const [submitStatus, setSubmitStatus] = useState(''); // 'success' or 'error'
+
+    const handleInputChange = (e) => {
+        const { id, value } = e.target;
+        setFormData(prev => ({
+            ...prev,
+            [id]: value
+        }));
+    };
+
+    const handleSubmit = async (e) => {
+        e.preventDefault();
+        setIsSubmitting(true);
+        setSubmitMessage('');
+        setSubmitStatus('');
+
+        try {
+            const response = await axios.post('/api/contact', formData);
+            
+            if (response.data.success) {
+                setSubmitStatus('success');
+                setSubmitMessage(response.data.message);
+                setFormData({ name: '', email: '', message: '' });
+            }
+        } catch (error) {
+            setSubmitStatus('error');
+            setSubmitMessage(
+                error.response?.data?.message || 
+                'Failed to send message. Please try again later.'
+            );
+        } finally {
+            setIsSubmitting(false);
+        }
+    };
+
     return (
         <div className=''>
             <div class="hero-section">
@@ -64,7 +110,7 @@
                             <div class="contact-form">
                                 <h2>Send Us a Message</h2>
-                                <form>
+                                <form onSubmit={handleSubmit}>
                                     <div class="form-group">
                                         <label for="name">Your Name</label>
-                                        <input type="text" id="name" placeholder="Enter your name" />
+                                        <input 
+                                            type="text" 
+                                            id="name" 
+                                            placeholder="Enter your name" 
+                                            value={formData.name}
+                                            onChange={handleInputChange}
+                                            required
+                                        />
                                     </div>

                                     <div class="form-group">
                                         <label for="email">Email Address</label>
-                                        <input type="email" id="email" placeholder="Enter your email" />
+                                        <input 
+                                            type="email" 
+                                            id="email" 
+                                            placeholder="Enter your email" 
+                                            value={formData.email}
+                                            onChange={handleInputChange}
+                                            required
+                                        />
                                     </div>

                                     <div class="form-group">
                                         <label for="message">Your Message</label>
-                                        <textarea id="message" placeholder="How can we help you?"></textarea>
+                                        <textarea 
+                                            id="message" 
+                                            placeholder="How can we help you?"
+                                            value={formData.message}
+                                            onChange={handleInputChange}
+                                            required
+                                        ></textarea>
                                     </div>

-                                    <button type="submit" class="submit-btn">Send Message</button>
+                                    <button 
+                                        type="submit" 
+                                        class="submit-btn"
+                                        disabled={isSubmitting}
+                                    >
+                                        {isSubmitting ? 'Sending...' : 'Send Message'}
+                                    </button>
+
+                                    {submitMessage && (
+                                        <div 
+                                            style={{
+                                                marginTop: '15px',
+                                                padding: '12px',
+                                                borderRadius: '6px',
+                                                backgroundColor: submitStatus === 'success' ? '#d4edda' : '#f8d7da',
+                                                color: submitStatus === 'success' ? '#155724' : '#721c24',
+                                                border: `1px solid ${submitStatus === 'success' ? '#c3e6cb' : '#f5c6cb'}`
+                                            }}
+                                        >
+                                            {submitMessage}
+                                        </div>
+                                    )}
                                 </form>
                             </div>
                         </div>