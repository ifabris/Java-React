import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faSearch, faRedo } from '@fortawesome/free-solid-svg-icons';
import '../styles/AdminDashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import api from '../services/api'


Modal.setAppElement('#root');

const AdminDashboard = () => {
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [newProduct, setNewProduct] = useState({
    productName: '',
    description: '',
    price: '',
    category: {
      id: '',
      name: ''
    }
  });
  const [isAdding, setIsAdding] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [searchId, setSearchId] = useState('');
  const [isFiltered, setIsFiltered] = useState(false);
  const [notification, setNotification] = useState(''); 

  const navigate = useNavigate(); 

  const fetchProducts = () => {
    const token = localStorage.getItem('jwtToken'); 

    api.get('/products', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then(response => {
        setProducts(response.data);
    })
    .catch(error => {
        console.error('There was an error fetching the products!', error);
        if (error.response && error.response.status === 401) {
            console.error("Unauthorized. Redirecting to login.");
        }
    });
};

  const fetchCategories = () => {
    const token = localStorage.getItem('jwtToken');
    api.get('/categories', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error(t('error_fetching_categories'), error);
      });
  };

  const handleEdit = (product) => {
    setEditProduct({
      ...product,
      category: {
        id: product.category.id,
        name: product.category.name
      }
    });
  };

  const handleAdd = () => {
    setIsAdding(true);
    setNewProduct({
      productName: '',
      description: '',
      price: '',
      category: {
        id: '',
        name: ''
      }
    });
  };

  const handleSaveNewProduct = (event) => {
    event.preventDefault();
    const token = localStorage.getItem('jwtToken');
    api.post('/products', newProduct, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        fetchProducts();
        setNewProduct({
          productName: '',
          description: '',
          price: '',
          category: {
            id: '',
            name: ''
          }
        });
        setIsAdding(false);
      })
      .catch(error => {
        console.error(t('error_adding_product'), error);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const token = localStorage.getItem('jwtToken');
    api.put(`/products/${editProduct.id}`, editProduct, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        fetchProducts();
        setEditProduct(null);
      })
      .catch(error => {
        console.error(t('error_updating_product'), error);
      });
  };

  const handleDelete = (product) => {
    setShowDeleteConfirm(true);
    setProductToDelete(product);
  };

  const confirmDelete = () => {
    const token = localStorage.getItem('jwtToken');
    api.delete(`/products/${productToDelete.id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        fetchProducts();
        setShowDeleteConfirm(false);
        setProductToDelete(null);
      })
      .catch(error => {
        console.error(t('error_deleting_product'), error);
      });
  };

  const handleSearch = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await api.get(`/products/${searchId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts([response.data]);
      setIsFiltered(true);
    } catch (error) {
      console.error(t('error_searching_product'), error);
    }
  };

  const handleReset = () => {
    fetchProducts();
    setSearchId('');
    setIsFiltered(false);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();

    const notificationMessage = localStorage.getItem('notification');
    if (notificationMessage) {
      setNotification(notificationMessage);
      localStorage.removeItem('notification');
    }
  }, []);

  return (
    <div className="container mt-4">
        <h1>Admin Dashboard</h1>
        {editProduct && (
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="form-group">
                    <label>{t('product_name')}</label>
                    <input
                        type="text"
                        className="form-control"
                        value={editProduct.productName}
                        onChange={e => setEditProduct({ ...editProduct, productName: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label>{t('description')}</label>
                    <input
                        type="text"
                        className="form-control"
                        value={editProduct.description}
                        onChange={e => setEditProduct({ ...editProduct, description: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label>{t('price')}</label>
                    <input
                        type="number"
                        className="form-control"
                        value={editProduct.price}
                        onChange={e => setEditProduct({ ...editProduct, price: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label>{t('category')}</label>
                    <select
                        className="form-control"
                        value={editProduct.category.id}
                        onChange={e => {
                            const selectedCategory = categories.find(cat => cat.id === Number(e.target.value));
                            setEditProduct({
                                ...editProduct,
                                category: {
                                    id: selectedCategory.id,
                                    name: selectedCategory.name
                                }
                            });
                        }}
                    >
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Save</button>
            </form>
        )}
        {isAdding && (
            <form onSubmit={handleSaveNewProduct} className="mb-4">
                <div className="form-group">
                    <label>{t('product_name')}</label>
                    <input
                        type="text"
                        className="form-control"
                        value={newProduct.productName}
                        onChange={e => setNewProduct({ ...newProduct, productName: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label>{t('description')}</label>
                    <input
                        type="text"
                        className="form-control"
                        value={newProduct.description}
                        onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label>{t('price')}</label>
                    <input
                        type="number"
                        className="form-control"
                        value={newProduct.price}
                        onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                    />
                </div>
                <div className="form-group">
    <label>{t('category')}</label>
    <select
        className="form-control"
        value={newProduct.category.id || (categories.length > 0 ? categories[0].id : '')}
        onChange={e => {
            const selectedCategory = categories.find(cat => cat.id === Number(e.target.value));
            setNewProduct({
                ...newProduct,
                category: {
                    id: selectedCategory?.id,
                    name: selectedCategory?.name
                }
            });
        }}
    >
        {categories.map((category, index) => (
            <option key={category.id} value={category.id}>
                {category.name}
            </option>
        ))}
    </select>
</div>

                <button type="submit" className="btn btn-success">{t('add_product')}</button>
            </form>
        )}
        {!isAdding && (
            <button onClick={handleAdd} className="btn btn-secondary mb-4">
                <i className="fas fa-plus"></i> {t('add_new_product')}
            </button>
        )}
        <div className="mb-4">
            <input
                type="text"
                className="form-control d-inline w-75"
                placeholder="Search by Product ID"
                value={searchId}
                onChange={e => setSearchId(e.target.value)}
            />
            <button onClick={handleSearch} className="btn btn-primary ml-2">
                <i className="fas fa-search"></i> {t('search')}
            </button>
            <button onClick={handleReset} className="btn btn-secondary ml-2">
                <i className="fas fa-redo"></i> {t('reset')}
            </button>
        </div>
        <table className="table">
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
                {products.map(product => (
                    <tr key={product.id}>
                        <td>{product.id}</td>
                        <td>{product.productName}</td>
                        <td>{product.description}</td>
                        <td>{product.price}</td>
                        <td>{product.category.name}</td>
                        <td>
                            <button onClick={() => handleEdit(product)} className="btn btn-warning mr-2">
                                <i className="fas fa-edit"></i> {t('edit')}
                            </button>
                            <button onClick={() => handleDelete(product)} className="btn btn-danger">
                                <i className="fas fa-trash"></i> {t('delete')}
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        <Modal
            isOpen={showDeleteConfirm}
            onRequestClose={() => setShowDeleteConfirm(false)}
            contentLabel="Confirm Delete"
            className="Modal"
            overlayClassName="Overlay"
        >
            <h2>{t('confirm_delete')}</h2>
            <p>{t('are_you_sure_delete')} "{productToDelete?.productName}"?</p>
            <button onClick={confirmDelete} className="btn btn-danger">{t('yes')}</button>
            <button onClick={() => setShowDeleteConfirm(false)} className="btn btn-secondary">{t('no')}</button>
        </Modal>
    </div>
);
};

export default AdminDashboard;