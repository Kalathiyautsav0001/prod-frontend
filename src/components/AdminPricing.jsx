// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './AdminPricing.css';

// const AdminPricing = () => {
//     const [plans, setPlans] = useState([]);
//     const [decorationItems, setDecorationItems] = useState([]);
//     const [activeTab, setActiveTab] = useState('plans');
//     const [loading, setLoading] = useState(true);
//     const [showPlanForm, setShowPlanForm] = useState(false);
//     const [showItemForm, setShowItemForm] = useState(false);
//     const [editingPlan, setEditingPlan] = useState(null);
//     const [editingItem, setEditingItem] = useState(null);
//     const [message, setMessage] = useState({ text: '', type: '' });

//     // Plan Form State
//     const [planForm, setPlanForm] = useState({
//         name: 'Basic',
//         category: 'Wedding',
//         price: '',
//         duration: '4 Hours',
//         guests: 'Up to 50',
//         features: [''],
//         isActive: true,
//         popular: false,
//         image: ''
//     });

//     // Item Form State
//     const [itemForm, setItemForm] = useState({
//         name: '',
//         category: 'Flowers',
//         price: '',
//         priceType: 'per item',
//         description: '',
//         image: '',
//         available: true,
//         stock: 0,
//         tags: []
//     });

//     const [tagInput, setTagInput] = useState('');

//     useEffect(() => {
//         fetchData();
//     }, []);

//     const fetchData = async () => {
//         setLoading(true);
//         try {
//             const token = localStorage.getItem('adminToken');
//             const config = { headers: { Authorization: `Bearer ${token}` } };

//             const [plansRes, itemsRes] = await Promise.all([
//                 axios.get('http://localhost:5000/api/pricing/admin', config),
//                 axios.get('http://localhost:5000/api/decoration/admin', config)
//             ]);
            
//             setPlans(plansRes.data);
//             setDecorationItems(itemsRes.data);
//         } catch (error) {
//             console.error('Error fetching data:', error);
//             setMessage({ text: 'Failed to fetch data', type: 'error' });
//             setTimeout(() => setMessage({ text: '', type: '' }), 3000);
//         }
//         setLoading(false);
//     };

//     // Helper Functions - using setMessage instead of showMessage
//     const showMessage = (text, type) => {
//         setMessage({ text, type });
//         setTimeout(() => setMessage({ text: '', type: '' }), 3000);
//     };

//     // Plan Functions
//     const handlePlanInputChange = (e) => {
//         const { name, value, type, checked } = e.target;
//         setPlanForm({
//             ...planForm,
//             [name]: type === 'checkbox' ? checked : value
//         });
//     };

//     const handleFeatureChange = (index, value) => {
//         const newFeatures = [...planForm.features];
//         newFeatures[index] = value;
//         setPlanForm({ ...planForm, features: newFeatures });
//     };

//     const addFeature = () => {
//         setPlanForm({
//             ...planForm,
//             features: [...planForm.features, '']
//         });
//     };

//     const removeFeature = (index) => {
//         const newFeatures = planForm.features.filter((_, i) => i !== index);
//         setPlanForm({ ...planForm, features: newFeatures });
//     };

//     const handlePlanSubmit = async (e) => {
//         e.preventDefault();
        
//         // Validate form data
//         if (!planForm.price) {
//             showMessage('Please enter price', 'error');
//             return;
//         }

//         if (planForm.features.length === 0 || !planForm.features[0]) {
//             showMessage('Please add at least one feature', 'error');
//             return;
//         }

//         try {
//             const token = localStorage.getItem('adminToken');
//             if (!token) {
//                 showMessage('Please login again', 'error');
//                 return;
//             }

//             const config = { 
//                 headers: { 
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json'
//                 } 
//             };

//             // Clean up the data before sending
//             const planData = {
//                 name: planForm.name,
//                 category: planForm.category,
//                 price: Number(planForm.price),
//                 duration: planForm.duration,
//                 guests: planForm.guests,
//                 features: planForm.features.filter(f => f.trim() !== ''),
//                 isActive: planForm.isActive,
//                 popular: planForm.popular,
//                 image: planForm.image || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop'
//             };

//             console.log('Sending plan data:', planData);

//             if (editingPlan) {
//                 await axios.put(
//                     `http://localhost:5000/api/pricing/${editingPlan._id}`, 
//                     planData, 
//                     config
//                 );
//                 showMessage('Plan updated successfully!', 'success');
//             } else {
//                 await axios.post(
//                     'http://localhost:5000/api/pricing', 
//                     planData, 
//                     config
//                 );
//                 showMessage('Plan created successfully!', 'success');
//             }

//             setShowPlanForm(false);
//             setEditingPlan(null);
//             resetPlanForm();
//             fetchData();
            
//         } catch (error) {
//             console.error('Detailed error:', error);
//             console.error('Error response:', error.response?.data);
            
//             if (error.response?.data?.error) {
//                 showMessage(`Failed: ${error.response.data.error}`, 'error');
//             } else if (error.message) {
//                 showMessage(`Failed: ${error.message}`, 'error');
//             } else {
//                 showMessage('Operation failed', 'error');
//             }
//         }
//     };

//     const handleEditPlan = (plan) => {
//         setEditingPlan(plan);
//         setPlanForm({
//             name: plan.name,
//             category: plan.category,
//             price: plan.price,
//             duration: plan.duration,
//             guests: plan.guests,
//             features: plan.features,
//             isActive: plan.isActive,
//             popular: plan.popular,
//             image: plan.image
//         });
//         setShowPlanForm(true);
//     };

//     const handleDeletePlan = async (id) => {
//         if (window.confirm('Are you sure you want to delete this plan?')) {
//             try {
//                 const token = localStorage.getItem('adminToken');
//                 await axios.delete(`http://localhost:5000/api/pricing/${id}`, {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });
//                 showMessage('Plan deleted successfully!', 'success');
//                 fetchData();
//             } catch (error) {
//                 showMessage('Delete failed', 'error');
//             }
//         }
//     };

