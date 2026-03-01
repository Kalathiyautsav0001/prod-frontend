import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const AdminLogin = ({ onLogin }) => {
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:5000/api/admin/login', credentials);
            
            if (response.data.success) {
                // Store token
                localStorage.setItem('adminToken', response.data.token);
                localStorage.setItem('adminAuthenticated', 'true');
                onLogin();
                navigate('/admin/dashboard');
            }
        } catch (error) {
            setError(error.response?.data?.error || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login-card">
                <div className="login-header">
                    <h2>Devam</h2>
                    <span>ADMIN PANEL</span>
                </div>
                
                <form onSubmit={handleSubmit} className="admin-login-form">
                    <div className="form-group">
                        <i className="fas fa-user"></i>
                        <input
                            type="text"
                            id="username"
                            placeholder="Username"
                            value={credentials.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <i className="fas fa-lock"></i>
                        <input
                            type="password"
                            id="password"
                            placeholder="Password"
                            value={credentials.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    {error && <div className="login-error">{error}</div>}
                    
                    <button 
                        type="submit" 
                        className="login-btn"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                
                {/* <div className="login-footer">
                    <p>Default credentials:</p>
                    <p>Username: <strong>admin</strong></p>
                    <p>Password: <strong>admin@123</strong></p>
                </div> */}
            </div>
        </div>
    );
};

export default AdminLogin;