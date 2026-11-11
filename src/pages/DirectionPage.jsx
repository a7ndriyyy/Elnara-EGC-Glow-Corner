import React from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import ServiceCard from "../components/ServiceCard/ServiceCard";
import SectionTitle from "../components/SectionTitle/SectionTitle";
import HoursNotice from "../components/HoursNotice/HoursNotice";
import { bookingLink, findDirection } from "../data/directions";
import { formatDuration, localize } from "../utils/format";
import { useLanguage } from "../i18n/LanguageContext";
import "../sections/Directions/Directions.css";

/** /directions/:slug — a direction's sub-directions as ServiceCards (TZ step 4). */
export default function DirectionPage() {
  const { slug } = useParams();
  const { t, language } = useLanguage();
  const direction = findDirection(slug);

  // Directions with their own page (training) redirect there, locked or not.
  if (direction?.to) return <Navigate to={direction.to} replace />;

  const backLink = (
    <Link to="/" state={{ scrollTo: "directions" }} className="direction-page__back">
      <FiArrowLeft aria-hidden="true" /> {t("directions.back")}
    </Link>
  );

  if (!direction) {
    return (
      <section className="direction-page">
        <div className="direction-page__inner">
          {backLink}
          <p className="direction-page__empty">{t("directions.notFound")}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="direction-page">
      <div className="direction-page__inner">
        {backLink}
        <SectionTitle
          as="h1"
          eyebrow={t("directions.pageEyebrow")}
          title={localize(direction.title, language)}
          subtitle={localize(direction.intro, language)}
        />

        <div className="card-grid card-grid--4">
          {direction.subdirections.map((sub) => (
            <ServiceCard
              key={sub.slug}
              title={localize(sub.title, language)}
              image={sub.image}
              imageAlt=""
              description={localize(sub.description, language)}
              duration={formatDuration(sub.duration, language)}
              priceFrom={sub.priceFrom}
              to={sub.to || bookingLink(sub)}
              actionLabel={sub.to ? t("ui.more") : t("ui.book")}
              headingLevel={2}
            />
          ))}
        </div>

        {/* Години роботи та доплати (TZ step 7) */}
        <HoursNotice />
      </div>
    </section>
  );
}
