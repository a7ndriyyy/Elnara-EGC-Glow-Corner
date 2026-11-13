import React from "react";
import { Link } from "react-router-dom";
import SectionTitle from "../../components/SectionTitle/SectionTitle";
import { masterPhotos } from "../../data/master";
import { useLanguage } from "../../i18n/LanguageContext";
import { localize } from "../../utils/format";
import "./Master.css";

/** Home "Майстер" block: Elnara's photos, a short intro and two actions. */
export default function Master() {
  const { t, language } = useLanguage();
  const { main, more } = masterPhotos;
  const skills = t("master.skills");

  return (
    <section id="master" className="master" aria-labelledby="master-title">
      <div className="master__inner">
        <figure className="master__main">
          <img src={main.src} alt={localize(main.alt, language)} loading="lazy" decoding="async" />
        </figure>

        <div className="master__body">
          <SectionTitle align="left" eyebrow={t("master.eyebrow")} title={<span id="master-title">{t("master.title")}</span>} />
          {/* TODO: уточнити в Ельнари — її розповідь про себе (досвід, підхід, навчання) */}
          <p className="master__intro">{t("master.intro")}</p>
          {Array.isArray(skills) && (
            <ul className="master__skills">
              {skills.map((skill) => <li key={skill}>{skill}</li>)}
            </ul>
          )}
          <div className="master__actions">
            <Link to="/booking" className="btn btn--primary">{t("master.book")}</Link>
            <a href="#gallery" className="btn btn--outline">{t("master.works")}</a>
          </div>

          <ul className="master__more">
            {more.map((photo) => (
              <li key={photo.src}>
                <figure>
                  <img src={photo.src} alt={localize(photo.alt, language)} loading="lazy" decoding="async" />
                  {photo.caption && <figcaption>{photo.caption}</figcaption>}
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
