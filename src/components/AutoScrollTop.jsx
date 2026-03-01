import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const AutoScrollTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // Scroll to top smoothly when route changes
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth' // Adds smooth scrolling animation
        });
    }, [pathname]); // Trigger whenever pathname changes

    return null; // This component doesn't render anything
};

export default AutoScrollTop;