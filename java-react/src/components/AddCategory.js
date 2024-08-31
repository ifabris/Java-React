import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/AddCategory.css';
import { useTranslation } from 'react-i18next';

const AddCategory = () => {
  const { t, i18n } = useTranslation();
  const [categoryName, setCategoryName] = useState('');
  const navigate = useNavigate();

  const handleAddCategory = (event) => {
    event.preventDefault();
    const token = localStorage.getItem('jwtToken');
    axios.post('http://localhost:8080/categories', { name: categoryName }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        localStorage.setItem('notification', t('new_category_added'));
        navigate('/admin');
      })
      .catch(error => {
        console.error(t('new_category_added_error'), error);
      });
  };

  return (
    <div>
      <h1>{t('add_new_category')}</h1>
      <form onSubmit={handleAddCategory}>
        <label>
          {t('category_name')}
          <input
            type="text"
            value={categoryName}
            onChange={e => setCategoryName(e.target.value)}
          />
        </label>
        <button type="submit">{t('add_category')}</button>
      </form>
    </div>
  );
};

export default AddCategory;
