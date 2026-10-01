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

    const updateBottomState = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const atBottom = window.scrollY >= maxScroll - 80;
      layer.classList.toggle("services-page-at-bottom", atBottom);
    };

    const onScroll = () => updateBottomState();

    updateTreePosition();
    updateBottomState();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateTreePosition);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateTreePosition);
    };
  }, []);

  return (
    <div ref={ref} className="services-tree-layer" aria-hidden="true">
      <div className="services-brown-explosion" />
      <div className="services-leaf-burst" aria-hidden="true">
        <span style={{"--x":"-430px","--y":"-190px","--r":"-75deg","--delay":"0s"} as React.CSSProperties} />
        <span style={{"--x":"-350px","--y":"-360px","--r":"-40deg","--delay":".08s"} as React.CSSProperties} />
        <span style={{"--x":"-285px","--y":"-120px","--r":"-110deg","--delay":".14s"} as React.CSSProperties} />
        <span style={{"--x":"-230px","--y":"-450px","--r":"-55deg","--delay":".22s"} as React.CSSProperties} />
        <span style={{"--x":"-165px","--y":"-250px","--r":"-18deg","--delay":".06s"} as React.CSSProperties} />
        <span style={{"--x":"-105px","--y":"-390px","--r":"-90deg","--delay":".18s"} as React.CSSProperties} />
        <span style={{"--x":"-45px","--y":"-175px","--r":"-12deg","--delay":".11s"} as React.CSSProperties} />
        <span style={{"--x":"20px","--y":"-500px","--r":"18deg","--delay":".2s"} as React.CSSProperties} />
        <span style={{"--x":"85px","--y":"-270px","--r":"55deg","--delay":".03s"} as React.CSSProperties} />
        <span style={{"--x":"145px","--y":"-430px","--r":"82deg","--delay":".16s"} as React.CSSProperties} />
        <span style={{"--x":"210px","--y":"-150px","--r":"120deg","--delay":".1s"} as React.CSSProperties} />
        <span style={{"--x":"275px","--y":"-350px","--r":"145deg","--delay":".25s"} as React.CSSProperties} />
        <span style={{"--x":"345px","--y":"-215px","--r":"165deg","--delay":".13s"} as React.CSSProperties} />
        <span style={{"--x":"420px","--y":"-390px","--r":"105deg","--delay":".31s"} as React.CSSProperties} />
        <span style={{"--x":"-390px","--y":"-40px","--r":"-135deg","--delay":".27s"} as React.CSSProperties} />
        <span style={{"--x":"390px","--y":"-70px","--r":"135deg","--delay":".35s"} as React.CSSProperties} />
        <span style={{"--x":"-70px","--y":"-330px","--r":"-30deg","--delay":".17s"} as React.CSSProperties} />
        <span style={{"--x":"115px","--y":"-335px","--r":"70deg","--delay":".21s"} as React.CSSProperties} />
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
