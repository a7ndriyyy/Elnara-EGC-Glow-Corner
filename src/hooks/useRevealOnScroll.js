import { useEffect } from "react";

/**
 * Fade-up reveal for page sections (TZ 1.7).
 * Watches every top-level <section> inside `rootRef` except the first one of
 * the page (the hero), adds `.reveal` and then `.is-revealed` once it scrolls
 * into view. Sections that appear later (lazy-loaded pages, data that arrives
 * after a fetch) are picked up through a MutationObserver.
 * Re-runs when `key` changes (e.g. the route). Skipped with reduced motion.
 */
export default function useRevealOnScroll(rootRef, key) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === "undefined") return undefined;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return undefined;

    const seen = new WeakSet();
    const pending = new Set();
    const reveal = (section) => {
      section.classList.add("is-revealed");
      pending.delete(section);
      io.unobserve(section);
    };

    // threshold 0: any visible pixel counts, so very tall sections (long card
    // lists on phones) always reveal.
    const io = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && reveal(entry.target)),
      { threshold: 0, rootMargin: "0px 0px -40px 0px" },
    );

    // Safety net independent of IntersectionObserver timing: on scroll, reveal
    // anything whose top is already above the bottom of the screen.
    let last = 0;
    const onScroll = () => {
      const now = Date.now();
      if (now - last < 150) return;
      last = now;
      pending.forEach((section) => {
        if (section.getBoundingClientRect().top < window.innerHeight) reveal(section);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const scan = () => {
      const sections = Array.from(root.querySelectorAll("section")).filter(
        (section) => !section.parentElement?.closest("section"),
      );
      sections.forEach((section, index) => {
        if (index === 0 || seen.has(section)) return; // first section = hero, always visible
        seen.add(section);
        section.classList.add("reveal");
        pending.add(section);
        io.observe(section);
      });
    };

    // Scan right away (the new route's DOM is already committed when effects
    // run) and once more next frame; never rely on the frame alone, or sections
    // tagged by the previous route's observer could be left hidden.
    scan();
    onScroll();
    const frame = requestAnimationFrame(scan);
    const mo = new MutationObserver(scan);
    mo.observe(root, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      mo.disconnect();
      io.disconnect();
    };
  }, [rootRef, key]);
}
