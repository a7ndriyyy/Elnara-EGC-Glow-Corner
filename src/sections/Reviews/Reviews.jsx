import "./Reviews.css";
import { useMemo, useState } from "react";
import { reviewsData } from "../../data/reviews";

function Stars({ value = 0 }) {
  const stars = useMemo(() => {
    return Array.from({ length: 5 }).map((_, i) => (i < value ? "★" : "☆"));
  }, [value]);

  return <div className="reviews__stars">{stars.join(" ")}</div>;
}

export default function Reviews() {
  const [active, setActive] = useState(0);
  const items = reviewsData.reviews;
  const current = items[active];

  return (
    <section id="reviews" className="reviews">
      <div className="container reviews__wrap">
        <div className="reviews__media">
          <img
            className="reviews__bg"
            src={reviewsData.backgroundImage}
            alt="Reviews background"
          />
          <img className="reviews__avatar" src={current.avatar} alt={current.name} />
        </div>

        <div className="reviews__content">
          <h2 className="reviews__title">Reviews</h2>

          <div className="reviews__name">{current.name}</div>
          <Stars value={current.rating} />
          <p className="reviews__text">“{current.text}”</p>

          <div className="reviews__dots" aria-label="Review navigation">
            {items.map((r, idx) => (
              <button
                key={r.id}
                className={`reviews__dot ${idx === active ? "isActive" : ""}`}
                onClick={() => setActive(idx)}
                aria-label={`Go to review ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}