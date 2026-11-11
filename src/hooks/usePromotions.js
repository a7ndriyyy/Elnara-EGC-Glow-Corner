import { useEffect, useState } from "react";
import { fetchLivePromotions } from "../lib/promotions";

/** Live promotions for visitors (TZ step 9). status: "loading" | "ready" | "error". */
export default function usePromotions(limit) {
  const [state, setState] = useState({ status: "loading", items: [] });

  useEffect(() => {
    let cancelled = false;
    fetchLivePromotions(limit)
      .then((items) => !cancelled && setState({ status: "ready", items }))
      .catch((error) => {
        console.error("Promotions could not be loaded:", error);
        if (!cancelled) setState({ status: "error", items: [] });
      });
    return () => {
      cancelled = true;
    };
  }, [limit]);

  return state;
}
