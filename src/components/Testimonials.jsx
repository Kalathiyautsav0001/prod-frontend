import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Testimonials.css';

const Testimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        message: '',
        rating: 5
    });
    const [message, setMessage] = useState({ text: '', type: '' });
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('all');

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/testimonials/approved');
            setTestimonials(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching testimonials:', error);
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { id, name, value, type } = e.target;
        
        // Handle radio buttons (they use name, not id)
        if (type === 'radio') {
            setFormData({ ...formData, [name]: parseInt(value) });
            return;
        }
        
        // Handle regular inputs (they use id)
        let formattedValue = value;
        if (id === 'contact') {
            formattedValue = value.replace(/\D/g, '').slice(0, 10);
        }
        
        setFormData({ ...formData, [id]: formattedValue });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!formData.name || !formData.contact || !formData.message) {
            setMessage({ text: 'Please fill in all fields', type: 'error' });
            return;
        }

        if (formData.name.length < 2) {
            setMessage({ text: 'Name must be at least 2 characters', type: 'error' });
            return;
        }

        if (formData.message.length < 5) {
            setMessage({ text: 'Review must be at least 5 characters', type: 'error' });
            return;
        }

        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(formData.contact)) {
            setMessage({ text: 'Please enter a valid 10-digit number', type: 'error' });
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/testimonials', formData);
            
            if (response.data.success) {
                setMessage({ text: '✨ Thank you! Your review will be displayed after admin approval.', type: 'success' });
                setFormData({ name: '', contact: '', message: '', rating: 5 });
                
                // Auto-hide success message after 5 seconds
                setTimeout(() => {
                    setMessage({ text: '', type: '' });
                }, 5000);
            }
        } catch (error) {
            setMessage({ text: 'Failed to submit review. Please try again.', type: 'error' });
        }
    };

    const getFilteredTestimonials = () => {
        if (activeFilter === 'all') return testimonials;
        return testimonials.filter(t => t.rating === parseInt(activeFilter));
    };

    const getAverageRating = () => {
        if (testimonials.length === 0) return 0;
        const sum = testimonials.reduce((acc, t) => acc + t.rating, 0);
        return (sum / testimonials.length).toFixed(1);
    };

    if (loading) {
        return (
            <section className="testimonials-section">
                <div className="container">
                    <div className="loading-spinner">
                        <div className="spinner-ring"></div>
                        <div className="spinner-ring"></div>
                        <div className="spinner-ring"></div>
                        <p>Loading testimonials...</p>
                    </div>
                </div>
            </section>
        );
    }

    const filteredTestimonials = getFilteredTestimonials();

    return (
        <section className="testimonials-section">
            {/* Decorative Background Elements */}
            <div className="testimonials-bg-decoration">
                <div className="bg-circle circle-1"></div>
                <div className="bg-circle circle-2"></div>
                <div className="bg-circle circle-3"></div>
            </div>

            <div className="container">
                {/* Header Section */}
                <div className="section-header">
                    <div className="section-subtitle">
                        <span className="subtitle-line"></span>
                        Client Stories
                        <span className="subtitle-line"></span>
                    </div>
                    <h2 className="section-title">
                        <span className="title-word">Happy</span>
                        <span className="title-word accent">Clients</span>
                    </h2>
                    <div className="title-decoration">
                        <i className="fas fa-star"></i>
                        <span className="decoration-line"></span>
                        <i className="fas fa-heart"></i>
                        <span className="decoration-line"></span>
                        <i className="fas fa-comment"></i>
                    </div>
                </div>

                {/* Stats Overview */}
                {testimonials.length > 0 && (
                    <div className="testimonials-stats">
                        <div className="stat-badge">
                            <i className="fas fa-star"></i>
                            <span className="stat-value">{getAverageRating()}</span>
                            <span className="stat-label">Average Rating</span>
                        </div>
                        <div className="stat-badge">
                            <i className="fas fa-users"></i>
                            <span className="stat-value">{testimonials.length}</span>
                            <span className="stat-label">Total Reviews</span>
                        </div>
                    </div>
                )}

                {/* Review Form */}
                <div className="review-form-container">
                    <div className="form-header">
                        <div className="form-icon">
                            <i className="fas fa-pen-fancy"></i>
                        </div>
                        <h3>Share Your Experience</h3>
                        <p>Your feedback helps us create better experiences</p>
                    </div>

                    <form onSubmit={handleSubmit} className="review-form">
                        <div className="form-row">
                            <div className="form-group floating">
                                <i className="fas fa-user"></i>
                                <input 
                                    type="text" 
                                    id="name" 
                                    placeholder=" " 
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                                <label htmlFor="name">Your Name</label>
                            </div>
                            <div className="form-group floating">
                                <i className="fas fa-phone-alt"></i>
                                <input 
                                    type="tel" 
                                    id="contact" 
                                    placeholder=" " 
                                    value={formData.contact}
                                    onChange={handleChange}
                                    maxLength="10"
                                    required
                                />
                                <label htmlFor="contact">Mobile Number</label>
                            </div>
                        </div>

                        <div className="form-group floating textarea">
                            <textarea 
                                id="message" 
                                placeholder=" " 
                                rows="4"
                                value={formData.message}
                                onChange={handleChange}
                                required
                            ></textarea>
                            <label htmlFor="message">Your Experience</label>
                        </div>

                        <div className="rating-wrapper">
                            <div className="rating-label">
                                <i className="fas fa-star"></i>
                                <span>Rating:</span>
                            </div>
                            <div className="rating-options">
    {[5, 4, 3, 2, 1].map(r => (
        <label key={r} className={`rating-option ${formData.rating === r ? 'active' : ''}`}>
            <input
                type="radio"
                name="rating"
                value={r}
                checked={formData.rating === r}
                onChange={handleChange}
            />
            <span className="rating-stars">
                {'★'.repeat(r)}{'☆'.repeat(5 - r)}
            </span>
        </label>
    ))}
</div>
                        </div>

                        <button type="submit" className="btn-submit">
                            <i className="fas fa-paper-plane"></i>
                            Submit Review
                            <span className="btn-shine"></span>
                        </button>

                        {message.text && (
                            <div className={`review-message ${message.type}`}>
                                <i className={`fas fa-${message.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i>
                                {message.text}
                            </div>
                        )}
                    </form>
                </div>

                {/* Filter Tabs */}
                {testimonials.length > 0 && (
                    <div className="testimonials-filter">
                        <button
                            className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                            onClick={() => setActiveFilter('all')}
                        >
                            <i className="fas fa-list-ul"></i>
                            All Reviews
                        </button>
                        {[5, 4, 3, 2, 1].map(r => (
                            <button
                                key={r}
                                className={`filter-btn ${activeFilter === r.toString() ? 'active' : ''}`}
                                onClick={() => setActiveFilter(r.toString())}
                            >
                                <span className="filter-stars">{'★'.repeat(r)}</span>
                                <span className="filter-count">
                                    {testimonials.filter(t => t.rating === r).length}
                                </span>
                            </button>
                        ))}
                    </div>
                )}

                {/* Testimonials Grid */}
                <div className="testimonials-grid">
                    {filteredTestimonials.length > 0 ? (
                        filteredTestimonials.map((testimonial, index) => {
                            const stars = '★'.repeat(testimonial.rating) + '☆'.repeat(5 - testimonial.rating);
                            const date = new Date(testimonial.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            });
                            const initials = testimonial.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

                            return (
                                <div 
                                    className="testimonial-card" 
                                    key={testimonial._id}
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="card-shine"></div>
                                    <div className="testimonial-header">
                                        <div className="reviewer-avatar">
                                            {initials}
                                        </div>
                                        <div className="reviewer-info">
                                            <h4>{testimonial.name}</h4>
                                            <div className="reviewer-contact">
                                                <i className="fas fa-phone-alt"></i>
                                                <span>{testimonial.contact}</span>
                                            </div>
                                        </div>
                                        <div className="review-rating-badge">
                                            <span>{testimonial.rating}</span>
                                            <i className="fas fa-star"></i>
                                        </div>
                                    </div>

                                    <div className="review-content">
                                        <div className="quote-icon">
                                            <i className="fas fa-quote-left"></i>
                                        </div>
                                        <p className="review-text">"{testimonial.message}"</p>
                                    </div>

                                    <div className="review-footer">
                                        <div className="review-rating">
                                            {stars.split('').map((star, i) => (
                                                <span key={i} className={star === '★' ? 'star-filled' : 'star-empty'}>
                                                    {star}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="review-date">
                                            <i className="far fa-calendar-alt"></i>
                                            {date}
                                        </div>
                                    </div>

                                    <div className="card-pattern"></div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="empty-state">
                            <div className="empty-icon">
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                            </div>
                            <h3>No Reviews Yet</h3>
                            <p>Be the first to share your experience with us!</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;