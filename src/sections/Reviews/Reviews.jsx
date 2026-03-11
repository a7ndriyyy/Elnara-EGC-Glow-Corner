import { useEffect, useState, useRef, useCallback } from "react";
import { FaStar, FaRegStar, FaQuoteRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { reviewsData } from "../../data/reviews";
import "./Reviews.css";

function Stars({ value = 0 }) {
  return (
    <div className="reviews__stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={`reviews__star ${i < value ? 'filled' : ''}`}>
          {i < value ? <FaStar /> : <FaRegStar />}
        </span>
      ))}
    </div>
  );
}

export default function Reviews() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState('next');
  const [isAnimating, setIsAnimating] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [particles, setParticles] = useState([]); // ← ОСЬ ЦЕ ДОДАЙ!
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  
  const items = reviewsData.reviews;
  const current = items[active];

  // Генерація частинок
  useEffect(() => {
    const timer = setTimeout(() => {
      const generated = Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: `${8 + Math.random() * 20}s`,
        delay: `${Math.random() * 5}s`,
        size: `${2 + Math.random() * 6}px`,
        opacity: 0.1 + Math.random() * 0.3,
      }));
      setParticles(generated);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Ефект для відстеження миші
  const handleMouseMove = useCallback((e) => {
    if (sectionRef.current) {
      const rect = sectionRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      setMousePosition({
        x: Math.min(100, Math.max(0, x)),
        y: Math.min(100, Math.max(0, y))
      });
    }
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  // Навігація з анімацією
  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection('next');
    setActive((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection('prev');
    setActive((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleDotClick = (idx) => {
    if (isAnimating || idx === active) return;
    setIsAnimating(true);
    setDirection(idx > active ? 'next' : 'prev');
    setActive(idx);
  };

  // Скидання анімації
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [active]);

  return (
 <section id="reviews" className="reviews" ref={sectionRef}>
      {/* Фон з частинками */}
      <div className="reviews__background">
        <div 
          className="reviews__gradient"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
              rgba(201, 162, 126, 0.1) 0%, 
              rgba(248, 244, 240, 0.98) 70%)`
          }}
        />
        <div className="reviews__particles">
          {particles.map((p) => (
            <span
              key={p.id}
              className="reviews__particle"
              style={{
                left: p.left,
                top: p.top,
                width: p.size,
                height: p.size,
                animationDuration: p.duration,
                animationDelay: p.delay,
              }}
            />
          ))}
        </div>
      </div>

      {/* Декоративні елементи */}
      <div className="reviews__decor">
        <div className="reviews__decor-circle"></div>
        <div className="reviews__decor-line"></div>
      </div>

      <div className="container reviews__container">
        {/* Заголовок секції */}
        <div className="reviews__header">
          <span className="reviews__subtitle">
            <FaQuoteRight className="reviews__subtitle-icon" />
            {reviewsData.subtitle}
          </span>
          <h2 className="reviews__title">{reviewsData.title}</h2>
        </div>

        <div className="reviews__grid">
          {/* Медіа частина */}
          <div className="reviews__media">
            <div className="reviews__media-inner">
              <img
                className="reviews__bg"
                src={reviewsData.backgroundImage}
                alt="Reviews background"
              />
              <div className="reviews__bg-overlay"></div>
              
              {/* Аватар з анімацією */}
              <div 
                className={`reviews__avatar-wrapper ${direction} ${isAnimating ? 'animating' : ''}`}
              >
                <img 
                  className="reviews__avatar" 
                  src={current.avatar} 
                  alt={current.name}
                />
                <div className="reviews__avatar-glow"></div>
              </div>

              {/* Інформація про послугу */}
              <div className="reviews__service-badge">
                <span>{current.service}</span>
              </div>
            </div>
          </div>

          {/* Контент частина */}
          <div className="reviews__content-wrapper">
            <div 
              className={`reviews__content ${direction} ${isAnimating ? 'animating' : ''}`}
              ref={contentRef}
            >
              {/* Іконка лапок */}
              <div className="reviews__quote-icon">
                <FaQuoteRight />
              </div>

              {/* Ім'я та рейтинг */}
              <div className="reviews__info">
                <h3 className="reviews__name">{current.name}</h3>
                <Stars value={current.rating} />
              </div>

              {/* Текст відгуку */}
              <p className="reviews__text">“{current.text}”</p>

              {/* Дата */}
              <div className="reviews__date">{current.date}</div>

              {/* Декоративна лінія */}
              <div className="reviews__line"></div>
            </div>

            {/* Навігація */}
            <div className="reviews__navigation">
              {/* Стрілки */}
              <div className="reviews__arrows">
                <button 
                  className="reviews__arrow reviews__arrow--prev" 
                  onClick={handlePrev}
                  disabled={isAnimating}
                  aria-label="Previous review"
                >
                  <FaChevronLeft />
                  <span className="reviews__arrow-glow"></span>
                </button>
                <button 
                  className="reviews__arrow reviews__arrow--next" 
                  onClick={handleNext}
                  disabled={isAnimating}
                  aria-label="Next review"
                >
                  <FaChevronRight />
                  <span className="reviews__arrow-glow"></span>
                </button>
              </div>

              {/* Точки */}
              <div className="reviews__dots" aria-label="Review navigation">
                {items.map((r, idx) => (
                  <button
                    key={r.id}
                    className={`reviews__dot ${idx === active ? 'active' : ''}`}
                    onClick={() => handleDotClick(idx)}
                    disabled={isAnimating}
                    aria-label={`Go to review ${idx + 1}`}
                  >
                    <span className="reviews__dot-inner"></span>
                  </button>
                ))}
              </div>

              {/* Лічильник */}
              <div className="reviews__counter">
                <span className="reviews__counter-current">{String(active + 1).padStart(2, '0')}</span>
                <span className="reviews__counter-separator">/</span>
                <span className="reviews__counter-total">{String(items.length).padStart(2, '0')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
 