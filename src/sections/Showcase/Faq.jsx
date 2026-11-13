import React, { useId, useRef, useState } from "react";
import { FiChevronDown, FiPlay, FiVolume2, FiVolumeX } from "react-icons/fi";
import { faqItems } from "../../data/faq";
import { useLanguage } from "../../i18n/LanguageContext";
import { localize } from "../../utils/format";

// Absolute URLs (https:, blob:, data:) are used as-is; site paths get the deploy base.
const withBase = (path) =>
  /^[a-z][a-z0-9+.-]*:/i.test(path) ? path : `${import.meta.env.BASE_URL}${String(path).replace(/^\//, "")}`;

/**
 * 9:16 video for an FAQ answer (TZ 10.3). Nothing loads until the visitor
 * presses play (preload="none", embeds created on click). It is only mounted
 * while its answer is open, so closing the answer stops playback.
 */
function FaqVideo({ video, title }) {
  const { t } = useLanguage();
  const ref = useRef(null);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  if (video.type === "youtube" || video.type === "instagram") {
    const src =
      video.type === "youtube"
        ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(video.id)}?autoplay=1&mute=1&playsinline=1&rel=0`
        : `${video.url.replace(/\/?$/, "/")}embed`;
    return (
      <div className="faq-video">
        {started ? (
          <iframe src={src} title={title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen loading="lazy" />
        ) : (
          <button type="button" className="faq-video__poster" onClick={() => setStarted(true)} aria-label={t("showcase.play")}>
            {video.poster && <img src={withBase(video.poster)} alt="" loading="lazy" />}
            <span className="faq-video__play" aria-hidden="true"><FiPlay /></span>
          </button>
        )}
      </div>
    );
  }

  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    setStarted(true);
    if (el.paused) el.play().catch(() => {});
    else el.pause();
  };

  return (
    <div className="faq-video">
      <video
        ref={ref}
        src={withBase(video.src)}
        poster={video.poster ? withBase(video.poster) : undefined}
        preload="none"
        playsInline
        muted={muted}
        loop
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onClick={toggle}
        aria-label={title}
      />
      {!playing && (
        <button type="button" className="faq-video__poster faq-video__poster--overlay" onClick={toggle} aria-label={t("showcase.play")}>
          <span className="faq-video__play" aria-hidden="true"><FiPlay /></span>
        </button>
      )}
      {started && (
        <button
          type="button"
          className="faq-video__sound"
          onClick={() => setMuted((m) => !m)}
          aria-label={muted ? t("showcase.unmute") : t("showcase.mute")}
          aria-pressed={!muted}
        >
          {muted ? <FiVolumeX aria-hidden="true" /> : <FiVolume2 aria-hidden="true" />}
        </button>
      )}
    </div>
  );
}

/** TZ 10.3 — accordion, one answer open at a time, optional vertical video. */
export default function Faq() {
  const { t, language } = useLanguage();
  const [openId, setOpenId] = useState(null);
  const baseId = useId();

  if (faqItems.length === 0) return null;

  return (
    <div className="showcase__part" id="faq">
      <h3 className="showcase__heading">{t("showcase.faqTitle")}</h3>
      <div className="faq">
        {faqItems.map((item) => {
          const open = openId === item.id;
          const question = localize(item.question, language);
          const panelId = `${baseId}-${item.id}`;
          return (
            <div key={item.id} className={`faq__item${open ? " is-open" : ""}`}>
              <h4 className="faq__q">
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpenId(open ? null : item.id)}
                >
                  <span>{question}</span>
                  <FiChevronDown className="faq__icon" aria-hidden="true" />
                </button>
              </h4>
              <div id={panelId} className="faq__panel" role="region" aria-label={question} hidden={!open}>
                <div className={`faq__body${item.video ? " has-video" : ""}`}>
                  <p className="faq__a">{localize(item.answer, language)}</p>
                  {item.video && open && <FaqVideo video={item.video} title={question} />}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
