import React from 'react';
import "./Navbar.css";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageContext";
import { FaInstagram, FaFacebook } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

const navLinks = [
  { id: "salon", labelKey: "nav.salonServices", path: "/services" },
  { id: "study", labelKey: "nav.study", path: "/about" },
  { id: "massages", labelKey: "nav.massages", path: "/equipment" },
  { id: "prices", labelKey: "nav.prices", path: "/prices" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { language, setLanguage, t, supportedLanguages } = useLanguage();

  // Lock body scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close on ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const closeMenu = () => setOpen(false);

  // Check if link is active
  const isActive = (path) => {
    if (path.startsWith("/#")) {
      return location.pathname === "/" && location.hash === path.substring(1);
    }
    return location.pathname === path;
  };

  return (
    <header className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar__container">
        {/* Desktop Left Navigation */}
        <nav className="navbar__nav navbar__nav--left">
          <Link 
            to="/services" 
            className={`navbar__link ${isActive("/services") ? "navbar__link--active" : ""}`}
          >
            {t("nav.salonServices")}
          </Link>
          <Link 
            to="/about" 
            className={`navbar__link ${isActive("/about") ? "navbar__link--active" : ""}`}
          >
            {t("nav.study")}
          </Link>
        </nav>

        {/* Logo */}
        <Link to="/" className="navbar__logo" onClick={closeMenu}>
          <span className="navbar__logo-text">Elnara</span>
          <span className="navbar__logo-dot"></span>
        </Link>

        {/* Desktop Right Navigation */}
        <nav className="navbar__nav navbar__nav--right">
          <Link 
            to="/equipment" 
            className={`navbar__link ${isActive("/#reviews") ? "navbar__link--active" : ""}`}
          >
            {t("nav.massages")}
          </Link>
          <Link 
            to="/prices" 
            className={`navbar__link ${isActive("/#contact") ? "navbar__link--active" : ""}`}
          >
            {t("nav.prices")}
          </Link>
          <label className="navbar__language-wrap">
            <span className="navbar__sr-only">{t("nav.language")}</span>
            <select className="navbar__lang-btn navbar__language-select" value={language} onChange={(event) => setLanguage(event.target.value)} aria-label={t("nav.language")}>
              {supportedLanguages.map((code) => <option key={code} value={code}>{code.toUpperCase()}</option>)}
            </select>
          </label>
        </nav>

        {/* Burger Button */}
        <button
          className={`navbar__burger ${open ? "navbar__burger--open" : ""}`}
          onClick={() => setOpen(!open)}
          aria-label={t("nav.menu")}
          aria-expanded={open}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`navbar__mobile ${open ? "navbar__mobile--open" : ""}`}>
        <div className="navbar__mobile-header">
          <Link to="/" className="navbar__mobile-logo" onClick={closeMenu}>
            Elnara
          </Link>
          <button 
            className="navbar__mobile-close" 
            onClick={closeMenu}
            aria-label={t("nav.closeMenu")}
          >
            ✕
          </button>
        </div>

        <nav className="navbar__mobile-nav">
          {navLinks.map((link) => (
            <Link
              key={link.id}
              to={link.path}
              className={`navbar__mobile-link ${isActive(link.path) ? "navbar__mobile-link--active" : ""}`}
              onClick={closeMenu}
            >
              {t(link.labelKey)}
              <svg className="navbar__mobile-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </nav>

        <div className="navbar__mobile-footer">
          <label className="navbar__mobile-lang">
            <span>{t("nav.language")}</span>
            <select value={language} onChange={(event) => setLanguage(event.target.value)} aria-label={t("nav.language")}>
              {supportedLanguages.map((code) => <option key={code} value={code}>{code.toUpperCase()}</option>)}
            </select>
          </label>
          <div className="navbar__mobile-social">
            <span>{t("nav.followUs")}</span>
            <div className="navbar__mobile-social-icons">
              <a href="#" aria-label="Instagram"><FaInstagram aria-hidden="true" /></a>
              <a href="#" aria-label="Facebook"><FaFacebook aria-hidden="true" /></a>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      <div 
        className={`navbar__overlay ${open ? "navbar__overlay--active" : ""}`} 
        onClick={closeMenu}
      />
    </header>
  );
}