import React from 'react';
import { Navigate } from 'react-router-dom';

const AuthenticatedRoute = ({ children }) => {
    const username = localStorage.getItem('username');

    if (!username || username === 'undefined') {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default AuthenticatedRoute;
