import React, { useState } from 'react';
import axios from 'axios';
import './Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        eventType: '',
        date: '',
        message: ''
    });
    const [message, setMessage] = useState({ text: '', type: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        let value = e.target.value;
        if (e.target.id === 'phone') {
            value = value.replace(/\D/g, '').slice(0, 10);
        }
        setFormData({ ...formData, [e.target.id]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        // Validation
        if (!formData.name || !formData.email || !formData.phone || !formData.message) {
            setMessage({ text: 'Please fill in all required fields', type: 'error' });
            setLoading(false);
            return;
        }

        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(formData.phone)) {
            setMessage({ text: 'Please enter a valid 10-digit number', type: 'error' });
            setLoading(false);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setMessage({ text: 'Please enter a valid email', type: 'error' });
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/contact', formData);
            
            if (response.data.success) {
                setMessage({ text: '✨ Thank you! We will contact you soon.', type: 'success' });
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    eventType: '',
                    date: '',
                    message: ''
                });
                
                // Clear success message after 5 seconds
                setTimeout(() => {
                    setMessage({ text: '', type: '' });
                }, 5000);
            }
        } catch (error) {
            setMessage({ text: 'Failed to send message. Please try again.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="contact-section">
            {/* Decorative Background Elements */}
            <div className="contact-bg-decoration">
                <div className="bg-circle circle-1"></div>
                <div className="bg-circle circle-2"></div>
                <div className="bg-circle circle-3"></div>
            </div>

            <div className="container">
                <div className="contact-wrapper">
                    {/* Header Section - Updated to match other pages */}
                    <div className="section-header">
                        <div className="section-subtitle">
                            <span className="subtitle-line"></span>
                            Concierge
                            <span className="subtitle-line"></span>
                        </div>
                        <h2 className="section-title">
                            <span className="title-word">Get In</span>
                            <span className="title-word accent">Touch</span>
                        </h2>
                        <div className="title-decoration">
                            <i className="fas fa-phone-alt"></i>
                            <span className="decoration-line"></span>
                            <i className="fas fa-envelope"></i>
                            <span className="decoration-line"></span>
                            <i className="fas fa-map-marker-alt"></i>
                        </div>
                        <p className="contact-description">
                            Ready to create something extraordinary? Reach out to us and let's start planning your perfect event.
                        </p>
                    </div>

                    <div className="contact-content">
                        {/* Contact Info Cards - Updated styling */}
                        <div className="contact-info-grid">
                            <div className="contact-card">
                                <div className="contact-icon">
                                    <i className="fas fa-phone-alt"></i>
                                </div>
                                <h3>Call Us</h3>
                                <p className="contact-detail">+91 97124 90394</p>
                                <p className="contact-detail">+91 98793 54064</p>
                                <div className="contact-badge">
                                    <i className="fas fa-clock"></i>
                                    <span>24/7 Available</span>
                                </div>
                            </div>

                            <div className="contact-card">
                                <div className="contact-icon">
                                    <i className="fas fa-envelope"></i>
                                </div>
                                <h3>Email Us</h3>
                                <p className="contact-detail">gondaliyaanant02@gmail.com</p>
                                <p className="contact-detail">utsavkalathiya98@gmail.com</p>
                                <div className="contact-badge">
                                    <i className="fas fa-clock"></i>
                                    <span>Reply within 2 hrs</span>
                                </div>
                            </div>

                            <div className="contact-card">
                                <div className="contact-icon">
                                    <i className="fas fa-map-marker-alt"></i>
                                </div>
                                <h3>Visit Us</h3>
                                <p className="contact-detail">Luxe Tower, Bandra Kurla</p>
                                <p className="contact-detail">Mumbai - 400051</p>
                                <div className="contact-badge">
                                    <i className="fas fa-calendar-check"></i>
                                    <span>By appointment</span>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form - Updated styling */}
                        <div className="contact-form-container">
                            <div className="form-header">
                                <div className="form-icon">
                                    <i className="fas fa-pen-fancy"></i>
                                </div>
                                <h3>Send Us a Message</h3>
                                <p>We'll get back to you within 24 hours</p>
                            </div>

                            <form onSubmit={handleSubmit} className="contact-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <i className="fas fa-user"></i>
                                        <input 
                                            type="text" 
                                            id="name" 
                                            placeholder="Your Name *"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <i className="fas fa-envelope"></i>
                                        <input 
                                            type="email" 
                                            id="email" 
                                            placeholder="Email Address *"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <i className="fas fa-phone-alt"></i>
                                        <input 
                                            type="tel" 
                                            id="phone" 
                                            placeholder="Mobile Number *"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            maxLength="10"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <i className="fas fa-calendar-alt"></i>
                                        <input 
                                            type="date" 
                                            id="date" 
                                            value={formData.date}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="form-group select-group">
                                    <i className="fas fa-tag"></i>
                                    <select id="eventType" value={formData.eventType} onChange={handleChange}>
                                        <option value="">Select Event Type</option>
                                        <option value="wedding">Wedding / Engagement</option>
                                        <option value="corporate">Corporate Event</option>
                                        <option value="birthday">Birthday Party</option>
                                        <option value="baby-shower">Baby Shower</option>
                                        <option value="festival">Festival Celebration</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <textarea 
                                    id="message" 
                                    placeholder="Your Message *"
                                    rows="5"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                ></textarea>

                                <button 
                                    type="submit" 
                                    className={`btn-submit ${loading ? 'loading' : ''}`} 
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <i className="fas fa-spinner fa-spin"></i>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-paper-plane"></i>
                                            Send Message
                                        </>
                                    )}
                                </button>

                                {message.text && (
                                    <div className={`contact-message ${message.type}`}>
                                        <i className={`fas fa-${message.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i>
                                        {message.text}
                                    </div>
                                )}
                            </form>
                        </div>

                        {/* Map Container - Updated styling */}
                        <div className="map-container">
                            <div className="map-placeholder">
                                <i className="fas fa-map-marked-alt"></i>
                                <h4>Our Location</h4>
                                <p>Luxe Tower, Bandra Kurla Complex, Mumbai - 400051</p>
                                <div className="map-coordinates">
                                    <i className="fas fa-location-dot"></i>
                                    <span>19.0596° N, 72.8295° E</span>
                                </div>
                                <div className="map-badge">
                                    <i className="fas fa-info-circle"></i>
                                    <span>Exact location shared upon appointment</span>
                                </div>
                            </div>
                        </div>

                        {/* Social Section - Updated styling */}
                        <div className="social-section">
                            <div className="social-title">
                                <span className="social-line"></span>
                                Follow Our Journey
                                <span className="social-line"></span>
                            </div>
                            <div className="social-links">
                                <a href="#" className="social-link" target="_blank" rel="noopener noreferrer">
                                    <i className="fab fa-facebook-f"></i>
                                </a>
                                <a href="#" className="social-link" target="_blank" rel="noopener noreferrer">
                                    <i className="fab fa-instagram"></i>
                                </a>
                                <a href="#" className="social-link" target="_blank" rel="noopener noreferrer">
                                    <i className="fab fa-twitter"></i>
                                </a>
                                <a href="#" className="social-link" target="_blank" rel="noopener noreferrer">
                                    <i className="fab fa-linkedin-in"></i>
                                </a>
                                <a href="#" className="social-link" target="_blank" rel="noopener noreferrer">
                                    <i className="fab fa-pinterest"></i>
                                </a>
                                <a href="#" className="social-link" target="_blank" rel="noopener noreferrer">
                                    <i className="fab fa-youtube"></i>
                                </a>
                            </div>
                        </div>

                        {/* Business Hours - Updated styling */}
                        <div className="hours-section">
                            <div className="hours-card">
                                <div className="hours-icon">
                                    <i className="fas fa-clock"></i>
                                </div>
                                <div className="hours-info">
                                    <h4>Business Hours</h4>
                                    <div className="hours-grid">
                                        <div className="hours-item">
                                            <span className="day">Monday - Friday</span>
                                            <span className="time">9:00 AM - 8:00 PM</span>
                                        </div>
                                        <div className="hours-item">
                                            <span className="day">Saturday</span>
                                            <span className="time">10:00 AM - 6:00 PM</span>
                                        </div>
                                        <div className="hours-item">
                                            <span className="day">Sunday</span>
                                            <span className="time">By Appointment</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;