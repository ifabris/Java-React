import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../contexts/AuthContext';

function Login() {
    const { t, i18n } = useTranslation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);


    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!username || !password) {
            setError(t('both_fields_required'));
            return;
        }
    
        setError('');
        setSuccess('');
    
        try {
            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
    
            if (!response.ok) {
                throw new Error(t('login_failed'));
            }
    
            const data = await response.json();
    
            const authData = {
                user: { username: data.username, email: data.email }, 
                token: data.jwtToken,
                admin: data.admin
            };
    
            login(authData);
    
            localStorage.setItem('jwtToken', data.jwtToken);
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('username', data.username);
            localStorage.setItem('email', data.email);
    
            setSuccess(t('login_success'));
            setTimeout(() => {
                navigate(data.admin ? '/admin' : '/landing');
            }, 2000);
        } catch (err) {
            setError(err.message);
        }
    };
    

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header text-center">
                            <h3>
                                <FontAwesomeIcon icon={faSignInAlt} /> {t('login')}
                            </h3>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group mb-3">
                                    <label htmlFor="username">{t('username')}</label>
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                <FontAwesomeIcon icon={faUser} />
                                            </span>
                                        </div>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="password">{t('password')}</label>
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                <FontAwesomeIcon icon={faLock} />
                                            </span>
                                        </div>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary btn-block">
                                    <FontAwesomeIcon icon={faSignInAlt} /> {t('login')}
                                </button>
                            </form>
                            {error && <div className="alert alert-danger mt-3">{error}</div>}
                            {success && <div className="alert alert-success mt-3">{success}</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
