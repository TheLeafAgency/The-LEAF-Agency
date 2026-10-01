"use client";

import { useEffect, useRef } from "react";

export default function ServicesBotanical() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = ref.current;
    if (!layer) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const nav = document.querySelector(".services-jump-nav") as HTMLElement | null;
      if (nav) {
        const rect = nav.getBoundingClientRect();
        const treeTop = rect.top + window.scrollY + nav.offsetHeight;
        layer.style.setProperty("--tree-top", `${treeTop}px`);
        layer.style.setProperty("--jump-height", `${nav.offsetHeight}px`);
      }
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const atBottom = window.scrollY >= maxScroll - 80;
      layer.classList.toggle("services-page-at-bottom", atBottom);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className="services-tree-layer" aria-hidden="true">
      <div className="services-brown-explosion services-brown-explosion-left" />
      <div className="services-brown-explosion services-brown-explosion-right" />
      <div className="services-tree">
        <svg className="services-tree-svg" viewBox="0 0 1000 7200" preserveAspectRatio="none">
          <path
            className="services-tree-trunk"
            d="M500 0 C486 500 510 900 492 1350 C475 1800 515 2150 495 2580 C470 3050 520 3420 505 3850 C488 4280 525 4680 500 5100 C475 5530 515 5920 492 6350 C480 6620 492 6900 470 7200"
          />
          <path
            className="services-tree-trunk-highlight"
            d="M525 0 C515 560 535 980 520 1400 C505 1820 545 2200 525 2620 C505 3060 550 3450 535 3880 C515 4300 555 4700 530 5120 C510 5540 550 5920 525 6350 C515 6640 525 6900 505 7200"
          />
          <path className="services-tree-root services-tree-root-left" d="M472 6750 C430 6870 355 6990 260 7130" />
          <path className="services-tree-root services-tree-root-right" d="M485 6800 C535 6910 625 7030 735 7140" />
          <path className="services-tree-root services-tree-root-center" d="M478 6820 C475 6960 455 7070 430 7200" />
        </svg>
      </div>
    </div>
  );
}
