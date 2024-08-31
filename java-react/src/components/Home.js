import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';

class Home extends Component {
    componentDidMount() {
        const { i18n } = this.props;

        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage) {
            i18n.changeLanguage(savedLanguage);
        }
    }

    toggleLanguage = () => {
        const { i18n } = this.props;
        const newLanguage = i18n.language === 'en' ? 'hr' : 'en';
        i18n.changeLanguage(newLanguage);
        localStorage.setItem('language', newLanguage);
    };

    render() {
        const { t } = this.props;

        return (
            <div>
                <button onClick={this.toggleLanguage}>
                    {t('switch_language')}
                </button>
                <h1>{t('welcome')}</h1>
                <h2>{t('app_description')}</h2>
            </div>
        );
    }
}

export default withTranslation()(Home);
