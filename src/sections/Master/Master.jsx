import React from "react";
import { Link } from "react-router-dom";
import { masterPhotos } from "../../data/master";
import { heroConfig } from "../../data/heroConfig";
import { useLanguage } from "../../i18n/LanguageContext";
import { localize } from "../../utils/format";
import "./Master.css";

const STAMP_TEXT = "ELNARA • PERMANENT MAKEUP • PARIS • ";

/**
 * Home "Майстер" block, editorial style: a huge faint signature behind,
 * the main photo in a gold-outlined arch with a turning stamp and an
 * experience badge, numbered skills, and a photo reel underneath whose
 * panels widen on hover.
 */
export default function Master() {
  const { t, language } = useLanguage();
  const { main, more } = masterPhotos;
  const skills = t("master.skills");
  const years = heroConfig.counters.find((c) => c.id === "years");

  return (
    <section id="master" className="master" aria-labelledby="master-title">
      <span className="master__watermark" aria-hidden="true">{t("master.title")}</span>

      <div className="master__inner">
        <div className="master__visual">
          <span className="master__outline" aria-hidden="true" />
          <figure className="master__main">
            <img src={main.src} alt={localize(main.alt, language)} loading="lazy" decoding="async" />
          </figure>

          {/* turning round stamp */}
          <svg className="master__stamp" viewBox="0 0 120 120" aria-hidden="true">
            <defs>
              <path id="master-stamp-path" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
            </defs>
            <text>
              <textPath href="#master-stamp-path" textLength="288">{STAMP_TEXT}</textPath>
            </text>
            <circle cx="60" cy="60" r="5" />
          </svg>

          {years && (
            <div className="master__badge">
              <strong>{years.value}{years.suffix}</strong>
              <span>{t("hero.years")}</span>
            </div>
          )}
        </div>

        <div className="master__body">
          <p className="master__eyebrow">{t("master.eyebrow")}</p>
          <h2 className="master__title" id="master-title">{t("master.title")}</h2>
          {/* TODO: уточнити в Ельнари — її розповідь про себе (досвід, підхід, навчання) */}
          <p className="master__intro">{t("master.intro")}</p>

          {Array.isArray(skills) && (
            <ol className="master__skills">
              {skills.map((skill, i) => (
                <li key={skill}>
                  <span className="master__num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="master__skill">{skill}</span>
                </li>
              ))}
            </ol>
          )}

          <div className="master__actions">
            <Link to="/booking" className="btn btn--primary">{t("master.book")}</Link>
            <a href="#gallery" className="btn btn--outline">{t("master.works")}</a>
          </div>
        </div>
      </div>

      {/* photo reel: the hovered panel widens, the others narrow */}
      <ul className="master__reel">
        {more.map((photo) => (
          <li key={photo.src} className="master__panel">
            <img src={photo.src} alt={localize(photo.alt, language)} loading="lazy" decoding="async" />
            {photo.caption && <span className="master__caption">{photo.caption}</span>}
          </li>
        ))}
      </ul>
    </section>
  );
}