//     const resetPlanForm = () => {
//         setPlanForm({
//             name: 'Basic',
//             category: 'Wedding',
//             price: '',
//             duration: '4 Hours',
//             guests: 'Up to 50',
//             features: [''],
//             isActive: true,
//             popular: false,
//             image: ''
//         });
//     };

//     // Item Functions
//     const handleItemInputChange = (e) => {
//         const { name, value, type, checked } = e.target;
//         setItemForm({
//             ...itemForm,
//             [name]: type === 'checkbox' ? checked : value
//         });
//     };

//     const handleAddTag = () => {
//         if (tagInput.trim()) {
//             setItemForm({
//                 ...itemForm,
//                 tags: [...itemForm.tags, tagInput.trim()]
//             });
//             setTagInput('');
//         }
//     };

//     const handleRemoveTag = (index) => {
//         const newTags = itemForm.tags.filter((_, i) => i !== index);
//         setItemForm({ ...itemForm, tags: newTags });
//     };

//     const handleItemSubmit = async (e) => {
//         e.preventDefault();
        
//         if (!itemForm.name || !itemForm.price || !itemForm.description || !itemForm.image) {
//             showMessage('Please fill in all required fields', 'error');
//             return;
//         }
    
//         try {
//             const token = localStorage.getItem('adminToken');
//             if (!token) {
//                 showMessage('Please login again', 'error');
//                 return;
//             }
    
//             const config = { 
//                 headers: { 
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json'
//                 } 
//             };
    
//             if (editingItem) {
//                 await axios.put(
//                     `http://localhost:5000/api/decoration/${editingItem._id}`, 
//                     itemForm, 
//                     config
//                 );
//                 showMessage('Item updated successfully!', 'success');
//             } else {
//                 await axios.post(
//                     'http://localhost:5000/api/decoration', 
//                     itemForm, 
//                     config
//                 );
//                 showMessage('Item created successfully!', 'success');
//             }
    
//             setShowItemForm(false);
//             setEditingItem(null);
//             resetItemForm();
//             fetchData();
            
//         } catch (error) {
//             console.error('Detailed error:', error);
//             if (error.response?.data?.error) {
//                 showMessage(`Failed: ${error.response.data.error}`, 'error');
//             } else {
//                 showMessage('Operation failed', 'error');
//             }
//         }
//     };

//     const handleEditItem = (item) => {
//         setEditingItem(item);
//         setItemForm({
//             name: item.name,
//             category: item.category,
//             price: item.price,
//             priceType: item.priceType,
//             description: item.description,
//             image: item.image,
//             available: item.available,
//             stock: item.stock,
//             tags: item.tags || []
//         });
//         setShowItemForm(true);
//     };

//     const handleDeleteItem = async (id) => {
//         if (window.confirm('Are you sure you want to delete this item?')) {
//             try {
//                 const token = localStorage.getItem('adminToken');
//                 await axios.delete(`http://localhost:5000/api/decoration/${id}`, {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });
//                 showMessage('Item deleted successfully!', 'success');
//                 fetchData();
//             } catch (error) {
//                 showMessage('Delete failed', 'error');
//             }
//         }
//     };

//     const resetItemForm = () => {
//         setItemForm({
//             name: '',
//             category: 'Flowers',
//             price: '',
//             priceType: 'per item',
//             description: '',
//             image: '',
//             available: true,
//             stock: 0,
//             tags: []
//         });
//         setTagInput('');
//     };

//     if (loading) {
//         return (
//             <div className="admin-loading">
//                 <div className="loading-spinner"></div>
//                 <p>Loading pricing data...</p>
//             </div>
//         );
//     }

//     return (
//         <div className="admin-pricing">
//             <div className="pricing-header">
//                 <h2><i className="fas fa-tag"></i> Pricing Management</h2>
//                 <div className="pricing-tabs">
//                     <button 
//                         className={`tab-btn ${activeTab === 'plans' ? 'active' : ''}`}
//                         onClick={() => setActiveTab('plans')}
//                     >
//                         <i className="fas fa-box"></i> Plans
//                     </button>
//                     <button 
//                         className={`tab-btn ${activeTab === 'items' ? 'active' : ''}`}
//                         onClick={() => setActiveTab('items')}
//                     >
//                         <i className="fas fa-gem"></i> Decoration Items
//                     </button>
//                 </div>
//             </div>

//             {message.text && (
//                 <div className={`admin-message ${message.type}`}>
//                     <i className={`fas fa-${message.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i>
//                     {message.text}
//                 </div>
//             )}

//             <div className="pricing-content">
//                 {/* Plans Tab */}
//                 {activeTab === 'plans' && (
//                     <div className="plans-tab">
//                         <div className="section-header">
//                             <h3>Pricing Plans</h3>
//                             <button 
//                                 className="add-btn"
//                                 onClick={() => {
//                                     setEditingPlan(null);
//                                     resetPlanForm();
//                                     setShowPlanForm(true);
//                                 }}
//                             >
//                                 <i className="fas fa-plus"></i> Add New Plan
//                             </button>
//                         </div>

//                         {showPlanForm && (
//                             <div className="form-overlay">
//                                 <div className="form-container">
//                                     <h4>{editingPlan ? 'Edit Plan' : 'Create New Plan'}</h4>
//                                     <form onSubmit={handlePlanSubmit}>
//                                         <div className="form-row">
//                                             <div className="form-group">
//                                                 <label>Plan Name</label>
//                                                 <select name="name" value={planForm.name} onChange={handlePlanInputChange}>
//                                                     <option value="Basic">Basic</option>
//                                                     <option value="Premium">Premium</option>
//                                                     <option value="Luxury">Luxury</option>
//                                                     <option value="Custom">Custom</option>
//                                                 </select>
//                                             </div>
//                                             <div className="form-group">
//                                                 <label>Category</label>
//                                                 <select name="category" value={planForm.category} onChange={handlePlanInputChange}>
//                                                     <option value="Wedding">Wedding</option>
//                                                     <option value="Corporate">Corporate</option>
//                                                     <option value="Birthday">Birthday</option>
//                                                     <option value="Baby Shower">Baby Shower</option>
//                                                     <option value="Festival">Festival</option>
//                                                 </select>
//                                             </div>
//                                         </div>

