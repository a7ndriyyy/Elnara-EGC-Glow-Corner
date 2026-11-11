// Pure helpers for the hero counters (kept free of React so they are testable).

export const easeOutCubic = (t) => 1 - Math.pow(1 - Math.min(Math.max(t, 0), 1), 3);

/** 20000 → "20 000" (non-breaking spaces so the number never wraps). */
export function formatThousands(value) {
  return String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

/** Value shown at `elapsed` ms of a `duration` ms count-up towards `target`. */
export function countValueAt(target, elapsed, duration) {
  if (duration <= 0) return target;
  return Math.round(target * easeOutCubic(elapsed / duration));
}
