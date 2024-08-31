import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { generatePDF } from '../utils/pdfGenerator';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../contexts/AuthContext';

const PurchasePage = () => {
    const { t, i18n } = useTranslation();
    const [cartItems, setCartItems] = useState([]);
    const [notification, setNotification] = useState('');
    const navigate = useNavigate();

    const { user, token } = useContext(AuthContext);

    useEffect(() => {
        const items = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(items);
    }, []);

    const handlePlaceOrder = async () => {
        const date = new Date().toISOString();
        const userId = localStorage.getItem('userId');

        const invoice = {
            user: {
                id: userId,
                username: user.username,
                email: user.email,
            },
            date,
        };

        try {
            await axios.post('http://localhost:8080/invoices', invoice, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const totalSum = calculateTotalSum();

            generatePDF(cartItems, totalSum, invoice.user, date);

            localStorage.removeItem('cart');

            setNotification(t('invoice_created'));
            setTimeout(() => {
                navigate('/landing');
            }, 2000);
        } catch (error) {
            console.error(t('error_placing_order'), error);
            setNotification(t('error_creating_invoice'));
        }
    };

    const calculateTotalSum = () => {
        return cartItems.reduce((total, item) => total + item.price, 0).toFixed(2);
    };

    return (
        <div className="container mt-5">
            <h1>{t('purchase_page')}</h1>
            {notification && <div className="alert alert-info">{notification}</div>}
            {cartItems.length === 0 ? (
                <p>{t('cart_is_empty')}</p>
            ) : (
                <div>
                    <h3>{t('cart_items')}</h3>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>{t('name')}</th>
                                <th>{t('description')}</th>
                                <th>{t('price')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.productName}</td>
                                    <td>{item.description}</td>
                                    <td>${item.price.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="d-flex justify-content-between">
                        <h4>{t('total_sum')}</h4>
                        <h4>${calculateTotalSum()}</h4>
                    </div>
                    <button onClick={handlePlaceOrder} className="btn btn-primary mt-3">
                        {t('place_order')}
                    </button>
                </div>
            )}
        </div>
    );
};

export default PurchasePage;
