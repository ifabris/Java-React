import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';

const CategoriesDashboard = () => {
    const { t, i18n } = useTranslation();
    const [categories, setCategories] = useState([]);
    const [categoryName, setCategoryName] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [categoryId, setCategoryId] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchCategories = () => {
        const token = localStorage.getItem('jwtToken');
        axios.get('http://localhost:8080/categories', {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => setCategories(response.data))
        .catch(error => console.error(t('error_fetching_categories'), error));
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAddCategory = async () => {
        const token = localStorage.getItem('jwtToken');
        if (!categoryName) {
            setError(t('category_name_empty'));
            return;
        }
        setError('');
        setSuccess('');

        try {
            await axios.post('http://localhost:8080/categories', { name: categoryName }, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
            });
            setSuccess(t('new_category_added'));
            setCategoryName('');
            fetchCategories();
        } catch (err) {
            setError(t('new_category_added_error'));
        }
    };

    const handleEditCategory = async () => {
        const token = localStorage.getItem('jwtToken');
        if (!categoryName) {
            setError(t('category_name_empty'));
            return;
        }
        setError('');
        setSuccess('');

        try {
            await axios.put(`http://localhost:8080/categories/${categoryId}`, { name: categoryName }, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
            });
            setSuccess(t('category_update_success'));
            setCategoryName('');
            setEditMode(false);
            setCategoryId(null);
            fetchCategories();
        } catch (err) {
            setError(t('error_updating_category'));
        }
    };

    const handleDeleteCategory = async (id) => {
        const token = localStorage.getItem('jwtToken');
        try {
            await axios.delete(`http://localhost:8080/categories/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuccess(t('category_delete_success'));
            fetchCategories();
        } catch (err) {
            setError(t('error_deleting_category'));
        }
    };

    const startEditCategory = (category) => {
        setEditMode(true);
        setCategoryName(category.name);
        setCategoryId(category.id);
    };

    const resetForm = () => {
        setEditMode(false);
        setCategoryName('');
        setCategoryId(null);
        setError('');
        setSuccess('');
    };

    return (
        <div className="container mt-5">
            <h2>{t('categoryDashboard')}</h2>
            <div className="row">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            {editMode ? t('edit_category') : t('add_category')}
                        </div>
                        <div className="card-body">
                            <div className="form-group">
                                <label htmlFor="categoryName">{t('category_name')}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="categoryName"
                                    value={categoryName}
                                    onChange={(e) => setCategoryName(e.target.value)}
                                    required
                                />
                            </div>
                            <button
                                className={`btn ${editMode ? 'btn-warning' : 'btn-primary'} mt-3`}
                                onClick={editMode ? handleEditCategory : handleAddCategory}
                            >
                                <FontAwesomeIcon icon={editMode ? faEdit : faPlus} /> {editMode ? t('update_category') : t('add_category')}
                            </button>
                            {editMode && (
                                <button
                                    className="btn btn-secondary mt-3 ml-3"
                                    onClick={resetForm}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>
                    {error && <div className="alert alert-danger mt-3">{error}</div>}
                    {success && <div className="alert alert-success mt-3">{success}</div>}
                </div>
                <div className="col-md-6">
                    <table className="table table-bordered mt-3">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>{t('name')}</th>
                                <th>{t('action')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.length > 0 ? (
                                categories.map(category => (
                                    <tr key={category.id}>
                                        <td>{category.id}</td>
                                        <td>{category.name}</td>
                                        <td>
                                            <button
                                                className="btn btn-warning btn-sm mr-2"
                                                onClick={() => startEditCategory(category)}
                                            >
                                                <FontAwesomeIcon icon={faEdit} /> {t('edit')}
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDeleteCategory(category.id)}
                                            >
                                                <FontAwesomeIcon icon={faTrash} /> {t('delete')}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center">{t('no_categories_found')}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CategoriesDashboard;
