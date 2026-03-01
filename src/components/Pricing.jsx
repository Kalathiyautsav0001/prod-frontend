import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Pricing.css';

const Pricing = () => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [plans, setPlans] = useState([]);
    const [decorationItems, setDecorationItems] = useState([]);
    const [allPlans, setAllPlans] = useState([]);
    
    // Load saved selections from localStorage
    const [selectedItems, setSelectedItems] = useState(() => {
        const saved = localStorage.getItem('selectedItems');
        return saved ? JSON.parse(saved) : [];
    });
    
    const [selectedPlans, setSelectedPlans] = useState(() => {
        const saved = localStorage.getItem('selectedPlans');
        return saved ? JSON.parse(saved) : [];
    });
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [showSummary, setShowSummary] = useState(false);
    const [activeDecoCategory, setActiveDecoCategory] = useState('all');
    const [bookingDetails, setBookingDetails] = useState({
        name: '',
        mobile: '',
        email: '',
        eventDate: '',
        additionalRequirements: '',
        eventType: ''
    });

    const categories = [
        { id: 'all', name: 'All Plans', icon: 'fas fa-list', color: '#6C5CE7' },
        { id: 'Wedding', name: 'Weddings', icon: 'fas fa-heart', color: '#FF6B6B' },
        { id: 'Corporate', name: 'Corporate', icon: 'fas fa-briefcase', color: '#4A90E2' },
        { id: 'Birthday', name: 'Birthday', icon: 'fas fa-birthday-cake', color: '#FFB347' },
        { id: 'Baby Shower', name: 'Baby Shower', icon: 'fas fa-child', color: '#A8E6CF' },
        { id: 'Festival', name: 'Festival', icon: 'fas fa-festival', color: '#FF8E53' }
    ];

    const decorationCategories = [
        { id: 'Flowers', name: 'Flowers', icon: 'fas fa-seedling', color: '#FF6B6B' },
        { id: 'Lighting', name: 'Lighting', icon: 'fas fa-lightbulb', color: '#FFD93D' },
        { id: 'Furniture', name: 'Furniture', icon: 'fas fa-couch', color: '#6C5CE7' },
        { id: 'Backdrops', name: 'Backdrops', icon: 'fas fa-border-all', color: '#00B894' },
        { id: 'Table Settings', name: 'Table Settings', icon: 'fas fa-utensils', color: '#E84342' },
        { id: 'Props', name: 'Props', icon: 'fas fa-camera', color: '#FDCB6E' },
        { id: 'Other', name: 'Other', icon: 'fas fa-gem', color: '#C5A059' }
    ];

    // Save to localStorage whenever selections change
    useEffect(() => {
        localStorage.setItem('selectedPlans', JSON.stringify(selectedPlans));
        localStorage.setItem('selectedItems', JSON.stringify(selectedItems));
        // Log for debugging
        console.log('Selected Plans:', selectedPlans);
        console.log('Selected Items:', selectedItems);
    }, [selectedPlans, selectedItems]);

    // Show summary if there are saved selections on load
    useEffect(() => {
        if (selectedPlans.length > 0 || selectedItems.length > 0) {
            setShowSummary(true);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, []);

    // FIXED: Plans filtering effect
    useEffect(() => {
        if (allPlans.length > 0) {
            if (activeCategory === 'all') {
                setPlans(allPlans);
                console.log('Showing all plans:', allPlans.length);
            } else {
                const filtered = allPlans.filter(plan => plan.category === activeCategory);
                setPlans(filtered);
                console.log(`Showing ${activeCategory} plans:`, filtered.length);
            }
        }
    }, [activeCategory, allPlans]);

    useEffect(() => {
        calculateTotal();
    }, [selectedPlans, selectedItems]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('adminToken');
            let plansEndpoint = 'http://localhost:5000/api/pricing';
            
            let plansData = [];
            if (token) {
                try {
                    const adminPlansRes = await axios.get('http://localhost:5000/api/pricing/admin', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    plansData = adminPlansRes.data;
                } catch (adminError) {
                    console.log('Admin endpoint failed, falling back to public endpoint');
                    const plansRes = await axios.get(plansEndpoint);
                    plansData = plansRes.data;
                }
            } else {
                const plansRes = await axios.get(plansEndpoint);
                plansData = plansRes.data;
            }
            
            setAllPlans(plansData);
            
            // Set plans based on active category
            if (activeCategory === 'all') {
                setPlans(plansData);
            } else {
                setPlans(plansData.filter(plan => plan.category === activeCategory));
            }
            
            const decorationRes = await axios.get('http://localhost:5000/api/decoration');
            setDecorationItems(decorationRes.data);
            
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to load pricing data. Please try again later.');
            
            // Fallback data
            const fallbackPlans = [
                {
                    _id: '1',
                    name: 'Basic Wedding',
                    category: 'Wedding',
                    price: 50000,
                    duration: '6 Hours',
                    guests: '100',
                    features: ['Venue Decoration', 'Basic Catering', 'Photography', 'Music System'],
                    popular: false,
                    isActive: true,
                    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop'
                },
                {
                    _id: '2',
                    name: 'Premium Wedding',
                    category: 'Wedding',
                    price: 150000,
                    duration: '12 Hours',
                    guests: '300',
                    features: ['Luxury Decoration', 'Premium Catering', 'Professional Photography', 'Live Music', 'Wedding Planner'],
                    popular: true,
                    isActive: true,
                    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop'
                },
                {
                    _id: '3',
                    name: 'Corporate Gala',
                    category: 'Corporate',
                    price: 200000,
                    duration: '8 Hours',
                    guests: '200',
                    features: ['Stage Setup', 'AV Equipment', 'Catering', 'Branding', 'Event Management'],
                    popular: false,
                    isActive: true,
                    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop'
                },
                {
                    _id: '4',
                    name: 'Birthday Bash',
                    category: 'Birthday',
                    price: 25000,
                    duration: '4 Hours',
                    guests: '50',
                    features: ['Theme Decoration', 'Cake', 'Entertainment', 'Photography'],
                    popular: false,
                    isActive: true,
                    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=300&fit=crop'
                },
                {
                    _id: '5',
                    name: 'Baby Shower',
                    category: 'Baby Shower',
                    price: 30000,
                    duration: '4 Hours',
                    guests: '50',
                    features: ['Pastel Decoration', 'Games', 'Catering', 'Photo Booth'],
                    popular: false,
                    isActive: true,
                    image: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=400&h=300&fit=crop'
                },
                {
                    _id: '6',
                    name: 'Festival Celebration',
                    category: 'Festival',
                    price: 75000,
                    duration: '8 Hours',
                    guests: '150',
                    features: ['Festive Decoration', 'Catering', 'Music', 'Entertainment'],
                    popular: true,
                    isActive: true,
                    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop'
                }
            ];
            setAllPlans(fallbackPlans);
            if (activeCategory === 'all') {
                setPlans(fallbackPlans);
            } else {
                setPlans(fallbackPlans.filter(p => p.category === activeCategory));
            }
        }
        setLoading(false);
    };

    const calculateTotal = () => {
        const plansTotal = selectedPlans.reduce((sum, plan) => sum + (Number(plan.price) || 0), 0);
        const itemsTotal = selectedItems.reduce((sum, item) => sum + ((Number(item.price) || 0) * (item.quantity || 1)), 0);
        const newTotal = plansTotal + itemsTotal;
        setTotalPrice(newTotal);
        console.log('Total calculated:', newTotal, 'Plans:', plansTotal, 'Items:', itemsTotal);
    };

    const handlePlanSelect = (plan) => {
        console.log('Selecting plan:', plan);
        
        setSelectedPlans(prevSelected => {
            const isSelected = prevSelected.some(p => p._id === plan._id);
            
            let newSelected;
            if (isSelected) {
                newSelected = prevSelected.filter(p => p._id !== plan._id);
                console.log('Removed plan, new count:', newSelected.length);
            } else {
                newSelected = [...prevSelected, plan];
                console.log('Added plan, new count:', newSelected.length);
            }
            
            // Force recalculation of total
            setTimeout(() => {
                const plansTotal = newSelected.reduce((sum, p) => sum + (Number(p.price) || 0), 0);
                const itemsTotal = selectedItems.reduce((sum, item) => sum + ((Number(item.price) || 0) * (item.quantity || 1)), 0);
                setTotalPrice(plansTotal + itemsTotal);
            }, 0);
            
            return newSelected;
        });
        
        setShowSummary(true);
    };

    const isPlanSelected = (planId) => {
        return selectedPlans.some(p => p._id === planId);
    };

    const handleItemSelect = (item) => {
        console.log('Selecting item:', item);
        
        setSelectedItems(prevSelected => {
            const existingItem = prevSelected.find(i => i._id === item._id);
            
            let newSelected;
            if (existingItem) {
                newSelected = prevSelected.filter(i => i._id !== item._id);
                console.log('Removed item, new count:', newSelected.length);
            } else {
                newSelected = [...prevSelected, { ...item, quantity: 1 }];
                console.log('Added item, new count:', newSelected.length);
            }
            
            // Force recalculation of total
            setTimeout(() => {
                const plansTotal = selectedPlans.reduce((sum, p) => sum + (Number(p.price) || 0), 0);
                const itemsTotal = newSelected.reduce((sum, i) => sum + ((Number(i.price) || 0) * (i.quantity || 1)), 0);
                setTotalPrice(plansTotal + itemsTotal);
            }, 0);
            
            return newSelected;
        });
        
        setShowSummary(true);
    };

    const handleIncrementItem = (itemId) => {
        setSelectedItems(prevSelected => {
            const newSelected = prevSelected.map(item => 
                item._id === itemId 
                    ? { ...item, quantity: (item.quantity || 1) + 1 }
                    : item
            );
            
            // Recalculate total
            setTimeout(() => {
                const plansTotal = selectedPlans.reduce((sum, p) => sum + (Number(p.price) || 0), 0);
                const itemsTotal = newSelected.reduce((sum, i) => sum + ((Number(i.price) || 0) * (i.quantity || 1)), 0);
                setTotalPrice(plansTotal + itemsTotal);
            }, 0);
            
            return newSelected;
        });
    };

    const handleDecrementItem = (itemId) => {
        setSelectedItems(prevSelected => {
            const newSelected = prevSelected.map(item => 
                item._id === itemId && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            );
            
            // Recalculate total
            setTimeout(() => {
                const plansTotal = selectedPlans.reduce((sum, p) => sum + (Number(p.price) || 0), 0);
                const itemsTotal = newSelected.reduce((sum, i) => sum + ((Number(i.price) || 0) * (i.quantity || 1)), 0);
                setTotalPrice(plansTotal + itemsTotal);
            }, 0);
            
            return newSelected;
        });
    };

    const isItemSelected = (itemId) => {
        return selectedItems.some(i => i._id === itemId);
    };

    const getItemQuantity = (itemId) => {
        const item = selectedItems.find(i => i._id === itemId);
        return item?.quantity || 0;
    };

    const handleRemovePlan = (planId) => {
        setSelectedPlans(prevSelected => {
            const newSelected = prevSelected.filter(p => p._id !== planId);
            
            // Recalculate total
            setTimeout(() => {
                const plansTotal = newSelected.reduce((sum, p) => sum + (Number(p.price) || 0), 0);
                const itemsTotal = selectedItems.reduce((sum, i) => sum + ((Number(i.price) || 0) * (i.quantity || 1)), 0);
                setTotalPrice(plansTotal + itemsTotal);
            }, 0);
            
            if (newSelected.length === 0 && selectedItems.length === 0) {
                setShowSummary(false);
            }
            
            return newSelected;
        });
    };

    const handleRemoveItem = (itemId) => {
        setSelectedItems(prevSelected => {
            const newSelected = prevSelected.filter(i => i._id !== itemId);
            
            // Recalculate total
            setTimeout(() => {
                const plansTotal = selectedPlans.reduce((sum, p) => sum + (Number(p.price) || 0), 0);
                const itemsTotal = newSelected.reduce((sum, i) => sum + ((Number(i.price) || 0) * (i.quantity || 1)), 0);
                setTotalPrice(plansTotal + itemsTotal);
            }, 0);
            
            if (selectedPlans.length === 0 && newSelected.length === 0) {
                setShowSummary(false);
            }
            
            return newSelected;
        });
    };

    const handleClearAll = () => {
        setSelectedPlans([]);
        setSelectedItems([]);
        setTotalPrice(0);
        setShowSummary(false);
        localStorage.removeItem('selectedPlans');
        localStorage.removeItem('selectedItems');
    };

    const handleBookingInputChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;
        
        if (name === 'mobile') {
            formattedValue = value.replace(/\D/g, '').slice(0, 10);
        }
        
        setBookingDetails({
            ...bookingDetails,
            [name]: formattedValue
        });
    };

    const validateBookingForm = () => {
        if (!bookingDetails.name.trim()) {
            alert('Please enter your name');
            return false;
        }
        if (!bookingDetails.mobile || bookingDetails.mobile.length !== 10) {
            alert('Please enter a valid 10-digit mobile number');
            return false;
        }
        if (!bookingDetails.email || !bookingDetails.email.includes('@')) {
            alert('Please enter a valid email address');
            return false;
        }
        if (!bookingDetails.eventDate) {
            alert('Please select your event date');
            return false;
        }
        return true;
    };

    const generateWhatsAppMessage = () => {
        const eventDate = new Date(bookingDetails.eventDate).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        let message = `*New Event Booking Inquiry*%0A%0A`;
        message += `*Customer Details*%0A`;
        message += `👤 Name: ${bookingDetails.name}%0A`;
        message += `📱 Mobile: ${bookingDetails.mobile}%0A`;
        message += `📧 Email: ${bookingDetails.email}%0A`;
        message += `📅 Event Date: ${eventDate}%0A%0A`;

        if (selectedPlans.length > 0) {
            message += `*Selected Plans*%0A`;
            selectedPlans.forEach(plan => {
                message += `📋 Plan: ${plan.name} (${plan.category})%0A`;
                message += `💰 Price: ₹${Number(plan.price || 0).toLocaleString()}%0A`;
                message += `⏱️ Duration: ${plan.duration}%0A`;
                message += `👥 Guests: ${plan.guests}%0A`;
                message += `Features:%0A`;
                (plan.features || []).forEach(feature => {
                    message += `  • ${feature}%0A`;
                });
                message += `%0A`;
            });
        }

        if (selectedItems.length > 0) {
            message += `*Selected Decoration Items*%0A`;
            selectedItems.forEach(item => {
                message += `  • ${item.name} x${item.quantity || 1} - ₹${((Number(item.price) || 0) * (item.quantity || 1)).toLocaleString()} (₹${(Number(item.price) || 0).toLocaleString()}/${item.priceType || 'item'})%0A`;
            });
            message += `%0A`;
        }

        message += `*Total Estimated Price*: ₹${totalPrice.toLocaleString()}%0A%0A`;

        if (bookingDetails.additionalRequirements) {
            message += `*Additional Requirements*%0A`;
            message += `${bookingDetails.additionalRequirements}%0A%0A`;
        }

        message += `_This is an automated inquiry from the website._`;

        return message;
    };

    const handleBookNow = () => {
        if (selectedPlans.length === 0 && selectedItems.length === 0) {
            alert('Please select a plan or items first');
            return;
        }
        setShowBookingForm(true);
    };

    const handleSubmitBooking = (e) => {
        e.preventDefault();
        
        if (!validateBookingForm()) {
            return;
        }

        const whatsappNumber = '919712490394';
        const message = generateWhatsAppMessage();
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
        
        window.open(whatsappUrl, '_blank');
        
        setShowBookingForm(false);
    };

    const closeBookingForm = () => {
        setShowBookingForm(false);
    };

    const toggleSummary = () => {
        setShowSummary(!showSummary);
    };

    const closeSummary = () => {
        setShowSummary(false);
    };

    // FIXED: Separate counters for plans and items
    const getSelectedPlansCount = () => {
        return selectedPlans.length;
    };

    const getSelectedItemsCount = () => {
        return selectedItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
    };

    const filteredDecorationItems = activeDecoCategory === 'all' 
        ? decorationItems 
        : decorationItems.filter(item => item.category === activeDecoCategory);

    if (loading) {
        return (
            <section className="pricing-section">
                <div className="container">
                    <div className="loading-spinner">
                        <div className="spinner-ring"></div>
                        <div className="spinner-ring"></div>
                        <div className="spinner-ring"></div>
                        <p>Loading amazing packages...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="pricing-section">
                <div className="container">
                    <div className="error-message">
                        <i className="fas fa-exclamation-circle"></i>
                        <p>{error}</p>
                        <button onClick={fetchData} className="retry-btn">
                            <i className="fas fa-redo-alt"></i> Retry
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="pricing-section">
            {/* Decorative Background Elements */}
            <div className="pricing-bg-decoration">
                <div className="bg-circle circle-1"></div>
                <div className="bg-circle circle-2"></div>
                <div className="bg-circle circle-3"></div>
            </div>

            <div className="container">
                {/* Header Section */}
                <div className="section-header">
                    <div className="section-subtitle">
                        <span className="subtitle-line"></span>
                        Our Packages
                        <span className="subtitle-line"></span>
                    </div>
                    <h2 className="section-title">
                        <span className="title-word">Pricing</span>
                        <span className="title-word accent">Plans</span>
                    </h2>
                    <div className="title-decoration">
                        <i className="fas fa-tag"></i>
                        <span className="decoration-line"></span>
                        <i className="fas fa-star"></i>
                        <span className="decoration-line"></span>
                        <i className="fas fa-gem"></i>
                    </div>
                    <p className="pricing-description">
                        Choose from our curated packages and customize with our premium decoration items
                    </p>
                </div>

                {/* Category Tabs */}
                <div className="pricing-categories">
                    {categories.map(category => (
                        <button
                            key={category.id}
                            className={`category-tab ${activeCategory === category.id ? 'active' : ''}`}
                            onClick={() => setActiveCategory(category.id)}
                            style={{ '--category-color': category.color }}
                        >
                            <i className={category.icon}></i>
                            <span>{category.name}</span>
                            {category.id !== 'all' && (
                                <span className="category-count">
                                    {allPlans.filter(p => p.category === category.id).length}
                                </span>
                            )}
                            {category.id === 'all' && (
                                <span className="category-count">{allPlans.length}</span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Plans Grid */}
                {plans.length > 0 ? (
                    <div className="plans-grid">
                        {plans.map((plan, index) => (
                            <div 
                                key={plan._id} 
                                className={`plan-card ${isPlanSelected(plan._id) ? 'selected' : ''} ${plan.popular ? 'popular' : ''}`}
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                {plan.popular && (
                                    <div className="popular-badge">
                                        <i className="fas fa-crown"></i>
                                        Most Popular
                                    </div>
                                )}
                                <div className="plan-image">
                                    <img src={plan.image || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop'} alt={plan.name} />
                                    <div className="plan-image-overlay"></div>
                                </div>
                                <div className="plan-content">
                                    <h3 className="plan-name">{plan.name}</h3>
                                    <div className="plan-price">
                                        <span className="currency">₹</span>
                                        <span className="amount">{Number(plan.price || 0).toLocaleString()}</span>
                                    </div>
                                    <div className="plan-details">
                                        <span className="plan-detail">
                                            <i className="fas fa-clock"></i>
                                            {plan.duration || 'N/A'}
                                        </span>
                                        <span className="plan-detail">
                                            <i className="fas fa-users"></i>
                                            Up to {plan.guests || 'N/A'}
                                        </span>
                                    </div>
                                    <ul className="plan-features">
                                        {(plan.features || []).map((feature, index) => (
                                            <li key={index}>
                                                <i className="fas fa-check-circle"></i>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="plan-actions">
                                        <button 
                                            className={`select-btn ${isPlanSelected(plan._id) ? 'selected' : ''}`}
                                            onClick={() => handlePlanSelect(plan)}
                                        >
                                            {isPlanSelected(plan._id) ? (
                                                <>
                                                    <i className="fas fa-check-circle"></i>
                                                    Selected
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-plus-circle"></i>
                                                    Select Plan
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-plans">
                        <i className="fas fa-box-open"></i>
                        <h3>No plans available</h3>
                        <p>Check back soon for exciting packages!</p>
                        <button onClick={() => setActiveCategory('all')} className="view-all-btn">
                            View All Categories
                        </button>
                    </div>
                )}

                {/* Decoration Items Section */}
                <div className="decoration-section">
                    <div className="decoration-header">
                        <h3 className="decoration-title">
                            <i className="fas fa-gem"></i>
                            <span>Enhance Your Event</span>
                        </h3>
                        <p className="decoration-subtitle">
                            Add premium decoration items to make your event unforgettable
                        </p>
                    </div>

                    {/* Decoration Categories */}
                    <div className="decoration-categories-wrapper">
                        <button
                            className={`decoration-cat-btn ${activeDecoCategory === 'all' ? 'active' : ''}`}
                            onClick={() => setActiveDecoCategory('all')}
                        >
                            <i className="fas fa-th-large"></i>
                            <span>All Items</span>
                            <span className="category-count">{decorationItems.length}</span>
                        </button>
                        {decorationCategories.map(cat => {
                            const count = decorationItems.filter(item => item.category === cat.id).length;
                            return count > 0 && (
                                <button
                                    key={cat.id}
                                    className={`decoration-cat-btn ${activeDecoCategory === cat.id ? 'active' : ''}`}
                                    onClick={() => setActiveDecoCategory(cat.id)}
                                    style={{ '--cat-color': cat.color }}
                                >
                                    <i className={cat.icon}></i>
                                    <span>{cat.name}</span>
                                    <span className="category-count">{count}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Items Grid */}
                    {filteredDecorationItems.length > 0 ? (
                        <div className="items-grid">
                            {filteredDecorationItems.map((item, index) => {
                                const isSelected = isItemSelected(item._id);
                                const quantity = getItemQuantity(item._id);
                                const category = decorationCategories.find(c => c.id === item.category);
                                
                                return (
                                    <div 
                                        key={item._id} 
                                        className={`item-card ${isSelected ? 'selected' : ''} ${!item.available ? 'unavailable' : ''}`}
                                        style={{ animationDelay: `${index * 0.05}s` }}
                                    >
                                        <div className="item-image">
                                            <img src={item.image || 'https://via.placeholder.com/300x200?text=No+Image'} alt={item.name} />
                                            {!item.available && (
                                                <div className="out-of-stock">
                                                    <span>Out of Stock</span>
                                                </div>
                                            )}
                                            {category && (
                                                <div className="item-category-badge" style={{ backgroundColor: category.color }}>
                                                    <i className={category.icon}></i>
                                                </div>
                                            )}
                                        </div>
                                        <div className="item-content">
                                            <h5 className="item-name">{item.name}</h5>
                                            <p className="item-description">{item.description}</p>
                                            <div className="item-price">
                                                <span className="current-price">₹{Number(item.price || 0).toLocaleString()}</span>
                                                <span className="price-type">/{item.priceType || 'item'}</span>
                                            </div>
                                            {item.stock > 0 && item.stock < 10 && (
                                                <div className="item-stock warning">Only {item.stock} left</div>
                                            )}
                                            {item.tags && item.tags.length > 0 && (
                                                <div className="item-tags">
                                                    {item.tags.slice(0, 3).map((tag, i) => (
                                                        <span key={i} className="item-tag">#{tag}</span>
                                                    ))}
                                                </div>
                                            )}
                                            
                                            <div className="item-controls">
                                                {!isSelected ? (
                                                    <button 
                                                        className="add-btn"
                                                        onClick={() => handleItemSelect(item)}
                                                        disabled={!item.available}
                                                    >
                                                        <i className="fas fa-plus"></i>
                                                        Add to Cart
                                                    </button>
                                                ) : (
                                                    <div className="quantity-controls">
                                                        <button 
                                                            className="qty-btn"
                                                            onClick={() => handleDecrementItem(item._id)}
                                                            disabled={quantity <= 1}
                                                        >
                                                            <i className="fas fa-minus"></i>
                                                        </button>
                                                        <span className="qty-value">{quantity}</span>
                                                        <button 
                                                            className="qty-btn"
                                                            onClick={() => handleIncrementItem(item._id)}
                                                            disabled={quantity >= (item.stock || 99)}
                                                        >
                                                            <i className="fas fa-plus"></i>
                                                        </button>
                                                        <button 
                                                            className="remove-item-btn"
                                                            onClick={() => handleRemoveItem(item._id)}
                                                            title="Remove Item"
                                                        >
                                                            <i className="fas fa-trash-alt"></i>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="no-items">
                            <i className="fas fa-box-open"></i>
                            <p>No items available in this category</p>
                        </div>
                    )}
                </div>

                {/* Floating Action Button - FIXED with separate counts */}
                {(selectedPlans.length > 0 || selectedItems.length > 0) && (
                    <div className="floating-action-btn" onClick={toggleSummary}>
                        <div className="fab-content">
                            <i className="fas fa-shopping-cart"></i>
                            <div className="fab-counts">
                                {selectedPlans.length > 0 && (
                                    <span className="fab-count plans-count" title="Selected Plans">
                                        <i className="fas fa-crown"></i> {selectedPlans.length}
                                    </span>
                                )}
                                {selectedItems.length > 0 && (
                                    <span className="fab-count items-count" title="Selected Items">
                                        <i className="fas fa-gem"></i> {getSelectedItemsCount()}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="fab-preview">
                            <span className="fab-total">₹{totalPrice.toLocaleString()}</span>
                        </div>
                        <div className="fab-tooltip">View Selection</div>
                    </div>
                )}

                {/* Selection Summary Modal */}
                {(selectedPlans.length > 0 || selectedItems.length > 0) && showSummary && (
                    <div className="summary-overlay" onClick={closeSummary}>
                        <div className="selection-summary-large" onClick={(e) => e.stopPropagation()}>
                            <div className="summary-header">
                                <h3>
                                    <i className="fas fa-shopping-cart"></i>
                                    Your Selection
                                </h3>
                                <div className="summary-counts">
                                    {selectedPlans.length > 0 && (
                                        <span className="summary-count plans-summary-count">
                                            <i className="fas fa-crown"></i> {selectedPlans.length} Plans
                                        </span>
                                    )}
                                    {selectedItems.length > 0 && (
                                        <span className="summary-count items-summary-count">
                                            <i className="fas fa-gem"></i> {getSelectedItemsCount()} Items
                                        </span>
                                    )}
                                </div>
                                <button className="close-summary-btn" onClick={closeSummary}>
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                            
                            <div className="summary-content">
                                {selectedPlans.map(plan => (
                                    <div key={plan._id} className="summary-plan-card">
                                        <div className="summary-item-icon plan-icon">
                                            <i className="fas fa-crown"></i>
                                        </div>
                                        <div className="summary-item-details">
                                            <h4>{plan.name}</h4>
                                            <p className="summary-item-category">{plan.category}</p>
                                            <div className="summary-item-meta">
                                                <span><i className="fas fa-clock"></i> {plan.duration}</span>
                                                <span><i className="fas fa-users"></i> {plan.guests} guests</span>
                                            </div>
                                        </div>
                                        <div className="summary-item-price">
                                            <span className="price">₹{Number(plan.price || 0).toLocaleString()}</span>
                                            <button className="remove-btn" onClick={() => handleRemovePlan(plan._id)}>
                                                <i className="fas fa-trash-alt"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                
                                {selectedItems.map(item => (
                                    <div key={item._id} className="summary-item-card">
                                        <div className="summary-item-icon">
                                            <i className="fas fa-gem"></i>
                                        </div>
                                        <div className="summary-item-details">
                                            <h4>{item.name}</h4>
                                            <p className="summary-item-category">{item.category}</p>
                                            <p className="summary-item-description">{item.description?.substring(0, 60)}...</p>
                                        </div>
                                        <div className="summary-item-price">
                                            <div className="price-info">
                                                <span className="price">₹{((Number(item.price) || 0) * (item.quantity || 1)).toLocaleString()}</span>
                                                <span className="price-type">/{item.priceType || 'item'}</span>
                                            </div>
                                            <div className="summary-quantity-controls">
                                                <button 
                                                    className="qty-btn small"
                                                    onClick={() => handleDecrementItem(item._id)}
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <i className="fas fa-minus"></i>
                                                </button>
                                                <span className="qty-value small">{item.quantity || 1}</span>
                                                <button 
                                                    className="qty-btn small"
                                                    onClick={() => handleIncrementItem(item._id)}
                                                >
                                                    <i className="fas fa-plus"></i>
                                                </button>
                                            </div>
                                            <button className="remove-btn small" onClick={() => handleRemoveItem(item._id)}>
                                                <i className="fas fa-trash-alt"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                
                                <div className="summary-total-section">
                                    <div className="total-label">
                                        <i className="fas fa-calculator"></i>
                                        Total Amount
                                    </div>
                                    <div className="total-amount">
                                        <span className="total-currency">₹</span>
                                        <span className="total-value">{totalPrice.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="summary-footer">
                                <button className="continue-btn" onClick={closeSummary}>
                                    <i className="fas fa-arrow-left"></i>
                                    Continue Shopping
                                </button>
                                <button className="clear-all-btn" onClick={handleClearAll}>
                                    <i className="fas fa-trash-alt"></i>
                                    Clear All
                                </button>
                                <button className="book-btn" onClick={handleBookNow}>
                                    <i className="fas fa-calendar-check"></i>
                                    Proceed to Book
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Booking Form Modal */}
                {showBookingForm && (
                    <div className="booking-overlay" onClick={closeBookingForm}>
                        <div className="booking-form-large" onClick={(e) => e.stopPropagation()}>
                            <div className="booking-header">
                                <h3>
                                    <i className="fas fa-calendar-check"></i>
                                    Complete Your Booking
                                </h3>
                                <button className="close-btn" onClick={closeBookingForm}>
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                            
                            <div className="booking-body">
                                <p className="booking-subtitle">
                                    Please fill in your details below. We'll send your inquiry via WhatsApp.
                                </p>
                                
                                <form onSubmit={handleSubmitBooking} className="booking-form-enhanced">
                                    <div className="form-section">
                                        <h4 className="form-section-title">
                                            <i className="fas fa-user-circle"></i>
                                            Personal Information
                                        </h4>
                                        <div className="form-grid">
                                            <div className="form-field">
                                                <label>
                                                    <i className="fas fa-user"></i>
                                                    <span>Full Name <span className="required">*</span></span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={bookingDetails.name}
                                                    onChange={handleBookingInputChange}
                                                    placeholder="Enter your full name"
                                                    required
                                                />
                                            </div>
                                            
                                            <div className="form-field">
                                                <label>
                                                    <i className="fas fa-phone-alt"></i>
                                                    <span>Mobile Number <span className="required">*</span></span>
                                                </label>
                                                <input
                                                    type="tel"
                                                    name="mobile"
                                                    value={bookingDetails.mobile}
                                                    onChange={handleBookingInputChange}
                                                    placeholder="10-digit mobile number"
                                                    maxLength="10"
                                                    required
                                                />
                                            </div>

                                            <div className="form-field">
                                                <label>
                                                    <i className="fas fa-envelope"></i>
                                                    <span>Email Address <span className="required">*</span></span>
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={bookingDetails.email}
                                                    onChange={handleBookingInputChange}
                                                    placeholder="your@email.com"
                                                    required
                                                />
                                            </div>

                                            <div className="form-field">
                                                <label>
                                                    <i className="fas fa-calendar"></i>
                                                    <span>Event Date <span className="required">*</span></span>
                                                </label>
                                                <input
                                                    type="date"
                                                    name="eventDate"
                                                    value={bookingDetails.eventDate}
                                                    onChange={handleBookingInputChange}
                                                    min={new Date().toISOString().split('T')[0]}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-section">
                                        <h4 className="form-section-title">
                                            <i className="fas fa-comment-dots"></i>
                                            Additional Requirements
                                        </h4>
                                        <div className="form-field full-width">
                                            <textarea
                                                name="additionalRequirements"
                                                value={bookingDetails.additionalRequirements}
                                                onChange={handleBookingInputChange}
                                                placeholder="Tell us more about your requirements, special requests, or any questions you have..."
                                                rows="4"
                                            />
                                        </div>
                                    </div>

                                    <div className="selection-preview">
                                        <div className="preview-header">
                                            <i className="fas fa-shopping-cart"></i>
                                            <span>Your Selection Summary</span>
                                        </div>
                                        <div className="preview-content">
                                            <div className="preview-row">
                                                <span className="preview-label">Plans Selected:</span>
                                                <span className="preview-value">{selectedPlans.length}</span>
                                            </div>
                                            <div className="preview-row">
                                                <span className="preview-label">Items Selected:</span>
                                                <span className="preview-value">{getSelectedItemsCount()}</span>
                                            </div>
                                            <div className="preview-row total-row">
                                                <span className="preview-label">Total Amount:</span>
                                                <span className="preview-amount">₹{totalPrice.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-actions">
                                        <button type="submit" className="submit-btn">
                                            <i className="fab fa-whatsapp"></i>
                                            Send via WhatsApp
                                        </button>
                                        <button type="button" className="cancel-btn" onClick={closeBookingForm}>
                                            <i className="fas fa-times"></i>
                                            Cancel
                                        </button>
                                    </div>

                                    <p className="form-note">
                                        <i className="fas fa-info-circle"></i>
                                        You'll be redirected to WhatsApp to send your inquiry. No information is stored on our server.
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Pricing;