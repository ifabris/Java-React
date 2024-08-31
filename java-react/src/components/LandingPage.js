import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faRedo, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import '../styles/LandingPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';


const LandingPage = () => {
    const { t, i18n } = useTranslation();

    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [animation, setAnimation] = useState(null);

    const fetchProducts = () => {
        const token = localStorage.getItem('jwtToken');
        axios.get('http://localhost:8080/products', {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            setProducts(response.data);
            setFilteredProducts(response.data);
        })
        .catch(error => console.error(t('error_fetching_products'), error));
    };

    const fetchCategories = () => {
        const token = localStorage.getItem('jwtToken');
        axios.get('http://localhost:8080/categories', {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            setCategories([{ id: '', name: t('all') }, ...response.data]);
        })
        .catch(error => console.error(t('error_fetching_categories'), error));
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const handleCategoryChange = (e) => {
        const categoryId = e.target.value;
        setSelectedCategory(categoryId);
        if (categoryId === '' || categoryId === 'All') {
            setFilteredProducts(products);
        } else {
            setFilteredProducts(products.filter(product => product.category.id === Number(categoryId)));
        }
    };

    const handleSearch = (e) => {
        const search = e.target.value.toLowerCase();
        setSearchTerm(search);
        const filtered = products.filter(product => product.productName.toLowerCase().includes(search));
        setFilteredProducts(filtered);
    };

    const resetFilters = () => {
        setSearchTerm('');
        setSelectedCategory('All');
        setFilteredProducts(products);
    };

    const handleAddToCart = (product) => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = [...cart, product];
        localStorage.setItem('cart', JSON.stringify(cart));
        
        setAnimation('cart-animation');
        setTimeout(() => setAnimation(null), 500);
    };

    return (
        <div className="container mt-4">
            <h1>{t('landingPage')}</h1>
            <div className="row mb-3">
                <div className="col-md-4 mb-2">
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder={t('search_products')}
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        <div className="input-group-append">
                            <span className="input-group-text">
                                <FontAwesomeIcon icon={faSearch} />
                            </span>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-2">
                    <select
                        className="form-control"
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                    >
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col-md-4 mb-2">
                    <button className="btn btn-secondary btn-block" onClick={resetFilters}>
                        <FontAwesomeIcon icon={faRedo} /> {t('reset')}
                    </button>
                </div>
            </div>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>{t('product_name')}</th>
                        <th>{t('description')}</th>
                        <th>{t('price')}</th>
                        <th>{t('category')}</th>
                        <th>{t('action')}</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map(product => (
                            <tr key={product.id}>
                                <td>{product.id}</td>
                                <td>{product.productName}</td>
                                <td>{product.description}</td>
                                <td>${product.price.toFixed(2)}</td>
                                <td>{product.category.name}</td>
                                <td>
                                    <button
                                        className={`btn btn-primary ${animation}`}
                                        onClick={() => handleAddToCart(product)}
                                    >
                                        <FontAwesomeIcon icon={faShoppingCart} /> {t('buy')}
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center">{t('no_product_found')}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default LandingPage;