//                                         <div className="form-row">
//                                             <div className="form-group">
//                                                 <label>Price (₹)</label>
//                                                 <input 
//                                                     type="number" 
//                                                     name="price" 
//                                                     value={planForm.price} 
//                                                     onChange={handlePlanInputChange}
//                                                     required
//                                                 />
//                                             </div>
//                                             <div className="form-group">
//                                                 <label>Duration</label>
//                                                 <select name="duration" value={planForm.duration} onChange={handlePlanInputChange}>
//                                                     <option value="4 Hours">4 Hours</option>
//                                                     <option value="8 Hours">8 Hours</option>
//                                                     <option value="12 Hours">12 Hours</option>
//                                                     <option value="Full Day">Full Day</option>
//                                                 </select>
//                                             </div>
//                                         </div>

//                                         <div className="form-row">
//                                             <div className="form-group">
//                                                 <label>Guests</label>
//                                                 <select name="guests" value={planForm.guests} onChange={handlePlanInputChange}>
//                                                     <option value="Up to 50">Up to 50</option>
//                                                     <option value="50-100">50-100</option>
//                                                     <option value="100-200">100-200</option>
//                                                     <option value="200-500">200-500</option>
//                                                     <option value="500+">500+</option>
//                                                 </select>
//                                             </div>
//                                             <div className="form-group checkbox-group">
//                                                 <label>
//                                                     <input 
//                                                         type="checkbox" 
//                                                         name="popular" 
//                                                         checked={planForm.popular} 
//                                                         onChange={handlePlanInputChange}
//                                                     />
//                                                     Mark as Popular
//                                                 </label>
//                                                 <label>
//                                                     <input 
//                                                         type="checkbox" 
//                                                         name="isActive" 
//                                                         checked={planForm.isActive} 
//                                                         onChange={handlePlanInputChange}
//                                                     />
//                                                     Active
//                                                 </label>
//                                             </div>
//                                         </div>

//                                         <div className="form-group">
//                                             <label>Image URL</label>
//                                             <input 
//                                                 type="text" 
//                                                 name="image" 
//                                                 value={planForm.image} 
//                                                 onChange={handlePlanInputChange}
//                                                 placeholder="https://example.com/image.jpg"
//                                             />
//                                         </div>

//                                         <div className="form-group">
//                                             <label>Features</label>
//                                             {planForm.features.map((feature, index) => (
//                                                 <div key={index} className="feature-input">
//                                                     <input 
//                                                         type="text" 
//                                                         value={feature} 
//                                                         onChange={(e) => handleFeatureChange(index, e.target.value)}
//                                                         placeholder={`Feature ${index + 1}`}
//                                                     />
//                                                     <button 
//                                                         type="button" 
//                                                         className="remove-btn"
//                                                         onClick={() => removeFeature(index)}
//                                                     >
//                                                         <i className="fas fa-times"></i>
//                                                     </button>
//                                                 </div>
//                                             ))}
//                                             <button type="button" className="add-feature-btn" onClick={addFeature}>
//                                                 <i className="fas fa-plus"></i> Add Feature
//                                             </button>
//                                         </div>

//                                         <div className="form-actions">
//                                             <button type="submit" className="submit-btn">
//                                                 {editingPlan ? 'Update Plan' : 'Create Plan'}
//                                             </button>
//                                             <button type="button" className="cancel-btn" onClick={() => setShowPlanForm(false)}>
//                                                 Cancel
//                                             </button>
//                                         </div>
//                                     </form>
//                                 </div>
//                             </div>
//                         )}

//                         <div className="plans-list">
//                             {plans.length > 0 ? (
//                                 plans.map(plan => (
//                                     <div key={plan._id} className={`plan-item ${!plan.isActive ? 'inactive' : ''}`}>
//                                         <div className="plan-image">
//                                             <img src={plan.image || 'https://via.placeholder.com/300x200?text=No+Image'} alt={plan.name} />
//                                             {plan.popular && <span className="popular-badge">Popular</span>}
//                                         </div>
//                                         <div className="plan-info">
//                                             <h4>{plan.name || 'Unnamed Plan'}</h4>
//                                             <p className="plan-category">{plan.category || 'Uncategorized'}</p>
//                                             <p className="plan-price">₹{plan.price?.toLocaleString() || '0'}</p>
//                                             <p className="plan-duration">{plan.duration || 'N/A'} • {plan.guests || 'N/A'}</p>
//                                             {!plan.isActive && <span className="inactive-badge">Inactive</span>}
//                                         </div>
//                                         <div className="plan-actions">
//                                             <button onClick={() => handleEditPlan(plan)} className="edit-btn">
//                                                 <i className="fas fa-edit"></i>
//                                             </button>
//                                             <button onClick={() => handleDeletePlan(plan._id)} className="delete-btn">
//                                                 <i className="fas fa-trash"></i>
//                                             </button>
//                                         </div>
//                                     </div>
//                                 ))
//                             ) : (
//                                 <div className="empty-state">
//                                     <i className="fas fa-box-open"></i>
//                                     <p>No plans found. Click "Add New Plan" to create one.</p>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 )}

//                 {/* Items Tab */}
//                 {activeTab === 'items' && (
//                     <div className="items-tab">
//                         <div className="section-header">
//                             <h3>Decoration Items</h3>
//                             <button 
//                                 className="add-btn"
//                                 onClick={() => {
//                                     setEditingItem(null);
//                                     resetItemForm();
//                                     setShowItemForm(true);
//                                 }}
//                             >
//                                 <i className="fas fa-plus"></i> Add New Item
//                             </button>
//                         </div>

