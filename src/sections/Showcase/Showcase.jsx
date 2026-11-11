import React from "react";
import SectionTitle from "../../components/SectionTitle/SectionTitle";
import { useLanguage } from "../../i18n/LanguageContext";
import Gallery from "./Gallery";
import ReviewsSlider from "./ReviewsSlider";
import Faq from "./Faq";
import "./Showcase.css";

/** TZ step 10: one shared block at the very end of the home page — gallery, reviews, FAQ. */
export default function Showcase() {
  const { t } = useLanguage();
  return (
    <section className="showcase" aria-labelledby="showcase-title">
      <div className="showcase__inner">
        <SectionTitle
          eyebrow={t("showcase.eyebrow")}
          title={<span id="showcase-title">{t("showcase.title")}</span>}
        />
        <Gallery />
        <ReviewsSlider />
        <Faq />
      </div>
    </section>
  );
}
