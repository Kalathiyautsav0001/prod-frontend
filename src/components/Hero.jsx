import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
    return (
        <section className="hero">
            <div className="hero-background"></div>
            <div className="hero-overlay"></div>
            <div className="hero-content">
                <div className="hero-subtitle">Luxury Event Planning</div>
                <h1>Crafting Unforgettable<br/>Moments of Elegance</h1>
                <div className="hero-divider"></div>
                <p>Weddings • Corporate Galas • Milestone Celebrations • Birthday Parties</p>
                <Link to="/gallery" className="btn-primary">Discover Portfolio</Link>
            </div>
        </section>
    );
};

export default Hero;