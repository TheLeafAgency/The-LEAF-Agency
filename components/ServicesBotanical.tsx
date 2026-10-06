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
      // The tree should begin at the top edge of the Services jump navbar, not below it.
      const treeTop = navRect.top - layerRect.top;
      layer.style.setProperty("--tree-top", String(Math.max(0, treeTop)) + "px");
      layer.style.setProperty("--jump-height", String(nav.offsetHeight) + "px");
    };

    let endingRevealTimer: number | null = null;
    let explosionHideTimer: number | null = null;
    let leafFadeTimer: number | null = null;
    let lastScrollY = window.scrollY;

    const hideExplosion = () => {
      // Only run the leaf fade if the burst was actually visible. On initial
      // page load there is nothing to fade; forcing the fade state there makes
      // the leaves jump into their final positions immediately.
      const burstWasVisible =
        layer.classList.contains("services-page-at-bottom") ||
        layer.classList.contains("services-explosion-visible");

      layer.classList.remove(
        "services-page-at-bottom",
        "services-ending-revealed",
        "services-explosion-visible"
      );

      if (!burstWasVisible) {
        layer.classList.remove("services-leaves-fading", "services-ending-reversing");
        return;
      }

      // Freeze the leaves where the burst left them, then let CSS fade them out.
      // The previous version kept the burst keyframe animation in control of
      // opacity, which prevented a real fade-out on upward scroll.
      layer.classList.add("services-leaves-fading", "services-ending-reversing");

      if (leafFadeTimer !== null) {
        window.clearTimeout(leafFadeTimer);
      }
      leafFadeTimer = window.setTimeout(() => {
        layer.classList.remove("services-leaves-fading", "services-ending-reversing");
        leafFadeTimer = null;
      }, 450);

      if (endingRevealTimer !== null) {
        window.clearTimeout(endingRevealTimer);
        endingRevealTimer = null;
      }
    };

    const updateBottomState = () => {
      const ending = document.querySelector(".services-ending") as HTMLElement | null;
      if (!ending) return;

      // Scrolling DOWN: trigger the bottom animation slightly later.
      // Scrolling UP: start reversing shortly before the viewport leaves the ending section.
      const endingTop = ending.getBoundingClientRect().top + window.scrollY;
      const endingLeafTop = endingTop + ending.offsetHeight * 0.48;
      layer.style.setProperty("--ending-leaf-top", String(endingLeafTop) + "px");
      const viewportBottom = window.scrollY + window.innerHeight;
      const scrollingUp = window.scrollY < lastScrollY;

      const inEndingSection = viewportBottom >= endingTop + 200;
      const reverseTriggerPoint = endingTop + 450;

      if (scrollingUp) {
        if (viewportBottom < reverseTriggerPoint) {
          hideExplosion();
        }
        return;
      }

      if (inEndingSection) {
        const wasInEndingSection = layer.classList.contains("services-page-at-bottom");
        if (leafFadeTimer !== null) {
          window.clearTimeout(leafFadeTimer);
          leafFadeTimer = null;
        }
        layer.classList.remove("services-leaves-fading", "services-ending-reversing");

        // Start a fresh leaf-burst animation each time we re-enter the ending
        // section from above. Removing the trigger class first forces the
        // browser to reset the keyframes instead of leaving completed leaves
        // sitting at their final positions.
        if (!wasInEndingSection) {
          layer.classList.remove("services-page-at-bottom");
          void layer.offsetWidth;
        }

        layer.classList.add(
          "services-explosion-visible",
          "services-page-at-bottom"
        );

        if (!wasInEndingSection && !layer.classList.contains("services-ending-revealed")) {
          if (endingRevealTimer !== null) window.clearTimeout(endingRevealTimer);
          endingRevealTimer = window.setTimeout(() => {
            layer.classList.add("services-ending-revealed");
            endingRevealTimer = null;
          }, 1250);
        }
      } else {
        hideExplosion();
      }
    };

    const onScroll = () => {
      updateBottomState();
      lastScrollY = window.scrollY;
    };

    // Wait for the first browser layout (and web fonts) to settle before measuring
    // the jump nav. This prevents the tree position from being calculated from
    // temporary first-load dimensions.
    let initialFrameOne: number | null = null;
    let initialFrameTwo: number | null = null;
    let initialFrameThree: number | null = null;

    const measureAfterLayout = () => {
      initialFrameOne = window.requestAnimationFrame(() => {
        initialFrameTwo = window.requestAnimationFrame(() => {
          const fontsReady = document.fonts?.ready ?? Promise.resolve();
          fontsReady.then(() => {
            initialFrameThree = window.requestAnimationFrame(() => {
              updateTreePosition();
              updateBottomState();
              initialFrameThree = null;
            });
          });
        });
      });
    };

    measureAfterLayout();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateTreePosition);

    return () => {
      if (initialFrameOne !== null) window.cancelAnimationFrame(initialFrameOne);
      if (initialFrameTwo !== null) window.cancelAnimationFrame(initialFrameTwo);
      if (initialFrameThree !== null) window.cancelAnimationFrame(initialFrameThree);
      if (endingRevealTimer !== null) window.clearTimeout(endingRevealTimer);
      if (explosionHideTimer !== null) window.clearTimeout(explosionHideTimer);
      if (leafFadeTimer !== null) window.clearTimeout(leafFadeTimer);
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
