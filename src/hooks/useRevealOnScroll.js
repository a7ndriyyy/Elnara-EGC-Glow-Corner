import { useEffect } from "react";

/**
 * Fade-up reveal for page sections (TZ 1.7).
 * Watches every <section> inside `rootRef` (except the first one, the hero),
 * adds `.reveal` and then `.is-revealed` once it scrolls into view.
 * Re-runs when `key` changes (e.g. the route), and respects reduced motion.
 */
export default function useRevealOnScroll(rootRef, key) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === "undefined") return undefined;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return undefined;

    let observer;
    // Wait a frame so the new route has rendered its sections.
    const frame = requestAnimationFrame(() => {
      const sections = Array.from(root.querySelectorAll("section")).filter(
        (section, index) => index > 0 && !section.parentElement?.closest("section"),
      );

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-revealed");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
      );

      sections.forEach((section) => {
        section.classList.add("reveal");
        observer.observe(section);
      });
    });

    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [rootRef, key]);
}
