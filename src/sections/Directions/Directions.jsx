import React from "react";
import { Link } from "react-router-dom";
import { FiArrowUpRight, FiLock } from "react-icons/fi";
import SectionTitle from "../../components/SectionTitle/SectionTitle";
import { directions } from "../../data/directions";
import { tempImage } from "../../data/tempImages";
import { localize } from "../../utils/format";
import { useLanguage } from "../../i18n/LanguageContext";
import "../SalonPromo/ServiceMenu.css";
import "./Directions.css";

// Directions without their own photo borrow a temporary one (src/data/tempImages.js).
const fallbackImage = { massage: tempImage("classic-back") };

/**
 * TZ step 4: the main directions as tall full-photo cards (same style as the
 * salon service cards): photo, name centred in capitals and a short list of
 * what is inside. Hover focus: the card lifts, the others dim.
 */
export default function Directions() {
  const { t, language } = useLanguage();

  return (
    <section id="directions" className="directions">
      <div className="directions__inner">
        <SectionTitle
          eyebrow={t("directions.eyebrow")}
          title={t("directions.title")}
          subtitle={t("directions.subtitle")}
        />

        <ul className="scards directions__cards">
          {directions.map((direction) => {
            const title = localize(direction.title, language);
            const image = direction.image ?? fallbackImage[direction.slug] ?? null;
            const list = direction.cardList
              ? localize(direction.cardList, language)
              : direction.subdirections.map((sub) => localize(sub.name ?? sub.title, language));
            const summary = (Array.isArray(list) ? list : []).slice(0, 3).join(" · ");

            return (
              <li key={direction.slug}>
                <Link
                  to={direction.to ?? `/directions/${direction.slug}`}
                  className={`scard${direction.locked ? " scard--locked" : ""}`}
                >
                  <span className={`scard__media${image ? "" : " scard__media--empty"}`}>
                    {image ? (
                      <img src={image} alt="" loading="lazy" decoding="async" />
                    ) : (
                      <span className="scard__initial" aria-hidden="true">{title.charAt(0)}</span>
                    )}
                  </span>
                  <span className="scard__body">
                    <span className="scard__name">{title}</span>
                    {direction.locked ? (
                      <span className="scard__desc"><FiLock aria-hidden="true" /> {t("directions.inDevelopment")}</span>
                    ) : (
                      summary && <span className="scard__meta">{summary}</span>
                    )}
                  </span>
                  <span className="scard__go" aria-hidden="true"><FiArrowUpRight /></span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
