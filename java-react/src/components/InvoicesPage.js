import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faRedo, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';


const InvoicesPage = () => {
    const { t, i18n } = useTranslation();
    const [invoices, setInvoices] = useState([]);
    const [filteredInvoices, setFilteredInvoices] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedInvoice, setExpandedInvoice] = useState(null);

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.get('http://localhost:8080/invoices', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setInvoices(response.data);
            setFilteredInvoices(response.data);
        } catch (error) {
            console.error(t('error_fetching_invoices'), error);
        }
    };

    const handleSearch = (e) => {
        const search = e.target.value;
        setSearchTerm(search);
        if (search) {
            const filtered = invoices.filter(invoice => invoice.id.toString().includes(search));
            setFilteredInvoices(filtered);
        } else {
            setFilteredInvoices(invoices);
        }
    };

    const resetFilters = () => {
        setSearchTerm('');
        setFilteredInvoices(invoices);
    };

    const toggleExpand = (invoiceId) => {
        setExpandedInvoice(expandedInvoice === invoiceId ? null : invoiceId);
    };

    return (
        <div className="container mt-4">
            <h1>{t('inovices')}</h1>
            <div className="row mb-3">
                <div className="col-md-4 mb-2">
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search by Invoice ID"
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
                    <button className="btn btn-secondary btn-block" onClick={resetFilters}>
                        <FontAwesomeIcon icon={faRedo} /> {t('reset')}
                    </button>
                </div>
            </div>

            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>{t('username')}</th>
                        <th>{t('date')}</th>
                        <th>{t('details')}</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredInvoices.length > 0 ? (
                        filteredInvoices.map(invoice => (
                            <React.Fragment key={invoice.id}>
                                <tr>
                                    <td>{invoice.id}</td>
                                    <td>{invoice.user.username}</td>
                                    <td>{new Date(invoice.date).toLocaleString()}</td>
                                    <td>
                                        <button
                                            className="btn btn-link"
                                            onClick={() => toggleExpand(invoice.id)}
                                        >
                                            <FontAwesomeIcon icon={expandedInvoice === invoice.id ? faMinus : faPlus} />
                                        </button>
                                    </td>
                                </tr>
                                {expandedInvoice === invoice.id && (
                                    <tr>
                                        <td colSpan="4">
                                            <div className="alert alert-secondary" role="alert">
                                                <strong>{t('email')}</strong> {invoice.user.email}<br />
                                                <strong>{t('roles')}:</strong> {invoice.user.roles.join(', ')}<br />
                                                <strong>{t('password')}</strong> {invoice.user.password}<br />
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center">{t('no_invoices_found')}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default InvoicesPage;
