import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next'; 
import i18n from './i18n'; 
import AuthProvider from './contexts/AuthContext';

import AdminDashboard from './components/AdminDashboard';
import Navbar from './components/Navbar';
import AddCategory from './components/AddCategory';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import CartPage from './components/CartPage';
import Home from './components/Home';
import LandingPage from './components/LandingPage'; 
import PurchasePage from './components/PurchasePage'; 
import CategoriesDashboard from './components/CategoryDashboard';
import InvoicesPage from './components/InvoicesPage';
import ProtectedRoute from './components/ProtectedRoute'; 
import AuthenticatedRoute from './components/AuthenticatedRoute';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <AuthProvider> {}
      <I18nextProvider i18n={i18n}>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/add-category" element={<ProtectedRoute><AddCategory /></ProtectedRoute>} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/cart" element={<AuthenticatedRoute><CartPage /></AuthenticatedRoute>} />
            <Route path="/purchase" element={<AuthenticatedRoute><PurchasePage /></AuthenticatedRoute>} />
            <Route path="/category" element={<ProtectedRoute><CategoriesDashboard /></ProtectedRoute>} />
            <Route path="/invoices" element={<ProtectedRoute><InvoicesPage /></ProtectedRoute>} />
          </Routes>
        </Router>
      </I18nextProvider>
    </AuthProvider>
  );
}

export default App;
