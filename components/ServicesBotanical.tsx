"use client";

import { useEffect, useRef } from "react";

export default function ServicesBotanical() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const update = () => {
      const height = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, window.scrollY / height));

      root.querySelectorAll<SVGElement>("[data-start]").forEach((el) => {
        const start = Number(el.dataset.start || 0);
        const end = Number(el.dataset.end || 1);
        const value = Math.min(1, Math.max(0, (progress - start) / Math.max(0.001, end - start)));
        el.style.setProperty("--reveal", String(value));
      });
    };

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        update();
      });
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
    <div ref={ref} className="services-botanical" aria-hidden="true">
      <svg viewBox="0 0 1440 6200" preserveAspectRatio="none">
        <g className="services-branch services-branch-left" data-start="0.08" data-end="0.32">
          <path d="M-30 950 C120 880 190 930 240 1060 C285 1175 340 1200 420 1150" />
          <path d="M150 920 C145 850 175 800 225 760" className="thin" />
          <path d="M280 1120 C330 1060 375 1035 430 1040" className="thin" />
          <path d="M360 1180 C395 1240 445 1270 500 1260" className="thin" />
          <ellipse cx="120" cy="900" rx="34" ry="18" transform="rotate(-35 120 900)" />
          <ellipse cx="285" cy="1110" rx="30" ry="16" transform="rotate(28 285 1110)" />
          <ellipse cx="455" cy="1245" rx="28" ry="15" transform="rotate(-18 455 1245)" />
        </g>

        <g className="services-branch services-branch-right" data-start="0.18" data-end="0.48">
          <path d="M1470 1750 C1340 1680 1280 1740 1235 1870 C1195 1985 1120 2025 1030 1980" />
          <path d="M1320 1730 C1330 1665 1310 1610 1265 1565" className="thin" />
          <path d="M1235 1865 C1180 1815 1120 1795 1060 1810" className="thin" />
          <ellipse cx="1290" cy="1690" rx="32" ry="17" transform="rotate(35 1290 1690)" />
          <ellipse cx="1140" cy="1805" rx="29" ry="15" transform="rotate(-25 1140 1805)" />
        </g>

        <g className="services-branch services-branch-left" data-start="0.42" data-end="0.72">
          <path d="M-25 3200 C110 3110 185 3160 230 3300 C275 3430 350 3470 450 3420" />
          <path d="M150 3180 C145 3115 165 3060 210 3015" className="thin" />
          <path d="M270 3390 C325 3340 380 3325 440 3340" className="thin" />
          <ellipse cx="120" cy="3145" rx="33" ry="17" transform="rotate(-28 120 3145)" />
          <ellipse cx="300" cy="3370" rx="30" ry="16" transform="rotate(22 300 3370)" />
        </g>

        <g className="services-branch services-branch-right" data-start="0.60" data-end="0.92">
          <path d="M1470 4700 C1340 4620 1265 4680 1210 4810 C1160 4930 1080 4970 990 4920" />
          <path d="M1300 4660 C1310 4595 1285 4540 1235 4500" className="thin" />
          <path d="M1210 4800 C1160 4760 1110 4740 1050 4755" className="thin" />
          <ellipse cx="1270" cy="4615" rx="33" ry="17" transform="rotate(32 1270 4615)" />
          <ellipse cx="1125" cy="4750" rx="29" ry="15" transform="rotate(-22 1125 4750)" />
        </g>

        <g className="services-falling-leaves">
          <path className="trail" d="M1120 2350 C1090 2410 1130 2460 1095 2520" />
          <path className="trail" d="M360 2550 C390 2610 350 2670 385 2730" />
          <path className="trail" d="M1220 3900 C1190 3960 1230 4020 1195 4080" />
          <path className="trail" d="M250 4300 C280 4360 240 4420 275 4480" />
          <ellipse className="falling-leaf" cx="1120" cy="2350" rx="24" ry="12" transform="rotate(28 1120 2350)" />
          <ellipse className="falling-leaf" cx="360" cy="2550" rx="21" ry="11" transform="rotate(-20 360 2550)" />
          <ellipse className="falling-leaf" cx="1220" cy="3900" rx="23" ry="12" transform="rotate(-32 1220 3900)" />
          <ellipse className="falling-leaf" cx="250" cy="4300" rx="20" ry="10" transform="rotate(22 250 4300)" />
        </g>
      </svg>
    </div>
  );
}
