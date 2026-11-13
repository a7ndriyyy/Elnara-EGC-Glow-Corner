import React, { useRef } from "react";
import { FaStar, FaRegStar, FaQuoteRight } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { reviews } from "../../data/reviews";
import { priceItem } from "../../data/priceList";
import { useLanguage } from "../../i18n/LanguageContext";
import { fill, formatMonth, localize } from "../../utils/format";

/**
 * TZ 10.2 — review cards in a horizontal slider: native swipe/scroll on touch
 * screens (scroll-snap), arrow buttons on desktop. Gold stars, name, text and
 * an optional photo of the work (`photo` in src/data/reviews.js).
 */
export default function ReviewsSlider() {
  const { t, language } = useLanguage();
  const track = useRef(null);
  if (reviews.length === 0) return null;

  const scroll = (dir) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector(".review-card");
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    el.scrollBy({ left: dir * ((card?.offsetWidth || 300) + gap), behavior: "smooth" });
  };

  return (
    <div className="showcase__part" id="reviews">
      <div className="showcase__heading-row">
        <h3 className="showcase__heading">{t("showcase.reviewsTitle")}</h3>
        {reviews.length > 1 && (
          <div className="showcase__arrows">
            <button type="button" onClick={() => scroll(-1)} aria-label={t("showcase.prevReview")}>
              <FiChevronLeft aria-hidden="true" />
            </button>
            <button type="button" onClick={() => scroll(1)} aria-label={t("showcase.nextReview")}>
              <FiChevronRight aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      <ul className="reviews-track" ref={track}>
        {reviews.map((review) => (
          <li key={review.id} className="review-card">
            {review.photo && <img className="review-card__photo" src={review.photo} alt="" loading="lazy" />}
            <div className="review-card__stars" role="img" aria-label={fill(t("showcase.rating"), { n: review.rating })}>
              {Array.from({ length: 5 }, (_, i) =>
                i < review.rating ? <FaStar key={i} aria-hidden="true" /> : <FaRegStar key={i} aria-hidden="true" />,
              )}
            </div>
            <FaQuoteRight className="review-card__quote" aria-hidden="true" />
            <blockquote className="review-card__text">
              {localize(review.text, language)}
            </blockquote>
            <footer className="review-card__footer">
              <strong>{review.name}</strong>
              <span>
                {[localize(priceItem(review.serviceId)?.name, language), formatMonth(review.date, language)]
                  .filter(Boolean)
                  .join(" · ")}
              </span>
            </footer>
          </li>
        ))}
      </ul>
    </div>
  );
}
