import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AutoScrollTop from './components/AutoScrollTop'; // Scrolls to top on route change
import ScrollToTop from './components/ScrollToTop'; // Floating scroll-to-top button
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import GalleryPage from './pages/GalleryPage';
import TestimonialsPage from './pages/TestimonialsPage';
import ContactPage from './pages/ContactPage';
import PricingPage from './pages/PricingPage';
import AdminLogin from './components/AdminLogin';
import AdminPage from './pages/AdminPage';
import './styles/global.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
    
    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }
    
    return children;
};

function App() {
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

    useEffect(() => {
        const auth = localStorage.getItem('adminAuthenticated') === 'true';
        setIsAdminAuthenticated(auth);
    }, []);

    const handleLogin = () => {
        setIsAdminAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('adminAuthenticated');
        localStorage.removeItem('adminToken');
        setIsAdminAuthenticated(false);
    };

    return (
        <Router>
            <div className="App">
                {/* Auto scroll to top on route change */}
                <AutoScrollTop />
                
                {/* Floating scroll to top button - appears after scrolling */}
                <ScrollToTop />
                
                {/* Only show Navbar if not on admin pages */}
                {!window.location.pathname.includes('/admin') && <Navbar />}
                
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/pricing" element={<PricingPage />} />
                    <Route path="/gallery" element={<GalleryPage />} />
                    <Route path="/testimonials" element={<TestimonialsPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    
                    {/* Admin Routes */}
                    <Route path="/admin/login" element={<AdminLogin onLogin={handleLogin} />} />
                    <Route 
                        path="/admin/dashboard" 
                        element={
                            <ProtectedRoute>
                                <AdminPage onLogout={handleLogout} />
                            </ProtectedRoute>
                        } 
                    />
                    <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                </Routes>
                
                {/* Only show Footer if not on admin pages */}
                {!window.location.pathname.includes('/admin') && <Footer />}
            </div>
        </Router>
    );
}

export default App;