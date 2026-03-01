

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPricing from './AdminPricing';
import axios from 'axios';
import './AdminPanel.css';

const AdminPanel = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState('gallery');
    const [mediaItems, setMediaItems] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [filePreviews, setFilePreviews] = useState([]);
    const [category, setCategory] = useState('Weddings');
    const [mediaType, setMediaType] = useState('image');
    const [message, setMessage] = useState({ text: '', type: '' });
    
    // Edit state
    const [editingItem, setEditingItem] = useState(null);
    const [editCategory, setEditCategory] = useState('');
    const [editMediaType, setEditMediaType] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    
    const navigate = useNavigate();

    // ALL CATEGORIES INCLUDING FESTIVAL SECTION
    const categories = [
        // Wedding Category
        { id: 'Weddings', name: 'Weddings', icon: 'fas fa-heart' },
        { id: 'Engagement', name: 'Engagement', icon: 'fas fa-ring' },
        { id: 'Sangeet', name: 'Sangeet Night', icon: 'fas fa-music' },
        { id: 'Haldi', name: 'Haldi & Mehendi', icon: 'fas fa-hand-holding-heart' },
        
        // Corporate Category
        { id: 'Corporate', name: 'Corporate Events', icon: 'fas fa-briefcase' },
        { id: 'Corporate Gala', name: 'Corporate Gala', icon: 'fas fa-glass-cheers' },
        { id: 'Team Building', name: 'Team Building', icon: 'fas fa-users' },
        { id: 'Product Launch', name: 'Product Launch', icon: 'fas fa-rocket' },
        { id: 'Award Ceremony', name: 'Award Ceremony', icon: 'fas fa-trophy' },
        
        // Birthday Category
        { id: 'Birthday', name: 'Birthday Parties', icon: 'fas fa-birthday-cake' },
        { id: 'Sweet 16', name: 'Sweet 16', icon: 'fas fa-crown' },
        { id: 'First Birthday', name: 'First Birthday', icon: 'fas fa-baby' },
        
        // Baby Category
        { id: 'Baby Shower', name: 'Baby Showers', icon: 'fas fa-child' },
        { id: 'Gender Reveal', name: 'Gender Reveal', icon: 'fas fa-gift' },
        { id: 'Naming Ceremony', name: 'Naming Ceremony', icon: 'fas fa-pray' },
        
        // Anniversary Category
        { id: 'Anniversary', name: 'Anniversary', icon: 'fas fa-heart' },
        
        // 🎉 FESTIVAL SECTION - MAIN CATEGORY
        { id: 'Festival', name: '🎊 Festival Celebrations', icon: 'fas fa-festival' },
        
        // 🪔 FESTIVAL SUBCATEGORIES
        { id: 'Diwali', name: '🪔 Diwali Celebrations', icon: 'fas fa-festival' },
        { id: 'Holi', name: '🌈 Holi Party', icon: 'fas fa-paint-brush' },
        { id: 'Christmas', name: '🎄 Christmas Party', icon: 'fas fa-tree' },
        { id: 'New Year', name: '🎉 New Year Eve', icon: 'fas fa-glass-cheers' },
        { id: 'Eid', name: '🌙 Eid Celebration', icon: 'fas fa-moon' },
        { id: 'Navratri', name: '🥁 Navratri Garba', icon: 'fas fa-drum' },
        { id: 'Ganesh Chaturthi', name: '🐘 Ganesh Chaturthi', icon: 'fas fa-festival' },
        { id: 'Durga Puja', name: '🦁 Durga Puja', icon: 'fas fa-festival' },
        { id: 'Ramadan', name: '🌙 Ramadan', icon: 'fas fa-moon' },
        { id: 'Raksha Bandhan', name: '🎀 Raksha Bandhan', icon: 'fas fa-hand-holding-heart' },
        { id: 'Lohri', name: '🔥 Lohri', icon: 'fas fa-fire' },
        { id: 'Pongal', name: '🌾 Pongal', icon: 'fas fa-festival' },
        { id: 'Onam', name: '🌺 Onam', icon: 'fas fa-festival' },
        { id: 'Baisakhi', name: '🌾 Baisakhi', icon: 'fas fa-festival' },
        { id: 'Gudi Padwa', name: '🚩 Gudi Padwa', icon: 'fas fa-festival' },
        { id: 'Ugadi', name: '🌼 Ugadi', icon: 'fas fa-festival' },
        { id: 'Makar Sankranti', name: '🪁 Makar Sankranti', icon: 'fas fa-festival' },
        { id: 'Rath Yatra', name: '🛕 Rath Yatra', icon: 'fas fa-festival' },
        { id: 'Janmashtami', name: '🎵 Janmashtami', icon: 'fas fa-festival' },
        { id: 'Maha Shivratri', name: '🔱 Maha Shivratri', icon: 'fas fa-festival' }
    ];

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            handleLogout();
        }
        fetchData();
    }, [activeTab]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminAuthenticated');
        if (onLogout) onLogout();
        navigate('/admin/login');
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            if (activeTab === 'gallery') {
                const response = await axios.get('http://localhost:5000/api/gallery');
                console.log('Fetched gallery data:', response.data);
                setMediaItems(response.data);
            } else if (activeTab === 'testimonials') {
                const response = await axios.get('http://localhost:5000/api/testimonials', config);
                setTestimonials(response.data);
            } else if (activeTab === 'contacts') {
                const response = await axios.get('http://localhost:5000/api/contact', config);
                setContacts(response.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            if (error.response?.status === 401) {
                handleLogout();
            }
        }
        setLoading(false);
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(files);
        
        const previews = files.map(file => ({
            url: URL.createObjectURL(file),
            type: file.type.startsWith('video/') ? 'video' : 'image',
            name: file.name,
            size: (file.size / (1024 * 1024)).toFixed(2)
        }));
        setFilePreviews(previews);
    };

    const removeFile = (index) => {
        const newFiles = [...selectedFiles];
        const newPreviews = [...filePreviews];
        
        URL.revokeObjectURL(newPreviews[index].url);
        
        newFiles.splice(index, 1);
        newPreviews.splice(index, 1);
        
        setSelectedFiles(newFiles);
        setFilePreviews(newPreviews);
        
        document.getElementById('fileInput').value = '';
    };

    const clearPreviews = () => {
        filePreviews.forEach(preview => URL.revokeObjectURL(preview.url));
        setSelectedFiles([]);
        setFilePreviews([]);
        document.getElementById('fileInput').value = '';
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            setMessage({ text: 'Please select files', type: 'error' });
            return;
        }

        setUploading(true);
        const formData = new FormData();
        selectedFiles.forEach(file => {
            formData.append('media', file);
        });
        formData.append('category', category);
        formData.append('mediaType', mediaType);

        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.post('http://localhost:5000/api/gallery/upload', formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setMessage({ text: `${response.data.count} files uploaded successfully!`, type: 'success' });
                clearPreviews();
                fetchData();
                setTimeout(() => setMessage({ text: '', type: '' }), 3000);
            }
        } catch (error) {
            setMessage({ text: 'Upload failed', type: 'error' });
        }
        setUploading(false);
    };

    // ✨ NEW: Handle Edit Click
    const handleEditClick = (item) => {
        setEditingItem(item);
        setEditCategory(item.category);
        setEditMediaType(item.mediaType || 'image');
        setShowEditModal(true);
    };

    // ✨ NEW: Handle Update Item
    const handleUpdateItem = async () => {
        if (!editingItem) return;

        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.put(
                `http://localhost:5000/api/gallery/${editingItem._id}`,
                {
                    category: editCategory,
                    mediaType: editMediaType
                },
                {
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                setMessage({ text: 'Item updated successfully!', type: 'success' });
                setShowEditModal(false);
                setEditingItem(null);
                fetchData(); // Refresh the list
                setTimeout(() => setMessage({ text: '', type: '' }), 3000);
            }
        } catch (error) {
            console.error('Update error:', error);
            setMessage({ text: 'Update failed: ' + (error.response?.data?.error || error.message), type: 'error' });
        }
    };

    const handleDeletePhoto = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                const token = localStorage.getItem('adminToken');
                await axios.delete(`http://localhost:5000/api/gallery/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMessage({ text: 'Item deleted successfully', type: 'success' });
                fetchData();
                setTimeout(() => setMessage({ text: '', type: '' }), 3000);
            } catch (error) {
                setMessage({ text: 'Delete failed', type: 'error' });
            }
        }
    };

    const handleApproveTestimonial = async (id) => {
        try {
            const token = localStorage.getItem('adminToken');
            await axios.put(`http://localhost:5000/api/testimonials/${id}/approve`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage({ text: 'Testimonial approved', type: 'success' });
            fetchData();
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        } catch (error) {
            setMessage({ text: 'Failed to approve', type: 'error' });
        }
    };

    const handleDeleteTestimonial = async (id) => {
        if (window.confirm('Are you sure you want to delete this testimonial?')) {
            try {
                const token = localStorage.getItem('adminToken');
                await axios.delete(`http://localhost:5000/api/testimonials/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMessage({ text: 'Testimonial deleted', type: 'success' });
                fetchData();
                setTimeout(() => setMessage({ text: '', type: '' }), 3000);
            } catch (error) {
                setMessage({ text: 'Delete failed', type: 'error' });
            }
        }
    };

    const handleDeleteContact = async (id) => {
        if (window.confirm('Are you sure you want to delete this inquiry?')) {
            try {
                const token = localStorage.getItem('adminToken');
                await axios.delete(`http://localhost:5000/api/contact/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMessage({ text: 'Inquiry deleted', type: 'success' });
                fetchData();
                setTimeout(() => setMessage({ text: '', type: '' }), 3000);
            } catch (error) {
                setMessage({ text: 'Delete failed', type: 'error' });
            }
        }
    };

    const getMediaUrl = (item) => {
        return item.mediaUrl || item.imageUrl || '';
    };

    if (loading) {
        return (
            <div className="admin-loading">
                <div className="loading-spinner"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="admin-panel-wrapper">
            <div className="admin-panel">
                {/* Header Section */}
                <header className="admin-header">
                    <div className="admin-header-container">
                        <div className="admin-header-top">
                            <h1 className="admin-title">
                                <i className="fas fa-crown"></i>
                                Admin Panel
                            </h1>
                            <button onClick={handleLogout} className="admin-logout-btn">
                                <i className="fas fa-sign-out-alt"></i>
                                Logout
                            </button>
                        </div>
                        
                        <nav className="admin-nav">
                            <button 
                                className={`admin-nav-item ${activeTab === 'gallery' ? 'active' : ''}`}
                                onClick={() => setActiveTab('gallery')}
                            >
                                <i className="fas fa-images"></i>
                                <span>Gallery</span>
                            </button>
                            <button 
                                className={`admin-nav-item ${activeTab === 'testimonials' ? 'active' : ''}`}
                                onClick={() => setActiveTab('testimonials')}
                            >
                                <i className="fas fa-star"></i>
                                <span>Testimonials</span>
                            </button>
                            <button 
                                className={`admin-nav-item ${activeTab === 'contacts' ? 'active' : ''}`}
                                onClick={() => setActiveTab('contacts')}
                            >
                                <i className="fas fa-envelope"></i>
                                <span>Inquiries</span>
                            </button>
                            <button 
                                className={`admin-nav-item ${activeTab === 'pricing' ? 'active' : ''}`}
                                onClick={() => setActiveTab('pricing')}
                            >
                                <i className="fas fa-tag"></i>
                                <span>Pricing</span>
                            </button>
                        </nav>
                    </div>
                </header>

                {/* Message Alert */}
                {message.text && (
                    <div className={`admin-alert admin-alert-${message.type}`}>
                        <i className={`fas fa-${message.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i>
                        {message.text}
                    </div>
                )}

                {/* Main Content */}
                <main className="admin-main">
                    <div className="admin-container">
                        {/* Gallery Tab */}
                        {activeTab === 'gallery' && (
                            <div className="admin-tab-content">
                                {/* Upload Section */}
                                <section className="content-section">
                                    <h2 className="section-heading">
                                        <i className="fas fa-cloud-upload-alt"></i>
                                        Upload New Media
                                    </h2>
                                    
                                    <div className="upload-section">
                                        <div className="media-type-group">
                                            <label className={`media-type-option ${mediaType === 'image' ? 'active' : ''}`}>
                                                <input 
                                                    type="radio" 
                                                    name="mediaType" 
                                                    value="image" 
                                                    checked={mediaType === 'image'}
                                                    onChange={(e) => setMediaType(e.target.value)}
                                                />
                                                <i className="fas fa-image"></i>
                                                <span>Images</span>
                                            </label>
                                            <label className={`media-type-option ${mediaType === 'video' ? 'active' : ''}`}>
                                                <input 
                                                    type="radio" 
                                                    name="mediaType" 
                                                    value="video" 
                                                    checked={mediaType === 'video'}
                                                    onChange={(e) => setMediaType(e.target.value)}
                                                />
                                                <i className="fas fa-video"></i>
                                                <span>Videos</span>
                                            </label>
                                        </div>

                                        <div className="file-upload-area">
                                            <input 
                                                type="file" 
                                                id="fileInput" 
                                                multiple 
                                                accept={mediaType === 'image' ? "image/*" : "video/*"}
                                                onChange={handleFileChange}
                                                className="file-input"
                                            />
                                            <label htmlFor="fileInput" className="file-input-label">
                                                <i className="fas fa-plus-circle"></i>
                                                <span className="file-input-title">
                                                    Choose {mediaType === 'image' ? 'Images' : 'Videos'}
                                                </span>
                                                <span className="file-input-hint">
                                                    Click to browse or drag & drop (Multiple files allowed)
                                                </span>
                                            </label>
                                        </div>

                                        <div className="upload-controls">
                                            <select 
                                                value={category} 
                                                onChange={(e) => setCategory(e.target.value)} 
                                                className="category-select"
                                            >
                                                {categories.map(cat => (
                                                    <option key={cat.id} value={cat.id}>
                                                        {cat.name}
                                                    </option>
                                                ))}
                                            </select>
                                            
                                            <button 
                                                onClick={handleUpload} 
                                                disabled={uploading || selectedFiles.length === 0}
                                                className="upload-button"
                                            >
                                                {uploading ? (
                                                    <>
                                                        <i className="fas fa-spinner fa-spin"></i>
                                                        Uploading...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="fas fa-upload"></i>
                                                        Upload {selectedFiles.length} File(s)
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                        {filePreviews.length > 0 && (
                                            <div className="preview-section">
                                                <div className="preview-header">
                                                    <h3 className="preview-title">
                                                        <i className="fas fa-eye"></i>
                                                        Selected Files ({filePreviews.length})
                                                    </h3>
                                                    <button onClick={clearPreviews} className="clear-all-btn">
                                                        <i className="fas fa-times"></i>
                                                        Clear All
                                                    </button>
                                                </div>
                                                <div className="preview-grid">
                                                    {filePreviews.map((preview, index) => (
                                                        <div className="preview-card" key={index}>
                                                            <div className="preview-media">
                                                                {preview.type === 'image' ? (
                                                                    <img src={preview.url} alt={`Preview ${index + 1}`} />
                                                                ) : (
                                                                    <video src={preview.url} controls />
                                                                )}
                                                            </div>
                                                            <div className="preview-details">
                                                                <p className="preview-name">{preview.name}</p>
                                                                <p className="preview-size">{preview.size} MB</p>
                                                            </div>
                                                            <button 
                                                                className="preview-remove"
                                                                onClick={() => removeFile(index)}
                                                            >
                                                                <i className="fas fa-times"></i>
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </section>

                                <section className="content-section">
                                    <h2 className="section-heading">
                                        <i className="fas fa-images"></i>
                                        Uploaded Media ({mediaItems.length})
                                    </h2>
                                    
                                    {mediaItems.length > 0 ? (
                                        <div className="media-grid">
                                            {mediaItems.map(item => {
                                                const categoryObj = categories.find(c => c.id === item.category);
                                                const mediaUrl = getMediaUrl(item);
                                                
                                                return (
                                                    <div className="media-card" key={item._id}>
                                                        <div className="media-preview">
                                                            {item.mediaType === 'video' ? (
                                                                <video 
                                                                    src={mediaUrl} 
                                                                    controls
                                                                    onError={(e) => {
                                                                        console.error('Video failed to load:', mediaUrl);
                                                                        e.target.style.display = 'none';
                                                                        e.target.parentElement.innerHTML += '<div class="error-placeholder">Video not available</div>';
                                                                    }}
                                                                />
                                                            ) : (
                                                                <img 
                                                                    src={mediaUrl} 
                                                                    alt={item.category}
                                                                    onError={(e) => {
                                                                        console.error('Image failed to load:', mediaUrl);
                                                                        e.target.onerror = null;
                                                                        e.target.src = 'https://via.placeholder.com/300x300?text=Image+Not+Available';
                                                                    }}
                                                                />
                                                            )}
                                                        </div>
                                                        <div className="media-info">
                                                            <div className="media-tags">
                                                                <span className="tag category-tag">
                                                                    <i className={categoryObj?.icon || 'fas fa-tag'}></i>
                                                                    {categoryObj?.name || item.category}
                                                                </span>
                                                                <span className="tag type-tag">
                                                                    <i className={`fas fa-${item.mediaType === 'video' ? 'video' : 'image'}`}></i>
                                                                </span>
                                                            </div>
                                                            <div className="media-actions">
                                                                {/* ✨ NEW: Edit Button */}
                                                                <button 
                                                                    onClick={() => handleEditClick(item)}
                                                                    className="media-edit-btn"
                                                                    title="Edit"
                                                                >
                                                                    <i className="fas fa-edit"></i>
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleDeletePhoto(item._id)}
                                                                    className="media-delete-btn"
                                                                    title="Delete"
                                                                >
                                                                    <i className="fas fa-trash"></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="empty-state">
                                            <i className="fas fa-images"></i>
                                            <p>No media uploaded yet</p>
                                        </div>
                                    )}
                                </section>
                            </div>
                        )}

                        {/* Testimonials Tab */}
                        {activeTab === 'testimonials' && (
                            <div className="admin-tab-content">
                                <section className="content-section">
                                    <div className="section-header">
                                        <h2 className="section-heading">
                                            <i className="fas fa-star"></i>
                                            Manage Testimonials
                                        </h2>
                                        <div className="stats-group">
                                            <span className="stat-badge approved-stat">
                                                <i className="fas fa-check-circle"></i>
                                                Approved: {testimonials.filter(t => t.approved).length}
                                            </span>
                                            <span className="stat-badge pending-stat">
                                                <i className="fas fa-clock"></i>
                                                Pending: {testimonials.filter(t => !t.approved).length}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="testimonials-list">
                                    {testimonials.length > 0 ? (
    testimonials.map(t => (
        <div className={`testimonial-card ${t.approved ? 'card-approved' : 'card-pending'}`} key={t._id}>
            <div className="testimonial-header">
                <div className="testimonial-user">
                    <div className="user-avatar">
                        {t.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="user-info">
                        <h3 className="user-name">{t.name}</h3>
                        <p className="user-contact">
                            <i className="fas fa-phone-alt"></i>
                            {t.contact}
                        </p>
                    </div>
                </div>
                <span className={`status-badge ${t.approved ? 'status-approved' : 'status-pending'}`}>
                    {t.approved ? '✓ Approved' : '⏳ Pending'}
                </span>
            </div>
            
            <p className="testimonial-text">"{t.message}"</p>
            
            {/* Fixed rating display */}
            <div className="testimonial-rating">
                {[...Array(5)].map((_, i) => {
                    const rating = Number(t.rating); // Convert to number
                    return (
                        <i 
                            key={i} 
                            className={`fas fa-star ${i < rating ? 'star-filled' : ''}`}
                            style={{ 
                                color: i < rating ? '#FFD700' : '#e0e0e0',
                                marginRight: '2px'
                            }}
                        ></i>
                    );
                })}
                <span className="rating-value">({t.rating}/5)</span>
            </div>
            
            <div className="testimonial-footer">
                <span className="testimonial-date">
                    <i className="far fa-calendar-alt"></i>
                    {new Date(t.createdAt).toLocaleDateString()}
                </span>
                <div className="testimonial-actions">
                    {!t.approved && (
                        <button 
                            onClick={() => handleApproveTestimonial(t._id)}
                            className="action-btn approve-btn"
                        >
                            <i className="fas fa-check"></i>
                            Approve
                        </button>
                    )}
                    <button 
                        onClick={() => handleDeleteTestimonial(t._id)}
                        className="action-btn delete-btn"
                    >
                        <i className="fas fa-trash"></i>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    ))
) : (
    <div className="empty-state">
        <i className="fas fa-star"></i>
        <p>No testimonials found</p>
    </div>
)}
                                    </div>
                                </section>
                            </div>
                        )}

                        {/* Contacts Tab */}
                        {activeTab === 'contacts' && (
                            <div className="admin-tab-content">
                                <section className="content-section">
                                    <div className="section-header">
                                        <h2 className="section-heading">
                                            <i className="fas fa-envelope"></i>
                                            Contact Inquiries
                                        </h2>
                                        <span className="total-badge">{contacts.length} Total</span>
                                    </div>
                                    
                                    <div className="contacts-list">
                                        {contacts.length > 0 ? (
                                            contacts.map(c => (
                                                <div className="contact-card" key={c._id}>
                                                    <div className="contact-header">
                                                        <div className="contact-user">
                                                            <div className="user-avatar">
                                                                {c.name.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div className="user-info">
                                                                <h3 className="user-name">{c.name}</h3>
                                                                <p className="user-email">{c.email}</p>
                                                            </div>
                                                        </div>
                                                        <span className="contact-date">
                                                            <i className="far fa-calendar-alt"></i>
                                                            {new Date(c.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="contact-details">
                                                        <div className="detail-row">
                                                            <i className="fas fa-phone-alt"></i>
                                                            <span>{c.phone}</span>
                                                        </div>
                                                        {c.eventType && (
                                                            <div className="detail-row">
                                                                <i className="fas fa-tag"></i>
                                                                <span>{c.eventType}</span>
                                                            </div>
                                                        )}
                                                        {c.date && (
                                                            <div className="detail-row">
                                                                <i className="fas fa-calendar-check"></i>
                                                                <span>{new Date(c.date).toLocaleDateString()}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    
                                                    <div className="contact-message">
                                                        <p>{c.message}</p>
                                                    </div>
                                                    
                                                    <div className="contact-actions">
                                                        <a href={`mailto:${c.email}`} className="action-btn reply-btn">
                                                            <i className="fas fa-reply"></i>
                                                            Reply
                                                        </a>
                                                        <button 
                                                            onClick={() => handleDeleteContact(c._id)}
                                                            className="action-btn delete-btn"
                                                        >
                                                            <i className="fas fa-trash"></i>
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="empty-state">
                                                <i className="fas fa-envelope-open"></i>
                                                <p>No contact inquiries</p>
                                            </div>
                                        )}
                                    </div>
                                </section>
                            </div>
                        )}

                      {/* Pricing Tab */}
{activeTab === 'pricing' && (
    <div className="admin-tab-content">
        <AdminPricing 
            onMessage={(msg) => setMessage(msg)}
            fetchData={fetchData}
        />
    </div>
)}
                    </div>
                </main>
            </div>

            {/* ✨ NEW: Edit Modal */}
           {/* Edit Modal */}
{showEditModal && editingItem && (
    <div className="edit-modal-overlay" onClick={() => setShowEditModal(false)}>
        <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="edit-modal-header">
                <h3>
                    <i className="fas fa-edit"></i>
                    Edit Media Details
                </h3>
                <button className="edit-modal-close" onClick={() => setShowEditModal(false)}>
                    <i className="fas fa-times"></i>
                </button>
            </div>

            <div className="edit-modal-body">
                <div className="edit-media-preview">
                    {editingItem.mediaType === 'video' ? (
                        <video src={getMediaUrl(editingItem)} controls />
                    ) : (
                        <img src={getMediaUrl(editingItem)} alt="Preview" />
                    )}
                </div>

                <div className="edit-form">
                    {/* Current Category Info */}
                    <div className="form-group">
                        <label>
                            <i className="fas fa-info-circle"></i>
                            Current Category
                        </label>
                        <div className="current-category">
                            {categories.find(c => c.id === editingItem.category)?.name || editingItem.category}
                        </div>
                    </div>

                    {/* Category Selection */}
                    <div className="form-group">
                        <label>
                            <i className="fas fa-tag"></i>
                            Change Category
                        </label>
                        <select 
                            value={editCategory} 
                            onChange={(e) => setEditCategory(e.target.value)}
                            className="form-control"
                        >
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        <small className="form-hint">Select a new category for this media</small>
                    </div>

                    {/* Media Type Info */}
                    <div className="form-group">
                        <label>
                            <i className="fas fa-film"></i>
                            Media Type
                        </label>
                        <div className="media-type-info">
                            {editingItem.mediaType === 'video' ? (
                                <>
                                    <i className="fas fa-video" style={{ color: '#C5A059' }}></i>
                                    <span>Video File</span>
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-image" style={{ color: '#C5A059' }}></i>
                                    <span>Image File</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* File Info */}
                    <div className="form-group">
                        <label>
                            <i className="fas fa-file"></i>
                            File Information
                        </label>
                        <div className="file-info">
                            <div className="info-row">
                                <span className="info-label">Filename:</span>
                                <span className="info-value">
                                    {getMediaUrl(editingItem).split('/').pop() || 'N/A'}
                                </span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Uploaded:</span>
                                <span className="info-value">
                                    {editingItem.createdAt ? new Date(editingItem.createdAt).toLocaleDateString() : 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="edit-modal-footer">
                <button className="edit-modal-cancel" onClick={() => setShowEditModal(false)}>
                    <i className="fas fa-times"></i>
                    Cancel
                </button>
                <button className="edit-modal-save" onClick={handleUpdateItem}>
                    <i className="fas fa-save"></i>
                    Save Changes
                </button>
            </div>
        </div>
    </div>
)}
        </div>
    );
};

export default AdminPanel;