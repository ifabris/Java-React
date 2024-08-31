import React, { createContext, useReducer, useEffect } from 'react';
import authReducer from '../reducers/authReducer';

// Initial state loaded from localStorage
const initialState = {
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    admin: JSON.parse(localStorage.getItem('isAdmin')),
};

export const AuthContext = createContext(initialState);

const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Persist state changes to localStorage
    useEffect(() => {
        if (state.token) {
            localStorage.setItem('token', state.token);
            localStorage.setItem('user', JSON.stringify(state.user));
            localStorage.setItem('isAdmin', JSON.stringify(state.admin));
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('isAdmin');
        }
    }, [state.token, state.user, state.admin]);

    const login = (authData) => {
        dispatch({
            type: 'LOGIN',
            payload: {
                user: authData.user,
                token: authData.token,
                admin: authData.admin,
            },
        });
    };

    const logout = () => {
        dispatch({ type: 'LOGOUT' });
    };

    return (
        <AuthContext.Provider value={{ ...state, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
