import React from 'react';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    
    const socialLinks = [
        { icon: 'fab fa-instagram', url: 'https://instagram.com/utsavkalathiya', name: 'Instagram' },
        { icon: 'fab fa-linkedin-in', url: 'https://linkedin.com/in/utsavkalathiya', name: 'LinkedIn' },
        { icon: 'fab fa-github', url: 'https://github.com/utsavkalathiya', name: 'GitHub' },
        { icon: 'fab fa-twitter', url: 'https://twitter.com/utsavkalathiya', name: 'Twitter' }
    ];

    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Main Footer Content */}
                <div className="footer-main">
                    <div className="footer-brand">
                        <div className="footer-logo">Devam</div>
                        <p className="footer-tagline">Crafting extraordinary moments since 2010</p>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-links">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><a href="/">Home</a></li>
                            <li><a href="/about">About Us</a></li>
                            <li><a href="/services">Services</a></li>
                            <li><a href="/gallery">Gallery</a></li>
                            <li><a href="/contact">Contact</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="footer-contact">
                        <h4>Get in Touch</h4>
                        <p><i className="fas fa-phone-alt"></i> +91 97124 90394</p>
                        <p><i className="fas fa-envelope"></i> hello@devam.com</p>
                        <p><i className="fas fa-map-marker-alt"></i> Mumbai, India</p>
                    </div>
                </div>

                {/* Developer Credit & Social Links */}
                <div className="footer-divider"></div>
                
                <div className="footer-bottom">
                    <div className="footer-developer">
                        <p>
                            <span className="developer-label">Website developed by </span>
                            <a 
                                href="https://instagram.com/utsavkalathiya" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="developer-link"
                            >
                                @utsavkalathiya
                            </a>
                            <span className="developer-heart"> ❤️</span>
                        </p>
                    </div>

                    <div className="footer-social">
                        {socialLinks.map((link, index) => (
                            <a 
                                key={index}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-icon"
                                aria-label={link.name}
                            >
                                <i className={link.icon}></i>
                            </a>
                        ))}
                    </div>

                    <div className="footer-copyright">
                        <p>&copy; {currentYear} Devam Event Studio. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;