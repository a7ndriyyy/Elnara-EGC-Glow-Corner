
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__copy">
          © {new Date().getFullYear()} Elnara
        </div>

        <Link to="/admin-login" className="footer__professional">
          Espace professionnel
        </Link>
      </div>
    </footer>
  );
}
