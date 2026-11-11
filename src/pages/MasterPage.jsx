import React from "react";
import { Link } from "react-router-dom";
import SectionTitle from "../components/SectionTitle/SectionTitle";
import About from "../sections/About/About";
import ProfileHighlights from "../sections/ProfileHighlights/ProfileHighlights";
import { heroConfig } from "../data/heroConfig";
import { useLanguage } from "../i18n/LanguageContext";
import "./MasterPage.css";

/**
 * «Про майстра» (TZ step 3). Base content: intro + the About and Highlights
 * sections that used to live on the home page.
 * TODO: уточнити в Ельнари — повна біографія, сертифікати, фото.
 */
export default function MasterPage() {
  const { t } = useLanguage();

  return (
    <div className="master-page">
      <section className="master-intro">
        <div className="master-intro__inner">
          {heroConfig.photo && (
            <div className="master-intro__photo glow">
              <img
                src={heroConfig.photo}
                alt={t("hero.photoAlt")}
                style={{ objectPosition: heroConfig.photoPosition }}
                width="1196"
                height="1327"
              />
            </div>
          )}
          <div className="master-intro__text">
            <SectionTitle
              as="h1"
              align="left"
              eyebrow={t("master.eyebrow")}
              title={t("master.title")}
              subtitle={t("master.intro")}
            />
            <div className="master-intro__actions">
              <Link to="/booking" className="btn btn--primary">{t("master.book")}</Link>
              <Link to="/prices" className="btn btn--secondary">{t("master.prices")}</Link>
            </div>
          </div>
        </div>
      </section>

      <About />
      <ProfileHighlights />
    </div>
  );
}
