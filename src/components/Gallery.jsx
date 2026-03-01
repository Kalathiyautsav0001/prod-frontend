import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Gallery.css';

const Gallery = () => {
    const [photos, setPhotos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [categories, setCategories] = useState([
        // Wedding Category
        { id: 'Weddings', name: 'Weddings', icon: 'fas fa-heart', color: '#FF6B6B' },
        { id: 'Engagement', name: 'Engagement', icon: 'fas fa-ring', color: '#FF8E53' },
        { id: 'Sangeet', name: 'Sangeet Night', icon: 'fas fa-music', color: '#FFB347' },
        { id: 'Haldi', name: 'Haldi & Mehendi', icon: 'fas fa-hand-holding-heart', color: '#FFD93D' },
        
        // Corporate Category
        { id: 'Corporate', name: 'Corporate Events', icon: 'fas fa-briefcase', color: '#4A90E2' },
        { id: 'Corporate Gala', name: 'Corporate Gala', icon: 'fas fa-glass-cheers', color: '#6C5CE7' },
        { id: 'Team Building', name: 'Team Building', icon: 'fas fa-users', color: '#00B894' },
        { id: 'Product Launch', name: 'Product Launch', icon: 'fas fa-rocket', color: '#E84342' },
        { id: 'Award Ceremony', name: 'Award Ceremony', icon: 'fas fa-trophy', color: '#FDCB6E' },
        
        // Birthday Category
        { id: 'Birthday', name: 'Birthday Parties', icon: 'fas fa-birthday-cake', color: '#E84342' },
        { id: 'Sweet 16', name: 'Sweet 16', icon: 'fas fa-crown', color: '#FF7675' },
        { id: 'First Birthday', name: 'First Birthday', icon: 'fas fa-baby', color: '#74B9FF' },
        
        // Baby Category
        { id: 'Baby Shower', name: 'Baby Showers', icon: 'fas fa-child', color: '#A8E6CF' },
        { id: 'Gender Reveal', name: 'Gender Reveal', icon: 'fas fa-gift', color: '#FFAAA5' },
        { id: 'Naming Ceremony', name: 'Naming Ceremony', icon: 'fas fa-pray', color: '#FFD3B6' },
        
        // Anniversary Category
        { id: 'Anniversary', name: 'Anniversary', icon: 'fas fa-heart', color: '#FF6B6B' },
        
        // Festival Section
        { id: 'Festival', name: 'Festival Celebrations', icon: 'fas fa-festival', color: '#FF8E53' },
        
        // Festival Subcategories
        { id: 'Diwali', name: 'Diwali', icon: 'fas fa-festival', color: '#FFB347' },
        { id: 'Holi', name: 'Holi', icon: 'fas fa-paint-brush', color: '#E84342' },
        { id: 'Christmas', name: 'Christmas', icon: 'fas fa-tree', color: '#00B894' },
        { id: 'New Year', name: 'New Year', icon: 'fas fa-glass-cheers', color: '#6C5CE7' },
        { id: 'Eid', name: 'Eid', icon: 'fas fa-moon', color: '#4A90E2' },
        { id: 'Navratri', name: 'Navratri', icon: 'fas fa-drum', color: '#FF6B6B' },
        { id: 'Ganesh Chaturthi', name: 'Ganesh Chaturthi', icon: 'fas fa-festival', color: '#FDCB6E' },
        { id: 'Durga Puja', name: 'Durga Puja', icon: 'fas fa-festival', color: '#E84342' },
        { id: 'Ramadan', name: 'Ramadan', icon: 'fas fa-moon', color: '#4A90E2' },
        { id: 'Raksha Bandhan', name: 'Raksha Bandhan', icon: 'fas fa-hand-holding-heart', color: '#FF8E53' },
        { id: 'Lohri', name: 'Lohri', icon: 'fas fa-fire', color: '#FF6B6B' },
        { id: 'Pongal', name: 'Pongal', icon: 'fas fa-festival', color: '#FDCB6E' },
        { id: 'Onam', name: 'Onam', icon: 'fas fa-festival', color: '#00B894' },
        { id: 'Baisakhi', name: 'Baisakhi', icon: 'fas fa-festival', color: '#FFB347' },
        { id: 'Gudi Padwa', name: 'Gudi Padwa', icon: 'fas fa-festival', color: '#6C5CE7' },
        { id: 'Ugadi', name: 'Ugadi', icon: 'fas fa-festival', color: '#FF7675' },
        { id: 'Makar Sankranti', name: 'Makar Sankranti', icon: 'fas fa-festival', color: '#74B9FF' },
        { id: 'Rath Yatra', name: 'Rath Yatra', icon: 'fas fa-festival', color: '#E84342' },
        { id: 'Janmashtami', name: 'Janmashtami', icon: 'fas fa-festival', color: '#4A90E2' },
        { id: 'Maha Shivratri', name: 'Maha Shivratri', icon: 'fas fa-festival', color: '#6C5CE7' }
    ]);
    const [activeCategory, setActiveCategory] = useState('all');
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategoryGroup, setSelectedCategoryGroup] = useState('all');

    useEffect(() => {
        fetchPhotos();
    }, []);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setIsSearching(false);
            setSearchResults([]);
        } else {
            setIsSearching(true);
            const results = photos.filter(photo => {
                const categoryObj = categories.find(c => c.id === photo.category);
                const categoryName = categoryObj?.name || photo.category || '';
                return categoryName.toLowerCase().includes(searchTerm.toLowerCase());
            });
            setSearchResults(results);
        }
    }, [searchTerm, photos, categories]);

    const fetchPhotos = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/gallery');
            console.log('Fetched photos:', response.data);
            setPhotos(response.data);
            setError(null);
        } catch (error) {
            console.error('Error fetching photos:', error);
            setError('Failed to load gallery. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const getMediaUrl = (photo) => {
        return photo.mediaUrl || photo.imageUrl || photo.url || '';
    };

    const getMediaType = (photo) => {
        return photo.mediaType || (photo.imageUrl ? 'image' : 'unknown');
    };

    const displayPhotos = isSearching ? searchResults : 
        (activeCategory === 'all' ? photos : photos.filter(photo => photo.category === activeCategory));

    const openViewer = (index) => {
        setSelectedImage(index);
        document.body.style.overflow = 'hidden';
    };

    const closeViewer = () => {
        setSelectedImage(null);
        document.body.style.overflow = 'unset';
    };

    const changePhoto = (direction) => {
        const newIndex = selectedImage + direction;
        if (newIndex >= 0 && newIndex < displayPhotos.length) {
            setSelectedImage(newIndex);
        }
    };

    const clearSearch = () => {
        setSearchTerm('');
        setIsSearching(false);
    };

    // Group categories by type
    const categoryGroups = {
        'Weddings': ['Weddings', 'Engagement', 'Sangeet', 'Haldi'],
        'Corporate': ['Corporate', 'Corporate Gala', 'Team Building', 'Product Launch', 'Award Ceremony'],
        'Birthday': ['Birthday', 'Sweet 16', 'First Birthday'],
        'Baby': ['Baby Shower', 'Gender Reveal', 'Naming Ceremony'],
        'Anniversary': ['Anniversary'],
        'Festivals': ['Diwali', 'Holi', 'Christmas', 'New Year', 'Eid', 'Navratri', 'Ganesh Chaturthi', 'Durga Puja', 'Ramadan', 'Raksha Bandhan', 'Lohri', 'Pongal', 'Onam', 'Baisakhi', 'Gudi Padwa', 'Ugadi', 'Makar Sankranti', 'Rath Yatra', 'Janmashtami', 'Maha Shivratri']
    };

    const getCategoryColor = (categoryId) => {
        const category = categories.find(c => c.id === categoryId);
        return category?.color || '#C5A059';
    };

    const getGridSize = (index) => {
        if (index % 7 === 0) return 'featured';
        if (index % 5 === 0) return 'wide';
        if (index % 4 === 0) return 'tall';
        if (index % 3 === 0) return 'horizontal';
        return '';
    };

    if (loading) {
        return (
            <section className="gallery-section">
                <div className="container">
                    <div className="loading-spinner">
                        <div className="spinner-ring"></div>
                        <div className="spinner-ring"></div>
                        <div className="spinner-ring"></div>
                        <p>Loading gallery...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="gallery-section">
                <div className="container">
                    <div className="error-message">
                        <div className="error-icon">
                            <i className="fas fa-exclamation-circle"></i>
                        </div>
                        <p>{error}</p>
                        <button onClick={fetchPhotos} className="retry-btn">
                            <i className="fas fa-redo-alt"></i> Try Again
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="gallery-section">
            {/* Decorative Background Elements */}
            <div className="gallery-bg-decoration">
                <div className="bg-circle circle-1"></div>
                <div className="bg-circle circle-2"></div>
                <div className="bg-circle circle-3"></div>
            </div>

            <div className="container">
                {/* Header Section */}
                <div className="section-header">
                    <div className="section-subtitle">
                        <span className="subtitle-line"></span>
                        Our Portfolio
                        <span className="subtitle-line"></span>
                    </div>
                    <h2 className="section-title">
                        <span className="title-word">Captured</span>
                        <span className="title-word accent">Moments</span>
                    </h2>
                    <div className="title-decoration">
                        <i className="fas fa-camera"></i>
                        <span className="decoration-line"></span>
                        <i className="fas fa-star"></i>
                        <span className="decoration-line"></span>
                        <i className="fas fa-video"></i>
                    </div>
                    <p className="gallery-description">
                        Explore our collection of beautiful moments captured across weddings, 
                        corporate events, birthday celebrations, and vibrant festivals.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="gallery-search-wrapper">
                    <div className="search-container">
                        <i className="fas fa-search search-icon"></i>
                        <input
                            type="text"
                            placeholder="Search by category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        {searchTerm && (
                            <button className="clear-search" onClick={clearSearch}>
                                <i className="fas fa-times"></i>
                            </button>
                        )}
                    </div>
                    <div className="search-stats">
                        <span className="stats-count">{photos.length}</span> total moments
                    </div>
                </div>

                {/* Category Groups */}
                {!isSearching && (
                    <div className="category-groups">
                        <button
                            className={`group-btn ${selectedCategoryGroup === 'all' ? 'active' : ''}`}
                            onClick={() => setSelectedCategoryGroup('all')}
                        >
                            <i className="fas fa-th-large"></i>
                            All Categories
                        </button>
                        {Object.keys(categoryGroups).map(group => (
                            <button
                                key={group}
                                className={`group-btn ${selectedCategoryGroup === group ? 'active' : ''}`}
                                onClick={() => setSelectedCategoryGroup(group)}
                            >
                                <i className={`fas fa-${group === 'Weddings' ? 'heart' : 
                                    group === 'Corporate' ? 'briefcase' :
                                    group === 'Birthday' ? 'birthday-cake' :
                                    group === 'Baby' ? 'baby' :
                                    group === 'Anniversary' ? 'heart' : 'festival'}`}>
                                </i>
                                {group}
                            </button>
                        ))}
                    </div>
                )}

                {/* Category Chips */}
                {!isSearching && (
                    <div className="gallery-categories-wrapper">
                        <div className="gallery-categories">
                            <button
                                className={`category-chip ${activeCategory === 'all' ? 'active' : ''}`}
                                onClick={() => setActiveCategory('all')}
                            >
                                <i className="fas fa-images"></i>
                                <span>All Events</span>
                            </button>
                            {categories
                                .filter(cat => selectedCategoryGroup === 'all' || 
                                    categoryGroups[selectedCategoryGroup]?.includes(cat.id))
                                .map(category => (
                                    <button
                                        key={category.id}
                                        className={`category-chip ${activeCategory === category.id ? 'active' : ''}`}
                                        onClick={() => setActiveCategory(category.id)}
                                        style={{ '--category-color': category.color }}
                                    >
                                        <i className={category.icon}></i>
                                        <span>{category.name}</span>
                                    </button>
                                ))}
                        </div>
                    </div>
                )}

                {/* Search Results Info */}
                {isSearching && (
                    <div className="search-results-info">
                        <div className="results-badge">
                            <i className="fas fa-search"></i>
                            <span>Found <strong>{searchResults.length}</strong> {searchResults.length === 1 ? 'result' : 'results'}</span>
                        </div>
                        {searchTerm && (
                            <div className="search-term">
                                for "<strong>{searchTerm}</strong>"
                            </div>
                        )}
                        <button className="clear-search-btn" onClick={clearSearch}>
                            <i className="fas fa-times"></i> Clear Search
                        </button>
                    </div>
                )}

                {/* Gallery Grid */}
                <div className="gallery-grid-container">
                    {displayPhotos.length > 0 ? (
                        <div className="gallery-grid">
                            {displayPhotos.map((photo, index) => {
                                const categoryObj = categories.find(c => c.id === photo.category);
                                const mediaUrl = getMediaUrl(photo);
                                const mediaType = getMediaType(photo);
                                const categoryColor = getCategoryColor(photo.category);
                                
                                return (
                                    <div 
                                        className={`gallery-item ${getGridSize(index)}`} 
                                        key={photo._id || index}
                                        onClick={() => openViewer(index)}
                                        style={{ '--item-color': categoryColor }}
                                    >
                                        <div className="gallery-item-inner">
                                            {mediaType === 'video' ? (
                                                <video 
                                                    src={mediaUrl} 
                                                    muted 
                                                    loop 
                                                    onError={(e) => {
                                                        console.error('Video failed to load:', mediaUrl);
                                                        e.target.style.display = 'none';
                                                        e.target.parentElement.innerHTML += '<div class="media-placeholder"><i class="fas fa-video"></i><span>Video unavailable</span></div>';
                                                    }}
                                                />
                                            ) : (
                                                <img 
                                                    src={mediaUrl} 
                                                    alt={categoryObj?.name || 'Gallery image'} 
                                                    loading="lazy"
                                                    onError={(e) => {
                                                        console.error('Image failed to load:', mediaUrl);
                                                        e.target.onerror = null;
                                                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'400\' height=\'300\' viewBox=\'0 0 400 300\'%3E%3Crect width=\'400\' height=\'300\' fill=\'%23f5f5f5\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' dy=\'.3em\' fill=\'%23999\' font-family=\'Arial\' font-size=\'16\'%3EImage not available%3C/text%3E%3C/svg%3E';
                                                    }}
                                                />
                                            )}
                                            <div className="gallery-item-overlay">
                                                <div className="overlay-content">
                                                    <div className="category-badge" style={{ backgroundColor: categoryColor }}>
                                                        <i className={categoryObj?.icon || 'fas fa-camera'}></i>
                                                    </div>
                                                    <span className="category-name">{categoryObj?.name || photo.category || 'Event'}</span>
                                                    <div className="view-btn">
                                                        <i className="fas fa-expand"></i>
                                                    </div>
                                                </div>
                                            </div>
                                            {mediaType === 'video' && (
                                                <div className="video-indicator">
                                                    <i className="fas fa-play"></i>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="no-images">
                            <div className="no-images-icon">
                                <i className="fas fa-camera-retro"></i>
                            </div>
                            {isSearching ? (
                                <>
                                    <h3>No results found</h3>
                                    <p>We couldn't find any photos for "<strong>{searchTerm}</strong>"</p>
                                    <button className="clear-search-btn" onClick={clearSearch}>
                                        Clear Search
                                    </button>
                                </>
                            ) : (
                                <>
                                    <h3>No photos yet</h3>
                                    <p>This category doesn't have any photos at the moment</p>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Stats Section */}
                {!isSearching && displayPhotos.length > 0 && (
                    <div className="gallery-stats">
                        <div className="stat-item">
                            <span className="stat-value">{displayPhotos.length}</span>
                            <span className="stat-label">Showing</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <span className="stat-value">{photos.length}</span>
                            <span className="stat-label">Total</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <span className="stat-value">
                                {new Set(photos.map(p => p.category)).size}
                            </span>
                            <span className="stat-label">Categories</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Photo Viewer Modal */}
            {selectedImage !== null && displayPhotos[selectedImage] && (
                <div className="photo-viewer-modal active" onClick={closeViewer}>
                    <div className="viewer-content" onClick={e => e.stopPropagation()}>
                        <button className="close-viewer" onClick={closeViewer}>
                            <i className="fas fa-times"></i>
                        </button>
                        
                        <button 
                            className="viewer-nav prev" 
                            onClick={() => changePhoto(-1)}
                            disabled={selectedImage === 0}
                        >
                            <i className="fas fa-chevron-left"></i>
                        </button>
                        
                        <div className="viewer-media-container">
                            {getMediaType(displayPhotos[selectedImage]) === 'video' ? (
                                <video 
                                    key={selectedImage}
                                    src={getMediaUrl(displayPhotos[selectedImage])} 
                                    controls 
                                    autoPlay
                                    onError={(e) => {
                                        console.error('Viewer video failed to load');
                                        e.target.style.display = 'none';
                                        e.target.parentElement.innerHTML += '<div class="error-placeholder"><i class="fas fa-exclamation-circle"></i><p>Video not available</p></div>';
                                    }}
                                />
                            ) : (
                                <img 
                                    key={selectedImage}
                                    src={getMediaUrl(displayPhotos[selectedImage])} 
                                    alt="Viewer"
                                    onError={(e) => {
                                        console.error('Viewer image failed to load');
                                        e.target.onerror = null;
                                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'800\' height=\'600\' viewBox=\'0 0 800 600\'%3E%3Crect width=\'800\' height=\'600\' fill=\'%23333\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' dy=\'.3em\' fill=\'%23fff\' font-family=\'Arial\' font-size=\'24\'%3EImage not available%3C/text%3E%3C/svg%3E';
                                    }}
                                />
                            )}
                        </div>
                        
                        <button 
                            className="viewer-nav next" 
                            onClick={() => changePhoto(1)}
                            disabled={selectedImage === displayPhotos.length - 1}
                        >
                            <i className="fas fa-chevron-right"></i>
                        </button>
                        
                        <div className="viewer-info">
                            <div className="viewer-counter">
                                <span className="current">{selectedImage + 1}</span>
                                <span className="separator">/</span>
                                <span className="total">{displayPhotos.length}</span>
                            </div>
                            <div className="viewer-category">
                                <i className={categories.find(c => c.id === displayPhotos[selectedImage].category)?.icon || 'fas fa-camera'}></i>
                                <span>{categories.find(c => c.id === displayPhotos[selectedImage].category)?.name || 'Event'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Gallery;