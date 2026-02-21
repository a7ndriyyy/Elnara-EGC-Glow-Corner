import "./Navbar.css";
import { useEffect, useState } from "react";

const navLinks = [
  { id: "treatments", label: "Our treatments", href: "#treatments" },
  { id: "about", label: "About us", href: "#about" },
  { id: "reviews", label: "Reviews", href: "#reviews" },
  { id: "contact", label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // Lock body scroll when menu is open (mobile)
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const closeMenu = () => setOpen(false);

  return (
    <header className="nav">
      <div className="container nav__inner">
        {/* Desktop left */}
        <div className="nav__left">
          <a className="nav__link" href="#treatments">Our treatments</a>
          <a className="nav__link" href="#about">About us</a>
        </div>

        <div className="nav__logo">My Logo</div>

        {/* Desktop right */}
        <div className="nav__right">
          <a className="nav__link" href="#reviews">Reviews</a>
          <a className="nav__link" href="#contact">Contact</a>
          <span className="nav__lang">EN</span>
        </div>

        {/* Burger (Tablet/Phone) */}
        <button
          className={`nav__burger ${open ? "isOpen" : ""}`}
          onClick={() => setOpen((v) => !v)}
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
          type="button"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile overlay */}
      <div
        className={`nav__overlay ${open ? "isOpen" : ""}`}
        onClick={closeMenu}
      />

      {/* Mobile panel */}
      <nav
        id="mobile-menu"
        className={`nav__mobile ${open ? "isOpen" : ""}`}
        aria-hidden={!open}
      >
        <div className="nav__mobileHeader">
          <div className="nav__mobileLogo">My Logo</div>
          <button className="nav__close" onClick={closeMenu} aria-label="Close menu" type="button">
            ✕
          </button>
        </div>

        <div className="nav__mobileLinks">
          {navLinks.map((l) => (
            <a key={l.id} className="nav__mobileLink" href={l.href} onClick={closeMenu}>
              {l.label}
            </a>
          ))}
        </div>

        <div className="nav__mobileFooter">
          <span className="nav__mobileLang">EN</span>
        </div>
      </nav>
    </header>
  );
}