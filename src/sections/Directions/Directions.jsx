import React from "react";
import ServiceCard from "../../components/ServiceCard/ServiceCard";
import SectionTitle from "../../components/SectionTitle/SectionTitle";
import { directions } from "../../data/directions";
import { localize } from "../../utils/format";
import { useLanguage } from "../../i18n/LanguageContext";
import "./Directions.css";

// TZ step 4: six main directions; the back of each card lists its sub-directions.
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

        <div className="card-grid directions__grid">
          {directions.map((direction) => {
            const title = localize(direction.title, language);
            return direction.locked ? (
              <ServiceCard
                key={direction.slug}
                title={title}
                image={direction.image}
                imageAlt=""
                locked
                lockedText={t("directions.inDevelopment")}
                to={direction.to}
              />
            ) : (
              <ServiceCard
                key={direction.slug}
                title={title}
                image={direction.image}
                imageAlt=""
                description={localize(direction.intro, language)}
                subdirections={direction.subdirections.map((sub) => localize(sub.title, language))}
                to={direction.to ?? `/directions/${direction.slug}`}
                actionLabel={t("ui.more")}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
