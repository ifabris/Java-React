import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../contexts/AuthContext';

const Navbar = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { isAuthenticated, admin, logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link to="/" className="navbar-brand">
                    <i className="fas fa-home"></i> {t('home')}
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ml-auto">
                        {!isAuthenticated ? (
                            <>
                                <li className="nav-item">
                                    <Link to="/login" className="nav-link">
                                        <i className="fas fa-sign-in-alt"></i> {t('login')}
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/register" className="nav-link">
                                        <i className="fas fa-user-plus"></i> {t('register')}
                                    </Link>
                                </li>
                            </>
                        ) : admin ? (
                            <>
                                <li className="nav-item">
                                    <Link to="/admin" className="nav-link">
                                        <i className="fas fa-user-cog"></i> {t('adminDashboard')}
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/category" className="nav-link">
                                        <i className="fas fa-th-list"></i> {t('categoryDashboard')}
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/invoices" className="nav-link">
                                        <i className="fas fa-file-invoice"></i> {t('inovices')}
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <button className="btn btn-outline-light nav-link" onClick={handleLogout}>
                                        <i className="fas fa-sign-out-alt"></i> {t('logout')}
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link to="/landing" className="nav-link">
                                        <i className="fas fa-list"></i> {t('landingPage')}
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/cart" className="nav-link">
                                        <i className="fas fa-shopping-cart"></i> {t('cart')}
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <button className="btn btn-outline-light nav-link" onClick={handleLogout}>
                                        <i className="fas fa-sign-out-alt"></i> {t('logout')}
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
