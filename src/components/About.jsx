import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './About.css';

const About = () => {
    const navigate = useNavigate();
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTopTestimonials();
    }, []);

    const fetchTopTestimonials = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/testimonials/approved');
            // Get top 3 most recent testimonials
            const topThree = response.data.slice(0, 3);
            setTestimonials(topThree);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching testimonials:', error);
            setLoading(false);
        }
    };

    const handleNavigation = (path) => {
        navigate(path);
    };

    const teamMembers = [
        {
            id: 1,
            name: 'Devam Shah',
            role: 'Founder & Creative Director',
            image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop',
            bio: 'With 15+ years in luxury event planning, Devam has orchestrated 500+ unforgettable celebrations.'
        },
        {
            id: 2,
            name: 'Anant Gondaliya',
            role: 'Event Operations Head',
            image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop',
            bio: 'Expert in seamless execution, ensuring every detail is perfect from start to finish.'
        },
        {
            id: 3,
            name: 'Utsav Kalathiya',
            role: 'Creative Designer',
            image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop',
            bio: 'Transforms visions into stunning realities with innovative design concepts.'
        }
    ];

    const values = [
        {
            icon: 'fas fa-heart',
            title: 'Passion',
            description: 'We pour our heart into every event, treating each celebration as if it were our own.',
            color: '#FF6B6B'
        },
        {
            icon: 'fas fa-gem',
            title: 'Excellence',
            description: 'No detail is too small. We strive for perfection in everything we do.',
            color: '#C5A059'
        },
        {
            icon: 'fas fa-hand-holding-heart',
            title: 'Integrity',
            description: 'Honest communication, transparent pricing, and unwavering commitment.',
            color: '#4A90E2'
        },
        {
            icon: 'fas fa-lightbulb',
            title: 'Innovation',
            description: 'Fresh ideas, creative concepts, and unique experiences for every client.',
            color: '#FFB347'
        }
    ];

    const milestones = [
        { year: '2010', title: 'Founded Devam Event Studio', description: 'Started with a vision to create extraordinary events' },
        { year: '2013', title: '100th Event Celebration', description: 'Reached our first major milestone' },
        { year: '2015', title: 'Expanded Team', description: 'Grew to 10+ creative professionals' },
        { year: '2018', title: 'International Projects', description: 'Started organizing events abroad' },
        { year: '2020', title: 'Virtual Events Pioneer', description: 'Adapted and innovated during challenging times' },
        { year: '2024', title: '500+ Events Completed', description: 'A legacy of unforgettable celebrations' }
    ];

    return (
        <section className="about-section">
            {/* Decorative Background Elements */}
            <div className="about-bg-decoration">
                <div className="bg-circle circle-1"></div>
                <div className="bg-circle circle-2"></div>
                <div className="bg-circle circle-3"></div>
            </div>

            <div className="container">
                {/* Header Section */}
                <div className="section-header">
                    <div className="section-subtitle">
                        <span className="subtitle-line"></span>
                        Our Story
                        <span className="subtitle-line"></span>
                    </div>
                    <h2 className="section-title">
                        <span className="title-word">About</span>
                        <span className="title-word accent">Devam</span>
                    </h2>
                    <div className="title-decoration">
                        <i className="fas fa-star"></i>
                        <span className="decoration-line"></span>
                        <i className="fas fa-heart"></i>
                        <span className="decoration-line"></span>
                        <i className="fas fa-gem"></i>
                    </div>
                </div>

                {/* Main About Content */}
                <div className="about-content">
                    <div className="about-image-wrapper">
                        <div className="about-image-main">
                            <img 
                                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=400&fit=crop" 
                                alt="Luxury Event Setup" 
                            />
                            <div className="experience-badge">
                                <span className="years">15+</span>
                                <span className="text">Years of Excellence</span>
                            </div>
                            <div className="image-shape shape-1"></div>
                            <div className="image-shape shape-2"></div>
                        </div>
                        <div className="about-image-secondary">
                            <img 
                                src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=300&h=200&fit=crop" 
                                alt="Event Decoration" 
                            />
                            <img 
                                src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=300&h=200&fit=crop" 
                                alt="Wedding Setup" 
                            />
                        </div>
                    </div>

                    <div className="about-text">
                        <h3>Crafting Extraordinary Moments Since 2010</h3>
                        
                        <div className="about-description">
                            <p>
                                At <strong>Devam Event Studio</strong>, we believe every event tells a unique story. 
                                With over a decade of experience in luxury event planning, we've mastered the art of 
                                creating unforgettable experiences that leave lasting impressions.
                            </p>
                            <p>
                                Our journey began in 2010 with a simple vision: to transform ordinary spaces into 
                                extraordinary experiences. Today, we're proud to be one of Mumbai's most sought-after 
                                event planning companies, having orchestrated over 500 successful events ranging from 
                                intimate gatherings to grand celebrations.
                            </p>
                            <div className="about-quote">
                                <i className="fas fa-quote-left"></i>
                                <p>We don't just plan events; we create memories that last a lifetime.</p>
                            </div>
                        </div>

                        {/* Stats with Icons */}
                        <div className="about-stats-enhanced">
                            <div className="stat-card">
                                <div className="stat-icon">
                                    <i className="fas fa-calendar-check"></i>
                                </div>
                                <div className="stat-info">
                                    <span className="stat-number">500+</span>
                                    <span className="stat-label">Events Planned</span>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">
                                    <i className="fas fa-smile"></i>
                                </div>
                                <div className="stat-info">
                                    <span className="stat-number">1000+</span>
                                    <span className="stat-label">Happy Clients</span>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">
                                    <i className="fas fa-trophy"></i>
                                </div>
                                <div className="stat-info">
                                    <span className="stat-number">25+</span>
                                    <span className="stat-label">Awards Won</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Journey Timeline Section */}
                <div className="timeline-section">
                    <div className="section-header">
                        <div className="section-subtitle">Our Journey</div>
                        <h2 className="section-title">The Devam Timeline</h2>
                    </div>

                    <div className="timeline">
                        {milestones.map((milestone, index) => (
                            <div className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`} key={index}>
                                <div className="timeline-content">
                                    <span className="timeline-year">{milestone.year}</span>
                                    <h3>{milestone.title}</h3>
                                    <p>{milestone.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Our Values Section */}
                <div className="values-section">
                    <div className="section-header">
                        <div className="section-subtitle">What Drives Us</div>
                        <h2 className="section-title">Our Core Values</h2>
                    </div>

                    <div className="values-grid">
                        {values.map((value, index) => (
                            <div className="value-card" key={index} style={{ '--value-color': value.color }}>
                                <div className="value-icon">
                                    <i className={value.icon}></i>
                                </div>
                                <h3>{value.title}</h3>
                                <p>{value.description}</p>
                                <div className="value-shine"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Team Section */}
                <div className="team-section">
                    <div className="section-header">
                        <div className="section-subtitle">Meet The Experts</div>
                        <h2 className="section-title">Our Creative Team</h2>
                    </div>

                    <div className="team-grid">
                        {teamMembers.map(member => (
                            <div className="team-card" key={member.id}>
                                <div className="team-image-wrapper">
                                    <img src={member.image} alt={member.name} className="team-image" />
                                    <div className="team-social">
                                        <a href="#"><i className="fab fa-linkedin-in"></i></a>
                                        <a href="#"><i className="fab fa-instagram"></i></a>
                                        <a href="#"><i className="fab fa-twitter"></i></a>
                                    </div>
                                </div>
                                <div className="team-info">
                                    <h3>{member.name}</h3>
                                    <p className="team-role">{member.role}</p>
                                    <p className="team-bio">{member.bio}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Testimonials Section - Now with dynamic data */}
                <div className="testimonials-section">
                    <div className="section-header">
                        <div className="section-subtitle">Client Love</div>
                        <h2 className="section-title">What They Say</h2>
                    </div>

                    {loading ? (
                        <div className="testimonials-loading">
                            <div className="spinner-ring"></div>
                            <p>Loading reviews...</p>
                        </div>
                    ) : (
                        <div className="testimonials-grid">
                            {testimonials.length > 0 ? (
                                testimonials.map(testimonial => {
                                    const stars = '★'.repeat(testimonial.rating) + '☆'.repeat(5 - testimonial.rating);
                                    const initials = testimonial.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                                    
                                    return (
                                        <div className="testimonial-card" key={testimonial._id}>
                                            <div className="testimonial-header">
                                                <div className="testimonial-avatar">
                                                    {initials}
                                                </div>
                                                <div className="testimonial-info">
                                                    <h4>{testimonial.name}</h4>
                                                    <div className="testimonial-rating">
                                                        {stars.split('').map((star, i) => (
                                                            <span key={i} className={star === '★' ? 'star-filled' : 'star-empty'}>
                                                                {star}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="testimonial-text">"{testimonial.message}"</p>
                                            <div className="testimonial-footer">
                                                <span className="testimonial-contact">
                                                    <i className="fas fa-phone-alt"></i>
                                                    {testimonial.contact}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="no-testimonials">
                                    <i className="fas fa-star"></i>
                                    <p>No reviews yet. Be the first to share your experience!</p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="view-all-link">
                        <button 
                            onClick={() => navigate('/testimonials')} 
                            className="view-all-btn"
                        >
                            View All Reviews
                            <i className="fas fa-arrow-right"></i>
                        </button>
                    </div>
                </div>

                {/* Why Choose Us Section */}
                <div className="why-choose-us">
                    <div className="choose-content">
                        <div className="section-header">
                            <div className="section-subtitle">Why Us</div>
                            <h2 className="section-title">Why Choose Devam?</h2>
                        </div>

                        <div className="features-list">
                            <div className="feature-item">
                                <div className="feature-check">
                                    <i className="fas fa-check-circle"></i>
                                </div>
                                <div className="feature-text">
                                    <h4>Personalized Approach</h4>
                                    <p>Every event is unique, and we treat it that way with customized solutions.</p>
                                </div>
                            </div>
                            <div className="feature-item">
                                <div className="feature-check">
                                    <i className="fas fa-check-circle"></i>
                                </div>
                                <div className="feature-text">
                                    <h4>Vendor Network</h4>
                                    <p>Access to the best vendors and venues at competitive prices.</p>
                                </div>
                            </div>
                            <div className="feature-item">
                                <div className="feature-check">
                                    <i className="fas fa-check-circle"></i>
                                </div>
                                <div className="feature-text">
                                    <h4>Stress-Free Planning</h4>
                                    <p>We handle everything, so you can enjoy your special day.</p>
                                </div>
                            </div>
                            <div className="feature-item">
                                <div className="feature-check">
                                    <i className="fas fa-check-circle"></i>
                                </div>
                                <div className="feature-text">
                                    <h4>24/7 Support</h4>
                                    <p>Round-the-clock assistance for all your event needs.</p>
                                </div>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="choose-cta">
                            <button 
                                onClick={() => handleNavigation('/contact')} 
                                className="cta-btn primary"
                            >
                                <i className="fas fa-calendar-check"></i>
                                Start Planning
                            </button>
                            <button 
                                onClick={() => handleNavigation('/services')} 
                                className="cta-btn secondary"
                            >
                                <i className="fas fa-eye"></i>
                                View Services
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;