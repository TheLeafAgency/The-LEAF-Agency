"use client";

import { useEffect } from "react";

export default function ScrollToTopOnLoad() {
  useEffect(() => {
    window.scrollTo(0, 0);

    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }, []);

  return null;
}
