import React, { useEffect, useRef, useState } from "react";
import { countValueAt, formatThousands } from "../../utils/countUp";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/**
 * Number that counts from 0 to `value` once, the first time it enters the
 * viewport (easeOutCubic over `duration` ms). The suffix ("+") is shown from
 * the start. Reduced motion → final number straight away.
 * Screen readers get the final value via aria-label, not the ticking digits.
 */
export default function Counter({ value, suffix = "", duration = 2000, label, className = "" }) {
  const ref = useRef(null);
  // No animation possible/wanted → start on the final number.
  const [current, setCurrent] = useState(() =>
    prefersReducedMotion() || typeof IntersectionObserver === "undefined" ? value : 0,
  );

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    if (prefersReducedMotion() || typeof IntersectionObserver === "undefined") return undefined;

    let frame;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect(); // animate only once
        const start = performance.now();
        const tick = (now) => {
          const elapsed = now - start;
          setCurrent(countValueAt(value, elapsed, duration));
          if (elapsed < duration) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, duration]);

  const finalText = `${formatThousands(value)}${suffix}`;

  return (
    <div className={`counter ${className}`.trim()} ref={ref} role="group" aria-label={`${finalText} ${label}`}>
      <span className="counter__value" aria-hidden="true">
        {/* invisible final value reserves the width, so digits never shift the layout */}
        <span className="counter__ghost">{finalText}</span>
        <span className="counter__live">
          {formatThousands(current)}
          {suffix}
        </span>
      </span>
      <span className="counter__label" aria-hidden="true">{label}</span>
    </div>
  );
}
