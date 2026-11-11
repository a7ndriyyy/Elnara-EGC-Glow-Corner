import React, { useCallback, useId, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiClock, FiRotateCw, FiLock } from "react-icons/fi";
import { useLanguage } from "../../i18n/LanguageContext";
import "./ServiceCard.css";

const canHover = () =>
  typeof window !== "undefined" && window.matchMedia?.("(hover: hover)").matches;

/**
 * Flip card used for every service / direction on the site.
 *
 * Front: full-bleed photo + title plate with a rotate icon.
 * Back:  title, short description, duration, "from … €" price and a CTA —
 *        or, for directions, a list of sub-directions + "Learn more".
 *
 * Desktop (hover: hover) flips on hover; touch devices flip on tap; keyboard
 * users flip with Enter / Space. With prefers-reduced-motion the sides
 * crossfade instead of rotating.
 */
export default function ServiceCard({
  title,
  image,
  imageAlt,
  description,
  duration,
  priceFrom,
  price,
  subdirections,
  to,
  onAction,
  actionLabel,
  badge,
  locked = false,
  lockedText,
  className = "",
  headingLevel = 3,
}) {
  const { t } = useLanguage();
  const titleId = useId();
  const hintId = useId();
  const Heading = `h${headingLevel}`;
  const [flipped, setFlipped] = useState(false);

  const hasSubdirections = Array.isArray(subdirections) && subdirections.length > 0;
  const label = actionLabel || (hasSubdirections ? t("ui.more") : t("ui.book"));
  const priceText =
    price ?? (priceFrom !== undefined && priceFrom !== null && priceFrom !== ""
      ? t("ui.priceFrom").replace("{price}", priceFrom)
      : null);

  const navigate = useNavigate();
  // A locked card with a link (e.g. Training → "in development" page) opens it instead of flipping.
  const lockedLink = locked && to;

  const toggle = useCallback(() => {
    if (!locked) setFlipped((value) => !value);
  }, [locked]);

  const handleClick = (event) => {
    if (lockedLink) {
      navigate(to);
      return;
    }
    // The CTA handles its own click; anything else on the card flips it.
    if (event.target.closest(".svc-card__action")) return;
    // Pointer devices already flip on hover, a click would make it "stick".
    if (canHover() && event.detail !== 0) return;
    toggle();
  };

  const handleKeyDown = (event) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (lockedLink) navigate(to);
      else toggle();
    }
  };

  const actionProps = {
    className: "btn btn--secondary svc-card__action",
    tabIndex: flipped ? 0 : -1,
  };

  const action = to ? (
    <Link to={to} {...actionProps}>{label}</Link>
  ) : onAction ? (
    <button type="button" {...actionProps} onClick={onAction}>{label}</button>
  ) : null;

  return (
    <div
      className={`svc-card${flipped ? " is-flipped" : ""}${locked ? " is-locked" : ""}${lockedLink ? " is-linked" : ""} ${className}`.trim()}
      tabIndex={0}
      role={lockedLink ? "link" : "button"}
      aria-pressed={locked ? undefined : flipped}
      aria-labelledby={titleId}
      aria-describedby={hintId}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <span id={hintId} className="sr-only">
        {locked ? lockedText || t("ui.soon") : flipped ? t("ui.flipBack") : t("ui.flip")}
      </span>
      <div className="svc-card__inner">
        <div className="svc-card__face svc-card__front" aria-hidden={flipped}>
          {image ? (
            <img className="svc-card__img" src={image} alt={imageAlt ?? title} loading="lazy" />
          ) : (
            // No photo yet: decorative gold initial instead of an empty box.
            <div className="svc-card__img svc-card__img--placeholder" aria-hidden="true">
              <span className="svc-card__ph-ring">
                <span className="svc-card__ph-letter">{title?.charAt(0)}</span>
              </span>
            </div>
          )}
          {badge && <span className="svc-card__badge">{badge}</span>}
          {locked && (
            <span className="svc-card__lock" aria-hidden="true"><FiLock /></span>
          )}
          <div className="svc-card__plate">
            <Heading className="svc-card__title" id={titleId}>{title}</Heading>
            {locked ? (
              <span className="svc-card__plate-note">{lockedText || t("ui.soon")}</span>
            ) : (
              <FiRotateCw className="svc-card__flip-icon" aria-hidden="true" />
            )}
          </div>
        </div>

        {!locked && (
          <div className="svc-card__face svc-card__back" aria-hidden={!flipped}>
            <Heading className="svc-card__title svc-card__title--back" aria-hidden="true">{title}</Heading>
            {description && <p className="svc-card__desc">{description}</p>}

            {hasSubdirections ? (
              <ul className="svc-card__subs">
                {subdirections.map((item) => (
                  <li key={typeof item === "string" ? item : item.title}>
                    {typeof item === "string" ? item : item.title}
                  </li>
                ))}
              </ul>
            ) : (duration || priceText) && (
              <div className="svc-card__meta">
                {duration && (
                  <span className="svc-card__duration">
                    <FiClock aria-hidden="true" />
                    <span className="sr-only">{t("ui.duration")}: </span>
                    {duration}
                  </span>
                )}
                {priceText && <span className="svc-card__price">{priceText}</span>}
              </div>
            )}

            {action}
          </div>
        )}
      </div>
    </div>
  );
}
