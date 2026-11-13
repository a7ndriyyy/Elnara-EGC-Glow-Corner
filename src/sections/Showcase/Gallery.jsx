import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FiChevronLeft, FiChevronRight, FiPlay, FiX } from "react-icons/fi";
import { galleryCategories, galleryItems } from "../../data/gallery";
import { useLanguage } from "../../i18n/LanguageContext";
import { fill, localize } from "../../utils/format";

/** Wrap an index into [0, length). */
const wrap = (i, length) => ((i % length) + length) % length;
const SWIPE_PX = 50;

/**
 * TZ 10.1 — masonry gallery with category chips and a lightbox
 * (arrows, keyboard ←/→/Esc, swipe on touch screens). Lazy-loaded webp.
 */
export default function Gallery() {
  const { t, language } = useLanguage();
  const [filter, setFilter] = useState("all");
  const [openIndex, setOpenIndex] = useState(null);
  const triggerRef = useRef(null);
  const closeRef = useRef(null);
  const touchX = useRef(null);

  // Chips only for categories that actually have photos.
  const categories = useMemo(
    () => galleryCategories.filter((c) => galleryItems.some((item) => item.category === c)),
    [],
  );
  const items = useMemo(
    () => (filter === "all" ? galleryItems : galleryItems.filter((item) => item.category === filter)),
    [filter],
  );

  const open = (index, event) => {
    triggerRef.current = event.currentTarget;
    setOpenIndex(index);
  };
  const close = () => {
    setOpenIndex(null);
    triggerRef.current?.focus();
  };
  const step = (delta) => setOpenIndex((i) => wrap(i + delta, items.length));

  // Keyboard + body scroll lock while the lightbox is open.
  const isOpen = openIndex !== null;
  const count = items.length;
  useEffect(() => {
    if (!isOpen) return undefined;
    closeRef.current?.focus();
    const onKey = (event) => {
      if (event.key === "Escape") {
        setOpenIndex(null);
        triggerRef.current?.focus();
      }
      if (event.key === "ArrowLeft") setOpenIndex((i) => wrap(i - 1, count));
      if (event.key === "ArrowRight") setOpenIndex((i) => wrap(i + 1, count));
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, count]);

  if (galleryItems.length === 0) return null;

  const current = openIndex !== null ? items[openIndex] : null;
  const altOf = (item) => localize(item.alt, language);

  return (
    <div className="showcase__part" id="gallery">
      <h3 className="showcase__heading">{t("showcase.galleryTitle")}</h3>

      {categories.length > 1 && (
        <div className="showcase__chips" role="group" aria-label={t("showcase.filtersLabel")}>
          {["all", ...categories].map((c) => (
            <button
              key={c}
              type="button"
              className={`showcase__chip${filter === c ? " is-active" : ""}`}
              aria-pressed={filter === c}
              onClick={() => setFilter(c)}
            >
              {c === "all" ? t("showcase.all") : t(`showcase.categories.${c}`)}
            </button>
          ))}
        </div>
      )}

      <ul className="gallery">
        {items.map((item, index) => (
          <li key={item.id} className="gallery__item">
            <button
              type="button"
              className="gallery__open"
              aria-label={fill(t("showcase.open"), { alt: altOf(item) })}
              onClick={(event) => open(index, event)}
            >
              {item.video ? (
                <>
                  {/* #t=0.1 makes the browser paint the first frame as a poster */}
                  <video src={`${item.video}#t=0.1`} muted playsInline preload="metadata" aria-hidden="true" tabIndex={-1} />
                  <span className="gallery__play" aria-hidden="true"><FiPlay /></span>
                </>
              ) : (
                <img src={item.after || item.src} alt="" loading="lazy" decoding="async" />
              )}
              {item.before && (
                <span className="gallery__tag">{t("showcase.before")} / {t("showcase.after")}</span>
              )}
            </button>
          </li>
        ))}
      </ul>

      {/* Portal to <body>: escapes the page stacking contexts so the navbar and
          floating booking button cannot cover the lightbox. */}
      {current && createPortal(
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={altOf(current)}
          onClick={(event) => event.target === event.currentTarget && close()}
          onTouchStart={(event) => { touchX.current = event.touches[0].clientX; }}
          onTouchEnd={(event) => {
            if (touchX.current === null) return;
            const dx = event.changedTouches[0].clientX - touchX.current;
            touchX.current = null;
            if (Math.abs(dx) > SWIPE_PX) step(dx < 0 ? 1 : -1);
          }}
        >
          <button ref={closeRef} type="button" className="lightbox__close" onClick={close} aria-label={t("showcase.close")}>
            <FiX aria-hidden="true" />
          </button>

          <figure className="lightbox__figure">
            {current.before ? (
              <div className="lightbox__pair">
                <div>
                  <img src={current.before} alt={`${altOf(current)} — ${t("showcase.before")}`} />
                  <span className="lightbox__label">{t("showcase.before")}</span>
                </div>
                <div>
                  <img src={current.after} alt={`${altOf(current)} — ${t("showcase.after")}`} />
                  <span className="lightbox__label">{t("showcase.after")}</span>
                </div>
              </div>
            ) : current.video ? (
              <video
                key={current.id}
                className="lightbox__video"
                src={current.video}
                controls
                autoPlay
                loop
                muted
                playsInline
                aria-label={altOf(current)}
              />
            ) : (
              <img src={current.src} alt={altOf(current)} />
            )}
            <figcaption>
              <span>{altOf(current)}</span>
              <span className="lightbox__counter" aria-live="polite">
                {fill(t("showcase.counter"), { current: openIndex + 1, total: items.length })}
              </span>
            </figcaption>
          </figure>

          {items.length > 1 && (
            <>
              <button type="button" className="lightbox__nav lightbox__nav--prev" onClick={() => step(-1)} aria-label={t("showcase.prev")}>
                <FiChevronLeft aria-hidden="true" />
              </button>
              <button type="button" className="lightbox__nav lightbox__nav--next" onClick={() => step(1)} aria-label={t("showcase.next")}>
                <FiChevronRight aria-hidden="true" />
              </button>
            </>
          )}
        </div>,
        document.body,
      )}
    </div>
  );
}
