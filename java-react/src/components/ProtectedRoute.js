import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const isAdmin = JSON.parse(localStorage.getItem('isAdmin'));

    if (!isAdmin) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;
