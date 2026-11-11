import React from "react";
import "./SectionTitle.css";

/**
 * Section heading: optional eyebrow, uppercase serif title with a soft gold
 * glow behind it, a gold line with a diamond in the middle, optional subtitle.
 */
export default function SectionTitle({
  eyebrow,
  title,
  subtitle,
  as = "h2",
  align = "center",
  className = "",
}) {
  return (
    <header className={`stitle stitle--${align} ${className}`.trim()}>
      {eyebrow && <span className="stitle__eyebrow">{eyebrow}</span>}
      {React.createElement(as, { className: "stitle__heading" }, title)}
      <span className="stitle__divider" aria-hidden="true">
        <span className="stitle__diamond" />
      </span>
      {subtitle && <p className="stitle__subtitle">{subtitle}</p>}
    </header>
  );
}
