import "./Navbar.css";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { id: "treatments", label: "Our treatments", path: "/services" },
  { id: "about", label: "About us", path: "/about" },
  { id: "reviews", label: "Reviews", path: "/#reviews" },
  { id: "contact", label: "Contact", path: "/#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

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
            Salon Services
          </Link>
          <Link 
            to="/about" 
            className={`navbar__link ${isActive("/about") ? "navbar__link--active" : ""}`}
          >
            Study with us
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
            to="/#reviews" 
            className={`navbar__link ${isActive("/#reviews") ? "navbar__link--active" : ""}`}
          >
            Reviews
          </Link>
          <Link 
            to="/#contact" 
            className={`navbar__link ${isActive("/#contact") ? "navbar__link--active" : ""}`}
          >
            Contact
          </Link>
          <button className="navbar__lang-btn">
            EN
            <svg className="navbar__lang-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </nav>

        {/* Burger Button */}
        <button
          className={`navbar__burger ${open ? "navbar__burger--open" : ""}`}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
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
            aria-label="Close menu"
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
              {link.label}
              <svg className="navbar__mobile-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </nav>

        <div className="navbar__mobile-footer">
          <button className="navbar__mobile-lang">
            <span>EN</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
          </button>
          <div className="navbar__mobile-social">
            <span>Follow us</span>
            <div className="navbar__mobile-social-icons">
              <a href="#" aria-label="Instagram">📷</a>
              <a href="#" aria-label="Facebook">📘</a>
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