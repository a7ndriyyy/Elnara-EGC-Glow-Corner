import React from "react";
import Counter from "../../components/Counter/Counter";
import { heroConfig } from "../../data/heroConfig";
import { useLanguage } from "../../i18n/LanguageContext";
import "./SalonPromo.css";

const img = (path) => `${import.meta.env.BASE_URL}Images/${path}`;

/** Light that follows the cursor inside a tile (CSS reads --mx / --my). */
const trackLight = (event) => {
  const box = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty("--mx", `${event.clientX - box.left}px`);
  event.currentTarget.style.setProperty("--my", `${event.clientY - box.top}px`);
};

/**
 * "Why Elnara" on the salon services page: a running strip of her services
 * and a bento grid of real facts (years and certificates come from the hero
 * counters, so the numbers match everywhere). Numbers count up, tiles slide
 * in one after another when the section is revealed, and a soft gold light
 * follows the cursor.
 */
export default function SalonHighlights() {
  const { t } = useLanguage();
  const counter = (id) => heroConfig.counters.find((c) => c.id === id);
  const years = counter("years");
  const certificates = counter("certificates");
  const ticker = t("salonPromo.ticker");
  const words = Array.isArray(ticker) ? ticker : [];

  return (
    <section className="why" aria-labelledby="why-title">
      {words.length > 0 && (
        <div className="why__ticker" aria-hidden="true">
          <div className="why__ticker-track">
            {[0, 1].map((copy) => (
              <span key={copy} className="why__ticker-group">
                {words.map((word) => (
                  <span key={word} className="why__ticker-item">{word}<i>✦</i></span>
                ))}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="why__inner">
        <header className="why__head">
          <p className="why__eyebrow">{t("salonPromo.eyebrow")}</p>
          <h2 id="why-title" className="why__title">{t("salonPromo.title")}</h2>
        </header>

        <div className="why__grid">
          <article className="why__tile why__tile--hero" onMouseMove={trackLight}>
            <img className="why__photo" src={img("Master/elnara-brush.jpg")} alt="" loading="lazy" decoding="async" />
            <div className="why__tile-body">
              <Counter className="why__value" value={years.value} suffix={years.suffix} duration={1800} label="" />
              <h3>{t("salonPromo.yearsTitle")}</h3>
              <p>{t("salonPromo.yearsText")}</p>
            </div>
          </article>

          <article className="why__tile" onMouseMove={trackLight}>
            <Counter className="why__value" value={certificates.value} suffix={certificates.suffix} duration={1800} label="" />
            <h3>{t("salonPromo.certTitle")}</h3>
            <p>{t("salonPromo.certText")}</p>
          </article>

          <article className="why__tile" onMouseMove={trackLight}>
            <span className="why__value why__value--text">2026</span>
            <h3>{t("salonPromo.wulopTitle")}</h3>
            <p>{t("salonPromo.wulopText")}</p>
          </article>

          <article className="why__tile why__tile--wide" onMouseMove={trackLight}>
            <span className="why__value why__value--word">{t("salonPromo.cleanWord")}</span>
            <div>
              <h3>{t("salonPromo.cleanTitle")}</h3>
              <p>{t("salonPromo.cleanText")}</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
