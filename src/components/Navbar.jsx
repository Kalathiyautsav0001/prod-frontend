import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setMobileMenuOpen(false);
        // Re-enable scrolling when route changes
        document.body.style.overflow = 'unset';
    }, [location]);

    // Handle body scroll when mobile menu opens/closes
    useEffect(() => {
        if (mobileMenuOpen) {
            // Disable scrolling on body
            document.body.style.overflow = 'hidden';
        } else {
            // Re-enable scrolling
            document.body.style.overflow = 'unset';
        }
        
        // Cleanup function to ensure scroll is re-enabled when component unmounts
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [mobileMenuOpen]);

    const navLinks = [
        { path: '/', name: 'Home' },
        { path: '/about', name: 'About' },
        { path: '/services', name: 'Services' },
        { path: '/pricing', name: 'Pricing' },
        { path: '/gallery', name: 'Gallery' },
        { path: '/testimonials', name: 'Testimonials' },
        { path: '/contact', name: 'Contact' }
    ];

    const toggleMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const closeMenu = () => {
        setMobileMenuOpen(false);
    };

    return (
        <>
            <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
                <div className="nav-container">
                    <div className="logo">
                        <h1>Devam</h1>
                        <span>EVENT</span>
                    </div>

                    {/* Desktop Menu */}
                    <div className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
                        {navLinks.map(link => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={location.pathname === link.path ? 'active' : ''}
                                onClick={closeMenu}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="nav-contact">
                        <a href="tel:+919712490394" className="contact-phone">
                            <i className="fas fa-phone-alt"></i>
                            <span>+91 97124 90394</span>
                        </a>
                        
                        <a href="https://wa.me/919712490394?text=Hello%20Devam%2C%20I'm%20interested%20in%20your%20services." 
                           className="contact-whatsapp" 
                           target="_blank"
                           rel="noopener noreferrer">
                            <i className="fab fa-whatsapp"></i>
                            <span>Chat Now</span>
                        </a>
                    </div>

                    <div className="mobile-menu-btn" onClick={toggleMenu}>
                        <i className={`fas fa-${mobileMenuOpen ? 'times' : 'bars'}`}></i>
                    </div>
                </div>
            </nav>

            {/* Overlay - Appears when mobile menu is open */}
            {mobileMenuOpen && <div className="nav-overlay" onClick={closeMenu}></div>}
        </>
    );
};

export default Navbar;