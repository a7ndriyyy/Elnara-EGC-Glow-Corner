import React from 'react';
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__copy">© {new Date().getFullYear()} Elnara</div>
      </div>
    </footer>
  );
}