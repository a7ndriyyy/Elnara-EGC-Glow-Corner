
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { useLanguage } from '../../i18n/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__copy">
          © {new Date().getFullYear()} Elnara
        </div>

        <Link to="/admin-login" className="footer__professional">
          {t('nav.professional')}
        </Link>
      </div>
    </footer>
  );
}
