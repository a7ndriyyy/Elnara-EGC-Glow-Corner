import React, { useId } from "react";
import { FiClock } from "react-icons/fi";
import { pricingRules } from "../../data/pricingRules";
import { useLanguage } from "../../i18n/LanguageContext";
import { fill } from "../../utils/format";
import "./HoursNotice.css";

/**
 * Working hours & surcharges info block (TZ step 7.1). Hours come from
 * src/data/pricingRules.js so the text always matches the booking logic.
 */
export default function HoursNotice({ className = "" }) {
  const { t } = useLanguage();
  const titleId = useId();
  // "09:00" in config → "9:00" for display.
  const short = (time) => time.replace(/^0(\d)/, "$1");
  const vars = {
    start: short(pricingRules.workingHours.start),
    end: short(pricingRules.workingHours.end),
  };
  const items = ["early", "late", "weekend", "holidays", "homeVisit"];

  return (
    <aside className={`hours-notice ${className}`.trim()} aria-labelledby={titleId}>
      <span className="hours-notice__icon" aria-hidden="true"><FiClock /></span>
      <div className="hours-notice__body">
        <h2 className="hours-notice__title" id={titleId}>{t("schedule.title")}</h2>
        <p className="hours-notice__hours">{fill(t("schedule.hours"), vars)}</p>
        <ul className="hours-notice__list">
          {items.map((key) => (
            <li key={key}>{fill(t(`schedule.${key}`), vars)}</li>
          ))}
        </ul>
        <p className="hours-notice__note">{t("schedule.note")}</p>
      </div>
    </aside>
  );
}