//                         {showItemForm && (
//                             <div className="form-overlay">
//                                 <div className="form-container">
//                                     <h4>{editingItem ? 'Edit Item' : 'Add New Item'}</h4>
//                                     <form onSubmit={handleItemSubmit}>
//                                         <div className="form-row">
//                                             <div className="form-group">
//                                                 <label>Item Name</label>
//                                                 <input 
//                                                     type="text" 
//                                                     name="name" 
//                                                     value={itemForm.name} 
//                                                     onChange={handleItemInputChange}
//                                                     required
//                                                 />
//                                             </div>
//                                             <div className="form-group">
//                                                 <label>Category</label>
//                                                 <select name="category" value={itemForm.category} onChange={handleItemInputChange}>
//                                                     <option value="Flowers">Flowers</option>
//                                                     <option value="Lighting">Lighting</option>
//                                                     <option value="Furniture">Furniture</option>
//                                                     <option value="Backdrops">Backdrops</option>
//                                                     <option value="Table Settings">Table Settings</option>
//                                                     <option value="Props">Props</option>
//                                                     <option value="Other">Other</option>
//                                                 </select>
//                                             </div>
//                                         </div>

//                                         <div className="form-row">
//                                             <div className="form-group">
//                                                 <label>Price (₹)</label>
//                                                 <input 
//                                                     type="number" 
//                                                     name="price" 
//                                                     value={itemForm.price} 
//                                                     onChange={handleItemInputChange}
//                                                     required
//                                                 />
//                                             </div>
//                                             <div className="form-group">
//                                                 <label>Price Type</label>
//                                                 <select name="priceType" value={itemForm.priceType} onChange={handleItemInputChange}>
//                                                     <option value="per item">per item</option>
//                                                     <option value="per set">per set</option>
//                                                     <option value="per hour">per hour</option>
//                                                     <option value="per day">per day</option>
//                                                 </select>
//                                             </div>
//                                         </div>

//                                         <div className="form-group">
//                                             <label>Description</label>
//                                             <textarea 
//                                                 name="description" 
//                                                 rows="3"
//                                                 value={itemForm.description} 
//                                                 onChange={handleItemInputChange}
//                                                 required
//                                             ></textarea>
//                                         </div>

//                                         <div className="form-group">
//                                             <label>Image URL</label>
//                                             <input 
//                                                 type="text" 
//                                                 name="image" 
//                                                 value={itemForm.image} 
//                                                 onChange={handleItemInputChange}
//                                                 placeholder="https://example.com/image.jpg"
//                                                 required
//                                             />
//                                         </div>

//                                         <div className="form-row">
//                                             <div className="form-group">
//                                                 <label>Stock</label>
//                                                 <input 
//                                                     type="number" 
//                                                     name="stock" 
//                                                     value={itemForm.stock} 
//                                                     onChange={handleItemInputChange}
//                                                 />
//                                             </div>
//                                             <div className="form-group checkbox-group">
//                                                 <label>
//                                                     <input 
//                                                         type="checkbox" 
//                                                         name="available" 
//                                                         checked={itemForm.available} 
//                                                         onChange={handleItemInputChange}
//                                                     />
//                                                     Available
//                                                 </label>
//                                             </div>
//                                         </div>

//                                         <div className="form-group">
//                                             <label>Tags</label>
//                                             <div className="tag-input-group">
//                                                 <input 
//                                                     type="text" 
//                                                     value={tagInput} 
//                                                     onChange={(e) => setTagInput(e.target.value)}
//                                                     placeholder="Enter tag and press Add"
//                                                 />
//                                                 <button type="button" onClick={handleAddTag} className="add-tag-btn">
//                                                     Add
//                                                 </button>
//                                             </div>
//                                             <div className="tags-list">
//                                                 {itemForm.tags.map((tag, index) => (
//                                                     <span key={index} className="tag">
//                                                         #{tag}
//                                                         <button type="button" onClick={() => handleRemoveTag(index)}>
//                                                             <i className="fas fa-times"></i>
//                                                         </button>
//                                                     </span>
//                                                 ))}
//                                             </div>
//                                         </div>

//                                         <div className="form-actions">
//                                             <button type="submit" className="submit-btn">
//                                                 {editingItem ? 'Update Item' : 'Add Item'}
//                                             </button>
//                                             <button type="button" className="cancel-btn" onClick={() => setShowItemForm(false)}>
//                                                 Cancel
//                                             </button>
//                                         </div>
//                                     </form>
//                                 </div>
//                             </div>
//                         )}

//                         <div className="items-list">
//                             {decorationItems.length > 0 ? (
//                                 decorationItems.map(item => (
//                                     <div key={item._id} className={`item-card ${!item.available ? 'unavailable' : ''}`}>
//                                         <div className="item-image">
//                                             <img src={item.image || 'https://via.placeholder.com/300x200?text=No+Image'} alt={item.name} />
//                                             {!item.available && <span className="unavailable-badge">Unavailable</span>}
//                                             {item.stock < 5 && item.stock > 0 && <span className="low-stock-badge">Low Stock</span>}
//                                             {item.stock === 0 && <span className="out-stock-badge">Out of Stock</span>}
//                                         </div>
//                                         <div className="item-info">
//                                             <h4>{item.name || 'Unnamed Item'}</h4>
//                                             <p className="item-category">{item.category || 'Uncategorized'}</p>
//                                             <p className="item-price">₹{item.price?.toLocaleString() || '0'}/{item.priceType || 'item'}</p>
//                                             <p className="item-description">{item.description || 'No description'}</p>
//                                             {item.tags && item.tags.length > 0 && (
//                                                 <div className="item-tags">
//                                                     {item.tags.map((tag, i) => (
//                                                         <span key={i} className="tag">#{tag}</span>
//                                                     ))}
//                                                 </div>
//                                             )}
//                                             <p className="item-stock">Stock: {item.stock || 0}</p>
//                                         </div>
//                                         <div className="item-actions">
//                                             <button onClick={() => handleEditItem(item)} className="edit-btn">
//                                                 <i className="fas fa-edit"></i>
//                                             </button>
//                                             <button onClick={() => handleDeleteItem(item._id)} className="delete-btn">
//                                                 <i className="fas fa-trash"></i>
//                                             </button>
//                                         </div>
//                                     </div>
//                                 ))
//                             ) : (
//                                 <div className="empty-state">
//                                     <i className="fas fa-gem"></i>
//                                     <p>No items found. Click "Add New Item" to create one.</p>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default AdminPricing;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPricing.css';

