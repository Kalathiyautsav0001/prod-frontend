import React from 'react';
import AdminPanel from '../components/AdminPanel';

const AdminPage = ({ onLogout }) => {
    return <AdminPanel onLogout={onLogout} />;
};

export default AdminPage;