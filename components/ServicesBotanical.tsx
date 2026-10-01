"use client";

import { useEffect, useRef } from "react";

export default function ServicesBotanical() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = ref.current;
    if (!layer) return;

    const updateTreePosition = () => {
      const nav = document.querySelector(".services-jump-nav") as HTMLElement | null;
      if (!nav) return;
      const navRect = nav.getBoundingClientRect();
      const layerRect = layer.getBoundingClientRect();
      const treeTop = navRect.bottom - layerRect.top;
      layer.style.setProperty("--tree-top", String(Math.max(0, treeTop)) + "px");
      layer.style.setProperty("--jump-height", String(nav.offsetHeight) + "px");
    };

    let endingRevealTimer: number | null = null;
    let explosionHideTimer: number | null = null;

    const updateBottomState = () => {
      const documentHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight
      );
      const viewportBottom = window.scrollY + window.innerHeight;
      const atBottom = viewportBottom >= documentHeight - 100;

      if (atBottom) {
        if (explosionHideTimer !== null) {
          window.clearTimeout(explosionHideTimer);
          explosionHideTimer = null;
        }

        const wasAtBottom = layer.classList.contains("services-page-at-bottom");
        layer.classList.add(
          "services-leaves-seen",
          "services-explosion-visible",
          "services-page-at-bottom"
        );

        if (!wasAtBottom && !layer.classList.contains("services-ending-revealed")) {
          if (endingRevealTimer !== null) window.clearTimeout(endingRevealTimer);
          endingRevealTimer = window.setTimeout(() => {
            layer.classList.add("services-ending-revealed");
            endingRevealTimer = null;
          }, 1250);
        }
      } else {
        // The explosion and final copy both reverse on the way back up.
        layer.classList.remove("services-page-at-bottom", "services-ending-revealed");

        if (endingRevealTimer !== null) {
          window.clearTimeout(endingRevealTimer);
          endingRevealTimer = null;
        }

        if (
          layer.classList.contains("services-explosion-visible") &&
          explosionHideTimer === null
        ) {
          explosionHideTimer = window.setTimeout(() => {
            layer.classList.remove("services-explosion-visible");
            explosionHideTimer = null;
          }, 1250);
        }
      }
    };

    const onScroll = () => updateBottomState();

    updateTreePosition();
    updateBottomState();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateTreePosition);

    return () => {
      if (endingRevealTimer !== null) window.clearTimeout(endingRevealTimer);
      if (explosionHideTimer !== null) window.clearTimeout(explosionHideTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateTreePosition);
    };
  }, []);

  return (
    <div ref={ref} className="services-tree-layer" aria-hidden="true">
      <div className="services-brown-explosion" />
      <div className="services-leaf-burst" aria-hidden="true">
        <span style={{"--x":"-43vw","--y":"-24vh","--r":"-75deg","--delay":"0s"} as React.CSSProperties} />
        <span style={{"--x":"-34vw","--y":"-46vh","--r":"-40deg","--delay":".18s"} as React.CSSProperties} />
        <span style={{"--x":"-25vw","--y":"-18vh","--r":"-110deg","--delay":".34s"} as React.CSSProperties} />
        <span style={{"--x":"-16vw","--y":"-58vh","--r":"-55deg","--delay":".52s"} as React.CSSProperties} />
        <span style={{"--x":"-7vw","--y":"-32vh","--r":"-18deg","--delay":".12s"} as React.CSSProperties} />
        <span style={{"--x":"-3vw","--y":"-52vh","--r":"-90deg","--delay":".42s"} as React.CSSProperties} />
        <span style={{"--x":"6vw","--y":"-22vh","--r":"12deg","--delay":".27s"} as React.CSSProperties} />
        <span style={{"--x":"12vw","--y":"-64vh","--r":"18deg","--delay":".61s"} as React.CSSProperties} />
        <span style={{"--x":"19vw","--y":"-36vh","--r":"55deg","--delay":".08s"} as React.CSSProperties} />
        <span style={{"--x":"27vw","--y":"-56vh","--r":"82deg","--delay":".48s"} as React.CSSProperties} />
        <span style={{"--x":"36vw","--y":"-20vh","--r":"120deg","--delay":".31s"} as React.CSSProperties} />
        <span style={{"--x":"43vw","--y":"-45vh","--r":"145deg","--delay":".72s"} as React.CSSProperties} />
        <span style={{"--x":"-47vw","--y":"-8vh","--r":"-135deg","--delay":".57s"} as React.CSSProperties} />
        <span style={{"--x":"47vw","--y":"-10vh","--r":"135deg","--delay":".66s"} as React.CSSProperties} />
        <span style={{"--x":"-22vw","--y":"-40vh","--r":"-30deg","--delay":".38s"} as React.CSSProperties} />
        <span style={{"--x":"22vw","--y":"-42vh","--r":"70deg","--delay":".25s"} as React.CSSProperties} />
        <span style={{"--x":"-38vw","--y":"-32vh","--r":"-115deg","--delay":".83s"} as React.CSSProperties} />
        <span style={{"--x":"38vw","--y":"-30vh","--r":"110deg","--delay":".94s"} as React.CSSProperties} />
      </div>
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
