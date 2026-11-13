import React from "react";
import { Link } from "react-router-dom";
import Counter from "../../components/Counter/Counter";
import { heroConfig } from "../../data/heroConfig";
import { useLanguage } from "../../i18n/LanguageContext";
import "./MasterHero.css";

/**
 * First screen of the home page (TZ step 2): on the left her title, signature
 * name, a short intro, three animated counters and the two main actions; on
 * the right a large cut-out photo of Elnara with her brushes on a soft gold
 * glow.
 */
export default function MasterHero() {
  const { t } = useLanguage();
  const { photo, counters, countDuration, servicesSectionId } = heroConfig;
  const name = t("hero.name");

  const scrollToServices = () => {
    const target = document.getElementById(servicesSectionId);
    if (!target) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    // Land just below the fixed navbar, whatever its current height.
    const navHeight = document.querySelector(".navbar")?.getBoundingClientRect().height ?? 0;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top, behavior: reduce ? "instant" : "smooth" });
  };

  return (
    <section className="mhero" aria-labelledby="mhero-name">
      <div className="mhero__inner">
        <div className="mhero__content">
          <p className="mhero__eyebrow">{t("hero.eyebrow")}</p>

          <h1 className="mhero__name" id="mhero-name">
            <span className="mhero__corner mhero__corner--tl" aria-hidden="true" />
            <span className="mhero__corner mhero__corner--br" aria-hidden="true" />
            <span className="mhero__sign">{name}</span>
          </h1>

          <p className="mhero__about">{t("hero.about")}</p>

          <div className="mhero__stats" role="list" aria-label={t("hero.stats")}>
            {counters.map((counter) => (
              <div className="mhero__stat" role="listitem" key={counter.id}>
                <Counter
                  value={counter.value}
                  suffix={counter.suffix}
                  duration={countDuration}
                  label={t(`hero.${counter.id}`)}
                />
              </div>
            ))}
          </div>

          <div className="mhero__actions">
            <Link to="/booking" className="btn btn--primary">
              {t("hero.book")}
            </Link>
            <button type="button" className="btn btn--secondary" onClick={scrollToServices}>
              {t("hero.services")}
            </button>
          </div>
        </div>
        <div className="mhero__media">
          <span className="mhero__glow" aria-hidden="true" />
          {photo ? (
            <img
              className="mhero__photo"
              src={photo}
              alt={t("hero.photoAlt")}
              width="655"
              height="1094"
              fetchPriority="high"
            />
          ) : (
            // TODO: уточнити в Ельнари — фото (src/data/heroConfig.js → photo)
            <div className="mhero__placeholder" aria-hidden="true">
              <span className="mhero__monogram">{name.charAt(0)}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
