import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import '../styles/CartPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';


const CartPage = () => {
    const { t, i18n } = useTranslation();

    const [cart, setCart] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(savedCart);
    }, []);

    const handleRemoveFromCart = (productId) => {
        const updatedCart = cart.filter(product => product.id !== productId);
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const handleContinueToPurchase = () => {
        navigate('/purchase');
    };

    return (
        <div className="container mt-4">
            <h1>{t('cart')}</h1>
            <div className="mb-3">
                <button className="btn btn-secondary" onClick={() => navigate('/')}>
                    <FontAwesomeIcon icon={faChevronLeft} /> {t('back_to_products')}
                </button>
            </div>
            {cart.length > 0 ? (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>{t('product_name')}</th>
                            <th>{t('description')}</th>
                            <th>{t('price')}</th>
                            <th>{t('action')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.map(product => (
                            <tr key={product.id}>
                                <td>{product.id}</td>
                                <td>{product.productName}</td>
                                <td>{product.description}</td>
                                <td>${product.price.toFixed(2)}</td>
                                <td>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleRemoveFromCart(product.id)}
                                    >
                                        <FontAwesomeIcon icon={faTrash} /> {t('remove')}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>{t('cart_is_empty')}</p>
            )}
            <button className="btn btn-primary" onClick={handleContinueToPurchase}>
                {t('continue_to_purchase')}
            </button>
        </div>
    );
};

export default CartPage;