const AdminPricing = () => {
    const [plans, setPlans] = useState([]);
    const [decorationItems, setDecorationItems] = useState([]);
    const [activeTab, setActiveTab] = useState('plans');
    const [loading, setLoading] = useState(true);
    const [showPlanForm, setShowPlanForm] = useState(false);
    const [showItemForm, setShowItemForm] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);
    const [editingItem, setEditingItem] = useState(null);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [expandedPlans, setExpandedPlans] = useState({});

    // Plan Form State
    const [planForm, setPlanForm] = useState({
        name: 'Basic',
        category: 'Wedding',
        price: '',
        duration: '4 Hours',
        guests: 'Up to 50',
        features: [''],
        isActive: true,
        popular: false,
        image: ''
    });

    // Item Form State
    const [itemForm, setItemForm] = useState({
        name: '',
        category: 'Flowers',
        price: '',
        priceType: 'per item',
        description: '',
        image: '',
        available: true,
        stock: 0,
        tags: []
    });

    const [tagInput, setTagInput] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const [plansRes, itemsRes] = await Promise.all([
                axios.get('http://localhost:5000/api/pricing/admin', config),
                axios.get('http://localhost:5000/api/decoration/admin', config)
            ]);
            
            setPlans(plansRes.data);
            setDecorationItems(itemsRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            setMessage({ text: 'Failed to fetch data', type: 'error' });
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        }
        setLoading(false);
    };

    // Helper Functions
    const showMessage = (text, type) => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    };

    // Toggle features expansion
    const toggleFeatures = (planId) => {
        setExpandedPlans(prev => ({
            ...prev,
            [planId]: !prev[planId]
        }));
    };

    // Get unique categories for filter
    const getUniqueCategories = () => {
        const categories = [...new Set(plans.map(p => p.category))];
        return ['all', ...categories].filter(Boolean);
    };

    // Filter plans by category
    const getFilteredPlans = () => {
        if (selectedCategory === 'all') return plans;
        return plans.filter(plan => plan.category === selectedCategory);
    };

    // Group items by category
    const getItemsByCategory = () => {
        const grouped = {};
        decorationItems.forEach(item => {
            if (!grouped[item.category]) {
                grouped[item.category] = [];
            }
            grouped[item.category].push(item);
        });
        return grouped;
    };

    // Plan Functions
    const handlePlanInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPlanForm({
            ...planForm,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleFeatureChange = (index, value) => {
        const newFeatures = [...planForm.features];
        newFeatures[index] = value;
        setPlanForm({ 
            ...planForm, 
            features: newFeatures 
        });
    };

        const addFeature = () => {
            setPlanForm({
                ...planForm,
                features: [...planForm.features, '']
            });
        };

        const removeFeature = (index) => {
        const newFeatures = planForm.features.filter((_, i) => i !== index);
        setPlanForm({ ...planForm, features: newFeatures });
    };
    const handlePlanSubmit = async (e) => {
        e.preventDefault();
        
        console.log('1️⃣ Form submitted with data:', planForm);
        
        // Validate price
        if (!planForm.price || planForm.price <= 0) {
            showMessage('Please enter a valid price', 'error');
            return;
        }
    
        // Validate features - filter out empty strings
        const validFeatures = planForm.features.filter(f => f && f.trim() !== '');
        console.log('2️⃣ Valid features:', validFeatures);
        
        if (validFeatures.length === 0) {
            showMessage('Please add at least one feature', 'error');
            return;
        }
    
        try {
            const token = localStorage.getItem('adminToken');
            console.log('3️⃣ Token present:', !!token);
            
            if (!token) {
                showMessage('Please login again', 'error');
                return;
            }
    
            const config = { 
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                } 
            };
    
            // Prepare data exactly as backend expects
            const planData = {
                name: planForm.name,
                category: planForm.category,
                price: Number(planForm.price),
                duration: planForm.duration,
                guests: planForm.guests,
                features: validFeatures, // Send as array of strings
                isActive: planForm.isActive,
                popular: planForm.popular,
                image: planForm.image || undefined
            };
    
            console.log('4️⃣ Sending to backend:', JSON.stringify(planData, null, 2));
    
            let response;
            if (editingPlan) {
                console.log('5️⃣ Updating plan ID:', editingPlan._id);
                response = await axios.put(
                    `http://localhost:5000/api/pricing/${editingPlan._id}`, 
                    planData, 
                    config
                );
            } else {
                console.log('5️⃣ Creating new plan');
                response = await axios.post(
                    'http://localhost:5000/api/pricing', 
                    planData, 
                    config
                );
            }
    
            console.log('6️⃣ Server response:', response.data);
    
            if (response.data.success) {
                showMessage(
                    editingPlan ? 'Plan updated successfully!' : 'Plan created successfully!', 
                    'success'
                );
                
                // Reset form and close modal
                setShowPlanForm(false);
                setEditingPlan(null);
                resetPlanForm();
                
                // Refresh data
                await fetchData();
            }
            
        } catch (error) {
            console.error('❌ Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                stack: error.stack
            });
            
            // Show user-friendly error message
            const errorMessage = error.response?.data?.error || error.message;
            showMessage(`Failed: ${errorMessage}`, 'error');
        }
    };

    const handleEditPlan = (plan) => {
        setEditingPlan(plan);
        setPlanForm({
            name: plan.name,
            category: plan.category,
            price: plan.price,
            duration: plan.duration,
            guests: plan.guests,
            features: plan.features,
            isActive: plan.isActive,
            popular: plan.popular,
            image: plan.image
        });
        setShowPlanForm(true);
    };

    const handleDeletePlan = async (id) => {
        if (window.confirm('Are you sure you want to delete this plan?')) {
            try {
                const token = localStorage.getItem('adminToken');
                await axios.delete(`http://localhost:5000/api/pricing/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                showMessage('Plan deleted successfully!', 'success');
                fetchData();
            } catch (error) {
                showMessage('Delete failed', 'error');
            }
        }
    };

    const resetPlanForm = () => {
        setPlanForm({
            name: 'Basic',
            category: 'Wedding',
            price: '',
            duration: '4 Hours',
            guests: 'Up to 50',
            features: [''],
            isActive: true,
            popular: false,
            image: ''
        });
    };

    // Item Functions
    const handleItemInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setItemForm({
            ...itemForm,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleAddTag = () => {
        if (tagInput.trim()) {
            setItemForm({
                ...itemForm,
                tags: [...itemForm.tags, tagInput.trim()]
            });
            setTagInput('');
        }
    };

    const handleRemoveTag = (index) => {
        const newTags = itemForm.tags.filter((_, i) => i !== index);
        setItemForm({ ...itemForm, tags: newTags });
    };

    const handleItemSubmit = async (e) => {
        e.preventDefault();
        
        if (!itemForm.name || !itemForm.price || !itemForm.description || !itemForm.image) {
            showMessage('Please fill in all required fields', 'error');
            return;
        }
    
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                showMessage('Please login again', 'error');
                return;
            }
    
            const config = { 
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                } 
            };
    
            if (editingItem) {
                await axios.put(
                    `http://localhost:5000/api/decoration/${editingItem._id}`, 
                    itemForm, 
                    config
                );
                showMessage('Item updated successfully!', 'success');
            } else {
                await axios.post(
                    'http://localhost:5000/api/decoration', 
                    itemForm, 
                    config
                );
                showMessage('Item created successfully!', 'success');
            }
    
            setShowItemForm(false);
            setEditingItem(null);
            resetItemForm();
            fetchData();
            
        } catch (error) {
            if (error.response?.data?.error) {
                showMessage(`Failed: ${error.response.data.error}`, 'error');
            } else {
                showMessage('Operation failed', 'error');
            }
        }
    };

    const handleEditItem = (item) => {
        setEditingItem(item);
        setItemForm({
            name: item.name,
            category: item.category,
            price: item.price,
            priceType: item.priceType,
            description: item.description,
            image: item.image,
            available: item.available,
            stock: item.stock,
            tags: item.tags || []
        });
        setShowItemForm(true);
    };

    const handleDeleteItem = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                const token = localStorage.getItem('adminToken');
                await axios.delete(`http://localhost:5000/api/decoration/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                showMessage('Item deleted successfully!', 'success');
                fetchData();
            } catch (error) {
                showMessage('Delete failed', 'error');
            }
        }
    };

    const resetItemForm = () => {
        setItemForm({
            name: '',
            category: 'Flowers',
            price: '',
            priceType: 'per item',
            description: '',
            image: '',
            available: true,
            stock: 0,
            tags: []
        });
        setTagInput('');
    };

    if (loading) {
        return (
            <div className="admin-loading">
                <div className="loading-spinner"></div>
                <p>Loading pricing data...</p>
            </div>
        );
    }

    const filteredPlans = getFilteredPlans();
    const itemsByCategory = getItemsByCategory();

    return (
        <div className="admin-pricing">
            <div className="pricing-header">
                <h2><i className="fas fa-tag"></i> Pricing Management</h2>
                <div className="pricing-tabs">
                    <button 
                        className={`tab-btn ${activeTab === 'plans' ? 'active' : ''}`}
                        onClick={() => setActiveTab('plans')}
                    >
                        <i className="fas fa-box"></i> Plans ({plans.length})
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'items' ? 'active' : ''}`}
                        onClick={() => setActiveTab('items')}
                    >
                        <i className="fas fa-gem"></i> Items ({decorationItems.length})
                    </button>
                </div>
            </div>

            {message.text && (
                <div className={`admin-message ${message.type}`}>
                    <i className={`fas fa-${message.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i>
                    {message.text}
                </div>
            )}

            <div className="pricing-content">
                {/* Plans Tab */}
                {activeTab === 'plans' && (
                    <div className="plans-tab">
                        <div className="section-header">
                            <div className="header-left">
                                <h3>Pricing Plans</h3>
                                <select 
                                    className="category-filter"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    {getUniqueCategories().map(cat => (
                                        <option key={cat} value={cat}>
                                            {cat === 'all' ? 'All Categories' : cat}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button 
                                className="add-btn"
                                onClick={() => {
                                    setEditingPlan(null);
                                    resetPlanForm();
                                    setShowPlanForm(true);
                                }}
                            >
                                <i className="fas fa-plus"></i> Add New Plan
                            </button>
                        </div>

                        {showPlanForm && (
                            <div className="form-overlay">
                                <div className="form-container">
                                    <h4>{editingPlan ? 'Edit Plan' : 'Create New Plan'}</h4>
                                    <form onSubmit={handlePlanSubmit}>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Plan Name</label>
                                                <select name="name" value={planForm.name} onChange={handlePlanInputChange}>
                                                    <option value="Basic">Basic</option>
                                                    <option value="Premium">Premium</option>
                                                    <option value="Luxury">Luxury</option>
                                                    <option value="Custom">Custom</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label>Category</label>
                                                <select name="category" value={planForm.category} onChange={handlePlanInputChange}>
                                                    <option value="Wedding">Wedding</option>
                                                    <option value="Corporate">Corporate</option>
                                                    <option value="Birthday">Birthday</option>
                                                    <option value="Baby Shower">Baby Shower</option>
                                                    <option value="Festival">Festival</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Price (₹)</label>
                                                <input 
                                                    type="number" 
                                                    name="price" 
                                                    value={planForm.price} 
                                                    onChange={handlePlanInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Duration</label>
                                                <select name="duration" value={planForm.duration} onChange={handlePlanInputChange}>
                                                    <option value="4 Hours">4 Hours</option>
                                                    <option value="8 Hours">8 Hours</option>
                                                    <option value="12 Hours">12 Hours</option>
                                                    <option value="Full Day">Full Day</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Guests</label>
                                                <select name="guests" value={planForm.guests} onChange={handlePlanInputChange}>
                                                    <option value="Up to 50">Up to 50</option>
                                                    <option value="50-100">50-100</option>
                                                    <option value="100-200">100-200</option>
                                                    <option value="200-500">200-500</option>
                                                    <option value="500+">500+</option>
                                                </select>
                                            </div>
                                            <div className="form-group checkbox-group">
                                                <label>
                                                    <input 
                                                        type="checkbox" 
                                                        name="popular" 
                                                        checked={planForm.popular} 
                                                        onChange={handlePlanInputChange}
                                                    />
                                                    Mark as Popular
                                                </label>
                                                <label>
                                                    <input 
                                                        type="checkbox" 
                                                        name="isActive" 
                                                        checked={planForm.isActive} 
                                                        onChange={handlePlanInputChange}
                                                    />
                                                    Active
                                                </label>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label>Image URL</label>
                                            <input 
                                                type="text" 
                                                name="image" 
                                                value={planForm.image} 
                                                onChange={handlePlanInputChange}
                                                placeholder="https://example.com/image.jpg"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Features</label>
                                            {planForm.features.map((feature, index) => (
                                                <div key={index} className="feature-input">
                                                    <input 
                                                        type="text" 
                                                        value={feature} 
                                                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                                                        placeholder={`Feature ${index + 1}`}
                                                    />
                                                    <button 
                                                        type="button" 
                                                        className="remove-btn"
                                                        onClick={() => removeFeature(index)}
                                                    >
                                                        <i className="fas fa-times"></i>
                                                    </button>
                                                </div>
                                            ))}
                                            <button type="button" className="add-feature-btn" onClick={addFeature}>
                                                <i className="fas fa-plus"></i> Add Feature
                                            </button>
                                        </div>

                                        <div className="form-actions">
                                            <button type="submit" className="submit-btn">
                                                {editingPlan ? 'Update Plan' : 'Create Plan'}
                                            </button>
                                            <button type="button" className="cancel-btn" onClick={() => setShowPlanForm(false)}>
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        <div className="plans-list">
                            {filteredPlans.length > 0 ? (
                                filteredPlans.map(plan => (
                                    <div key={plan._id} className={`plan-card ${!plan.isActive ? 'inactive' : ''}`}>
                                        <div className="plan-image">
                                            <img src={plan.image || 'https://via.placeholder.com/300x200?text=No+Image'} alt={plan.name} />
                                            <div className="plan-badges">
                                                {plan.popular && <span className="badge popular">🔥 Popular</span>}
                                                {!plan.isActive && <span className="badge inactive">⛔ Inactive</span>}
                                            </div>
                                        </div>
                                        
                                        <div className="plan-header">
                                            <div>
                                                <h3>{plan.name || 'Unnamed Plan'}</h3>
                                                <span className="plan-category">{plan.category || 'Uncategorized'}</span>
                                            </div>
                                            <div className="plan-price-tag">
                                                <span className="currency">₹</span>
                                                <span className="amount">{plan.price?.toLocaleString() || '0'}</span>
                                            </div>
                                        </div>

                                        <div className="plan-details">
                                            <div className="detail-item">
                                                <i className="fas fa-clock"></i>
                                                <span>{plan.duration || 'N/A'}</span>
                                            </div>
                                            <div className="detail-item">
                                                <i className="fas fa-users"></i>
                                                <span>{plan.guests || 'N/A'}</span>
                                            </div>
                                        </div>

                                        <div className="plan-features-section">
                                            <div className="features-header" onClick={() => toggleFeatures(plan._id)}>
                                                <span>Features ({plan.features?.length || 0})</span>
                                                <i className={`fas fa-chevron-${expandedPlans[plan._id] ? 'up' : 'down'}`}></i>
                                            </div>
                                            
                                            {expandedPlans[plan._id] ? (
                                                <div className="features-list expanded">
                                                    {plan.features?.map((feature, idx) => (
                                                        <div key={idx} className="feature-item">
                                                            <i className="fas fa-check-circle"></i>
                                                            <span>{feature}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="features-preview">
                                                    {plan.features?.slice(0, 2).map((feature, idx) => (
                                                        <div key={idx} className="feature-item">
                                                            <i className="fas fa-check-circle"></i>
                                                            <span>{feature}</span>
                                                        </div>
                                                    ))}
                                                    {plan.features?.length > 2 && (
                                                        <div className="feature-more">
                                                            +{plan.features.length - 2} more
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div className="plan-footer">
                                            <div className="plan-meta">
                                                <span className="plan-id">ID: {plan._id.slice(-6)}</span>
                                                <span className="plan-date">
                                                    <i className="far fa-calendar-alt"></i>
                                                    {new Date(plan.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="plan-actions">
                                                <button onClick={() => handleEditPlan(plan)} className="edit-btn" title="Edit">
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button onClick={() => handleDeletePlan(plan._id)} className="delete-btn" title="Delete">
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-state">
                                    <i className="fas fa-box-open"></i>
                                    <h3>No Plans Found</h3>
                                    <p>Try selecting a different category or add a new plan</p>
                                    <button 
                                        className="empty-btn"
                                        onClick={() => {
                                            setEditingPlan(null);
                                            resetPlanForm();
                                            setShowPlanForm(true);
                                        }}
                                    >
                                        <i className="fas fa-plus"></i> Add Your First Plan
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Items Tab */}
                {activeTab === 'items' && (
                    <div className="items-tab">
                        <div className="section-header">
                            <h3>Decoration Items</h3>
                            <button 
                                className="add-btn"
                                onClick={() => {
                                    setEditingItem(null);
                                    resetItemForm();
                                    setShowItemForm(true);
                                }}
                            >
                                <i className="fas fa-plus"></i> Add New Item
                            </button>
                        </div>

                        {showItemForm && (
                            <div className="form-overlay">
                                <div className="form-container">
                                    <h4>{editingItem ? 'Edit Item' : 'Add New Item'}</h4>
                                    <form onSubmit={handleItemSubmit}>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Item Name</label>
                                                <input 
                                                    type="text" 
                                                    name="name" 
                                                    value={itemForm.name} 
                                                    onChange={handleItemInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Category</label>
                                                <select name="category" value={itemForm.category} onChange={handleItemInputChange}>
                                                    <option value="Flowers">Flowers</option>
                                                    <option value="Lighting">Lighting</option>
                                                    <option value="Furniture">Furniture</option>
                                                    <option value="Backdrops">Backdrops</option>
                                                    <option value="Table Settings">Table Settings</option>
                                                    <option value="Props">Props</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Price (₹)</label>
                                                <input 
                                                    type="number" 
                                                    name="price" 
                                                    value={itemForm.price} 
                                                    onChange={handleItemInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Price Type</label>
                                                <select name="priceType" value={itemForm.priceType} onChange={handleItemInputChange}>
                                                    <option value="per item">per item</option>
                                                    <option value="per set">per set</option>
                                                    <option value="per hour">per hour</option>
                                                    <option value="per day">per day</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label>Description</label>
                                            <textarea 
                                                name="description" 
                                                rows="3"
                                                value={itemForm.description} 
                                                onChange={handleItemInputChange}
                                                required
                                            ></textarea>
                                        </div>

                                        <div className="form-group">
                                            <label>Image URL</label>
                                            <input 
                                                type="text" 
                                                name="image" 
                                                value={itemForm.image} 
                                                onChange={handleItemInputChange}
                                                placeholder="https://example.com/image.jpg"
                                                required
                                            />
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Stock</label>
                                                <input 
                                                    type="number" 
                                                    name="stock" 
                                                    value={itemForm.stock} 
                                                    onChange={handleItemInputChange}
                                                />
                                            </div>
                                            <div className="form-group checkbox-group">
                                                <label>
                                                    <input 
                                                        type="checkbox" 
                                                        name="available" 
                                                        checked={itemForm.available} 
                                                        onChange={handleItemInputChange}
                                                    />
                                                    Available
                                                </label>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label>Tags</label>
                                            <div className="tag-input-group">
                                                <input 
                                                    type="text" 
                                                    value={tagInput} 
                                                    onChange={(e) => setTagInput(e.target.value)}
                                                    placeholder="Enter tag and press Add"
                                                />
                                                <button type="button" onClick={handleAddTag} className="add-tag-btn">
                                                    Add
                                                </button>
                                            </div>
                                            <div className="tags-list">
                                                {itemForm.tags.map((tag, index) => (
                                                    <span key={index} className="tag">
                                                        #{tag}
                                                        <button type="button" onClick={() => handleRemoveTag(index)}>
                                                            <i className="fas fa-times"></i>
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="form-actions">
                                            <button type="submit" className="submit-btn">
                                                {editingItem ? 'Update Item' : 'Add Item'}
                                            </button>
                                            <button type="button" className="cancel-btn" onClick={() => setShowItemForm(false)}>
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        <div className="items-by-category">
                            {Object.entries(itemsByCategory).map(([category, items]) => (
                                <div key={category} className="category-section">
                                    <div className="category-header">
                                        <h4>
                                            <i className="fas fa-folder"></i>
                                            {category} <span className="item-count">({items.length})</span>
                                        </h4>
                                    </div>
                                    <div className="items-grid">
                                        {items.map(item => (
                                            <div key={item._id} className={`item-card ${!item.available ? 'unavailable' : ''}`}>
                                                <div className="item-image">
                                                    <img src={item.image || 'https://via.placeholder.com/300x200?text=No+Image'} alt={item.name} />
                                                    <div className="item-badges">
                                                        {!item.available && <span className="badge unavailable">Unavailable</span>}
                                                        {item.stock < 5 && item.stock > 0 && <span className="badge low-stock">Low Stock</span>}
                                                        {item.stock === 0 && <span className="badge out-stock">Out of Stock</span>}
                                                    </div>
                                                </div>
                                                
                                                <div className="item-header">
                                                    <h4>{item.name || 'Unnamed Item'}</h4>
                                                    <span className="item-category-tag">{item.category}</span>
                                                </div>

                                                <div className="item-price-info">
                                                    <span className="item-price">₹{item.price?.toLocaleString() || '0'}</span>
                                                    <span className="item-price-type">/{item.priceType || 'item'}</span>
                                                </div>

                                                <p className="item-description">{item.description || 'No description'}</p>

                                                {item.tags && item.tags.length > 0 && (
                                                    <div className="item-tags">
                                                        {item.tags.map((tag, i) => (
                                                            <span key={i} className="tag">#{tag}</span>
                                                        ))}
                                                    </div>
                                                )}

                                                <div className="item-stock-info">
                                                    <i className="fas fa-boxes"></i>
                                                    <span>Stock: {item.stock || 0}</span>
                                                </div>

                                                <div className="item-footer">
                                                    <div className="item-meta">
                                                        <span className="item-id">ID: {item._id.slice(-6)}</span>
                                                    </div>
                                                    <div className="item-actions">
                                                        <button onClick={() => handleEditItem(item)} className="edit-btn" title="Edit">
                                                            <i className="fas fa-edit"></i>
                                                        </button>
                                                        <button onClick={() => handleDeleteItem(item._id)} className="delete-btn" title="Delete">
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            
                            {decorationItems.length === 0 && (
                                <div className="empty-state">
                                    <i className="fas fa-gem"></i>
                                    <h3>No Items Found</h3>
                                    <p>Click "Add New Item" to create your first decoration item</p>
                                    <button 
                                        className="empty-btn"
                                        onClick={() => {
                                            setEditingItem(null);
                                            resetItemForm();
                                            setShowItemForm(true);
                                        }}
                                    >
                                        <i className="fas fa-plus"></i> Add Your First Item
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPricing;