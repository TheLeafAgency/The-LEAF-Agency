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
      const rect = nav.getBoundingClientRect();
      const treeTop = rect.top + window.scrollY + nav.offsetHeight;
      layer.style.setProperty("--tree-top", String(treeTop) + "px");
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
      const atBottom = viewportBottom >= documentHeight - 24;

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
        // Only the explosion reverses on the way back up.
        layer.classList.remove("services-page-at-bottom");

        if (layer.classList.contains("services-explosion-visible") && explosionHideTimer === null) {
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
        <span style={{"--x":"-43vw","--y":"-24vh","--r":"-75deg","--trail-r":"64deg","--trail-l":"105px","--delay":"0s"} as React.CSSProperties} />
        <span style={{"--x":"-34vw","--y":"-46vh","--r":"-40deg","--trail-r":"40deg","--trail-l":"145px","--delay":".18s"} as React.CSSProperties} />
        <span style={{"--x":"-25vw","--y":"-18vh","--r":"-110deg","--trail-r":"72deg","--trail-l":"82px","--delay":".34s"} as React.CSSProperties} />
        <span style={{"--x":"-16vw","--y":"-58vh","--r":"-55deg","--trail-r":"55deg","--trail-l":"170px","--delay":".52s"} as React.CSSProperties} />
        <span style={{"--x":"-7vw","--y":"-32vh","--r":"-18deg","--trail-r":"20deg","--trail-l":"110px","--delay":".12s"} as React.CSSProperties} />
        <span style={{"--x":"-3vw","--y":"-52vh","--r":"-90deg","--trail-r":"8deg","--trail-l":"155px","--delay":".42s"} as React.CSSProperties} />
        <span style={{"--x":"6vw","--y":"-22vh","--r":"12deg","--trail-r":"-18deg","--trail-l":"95px","--delay":".27s"} as React.CSSProperties} />
        <span style={{"--x":"12vw","--y":"-64vh","--r":"18deg","--trail-r":"-10deg","--trail-l":"185px","--delay":".61s"} as React.CSSProperties} />
        <span style={{"--x":"19vw","--y":"-36vh","--r":"55deg","--trail-r":"-42deg","--trail-l":"125px","--delay":".08s"} as React.CSSProperties} />
        <span style={{"--x":"27vw","--y":"-56vh","--r":"82deg","--trail-r":"-55deg","--trail-l":"165px","--delay":".48s"} as React.CSSProperties} />
        <span style={{"--x":"36vw","--y":"-20vh","--r":"120deg","--trail-r":"-70deg","--trail-l":"90px","--delay":".31s"} as React.CSSProperties} />
        <span style={{"--x":"43vw","--y":"-45vh","--r":"145deg","--trail-r":"-58deg","--trail-l":"145px","--delay":".72s"} as React.CSSProperties} />
        <span style={{"--x":"-47vw","--y":"-8vh","--r":"-135deg","--trail-r":"78deg","--trail-l":"75px","--delay":".57s"} as React.CSSProperties} />
        <span style={{"--x":"47vw","--y":"-10vh","--r":"135deg","--trail-r":"-78deg","--trail-l":"78px","--delay":".66s"} as React.CSSProperties} />
        <span style={{"--x":"-22vw","--y":"-40vh","--r":"-30deg","--trail-r":"30deg","--trail-l":"135px","--delay":".38s"} as React.CSSProperties} />
        <span style={{"--x":"22vw","--y":"-42vh","--r":"70deg","--trail-r":"-30deg","--trail-l":"140px","--delay":".25s"} as React.CSSProperties} />
        <span style={{"--x":"-38vw","--y":"-32vh","--r":"-115deg","--trail-r":"62deg","--trail-l":"118px","--delay":".83s"} as React.CSSProperties} />
        <span style={{"--x":"38vw","--y":"-30vh","--r":"110deg","--trail-r":"-62deg","--trail-l":"112px","--delay":".94s"} as React.CSSProperties} />
      </div>
