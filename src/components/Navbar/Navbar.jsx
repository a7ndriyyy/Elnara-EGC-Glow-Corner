import "./Navbar.css";

export default function Navbar() {
  return (
    <header className="nav">
      <div className="container nav__inner">
        <a className="nav__link" href="#treatments">Our treatments</a>
        <a className="nav__link" href="#about">About us</a>

        <div className="nav__logo">My Logo</div>

        <a className="nav__link" href="#reviews">Reviews</a>
        <a className="nav__link" href="#contact">Contact</a>

        <div className="nav__lang">EN</div>
      </div>
    </header>
  );
}