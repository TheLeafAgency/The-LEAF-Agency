"use client";

import { useEffect, useRef } from "react";

function reveal(start: number, end: number) {
  return { "--start": start, "--end": end } as React.CSSProperties;
}

function VinePath({ d, start, end, width, className = "" }: {
  d: string; start: number; end: number; width: number; className?: string;
}) {
  return (
    <path d={d} pathLength="1" className={"services-botanical-path " + className}
      strokeWidth={width} style={reveal(start, end)} />
  );
}

function Leaf({ x, y, rotate, scale = 1, start, side = "left" }: {
  x: number; y: number; rotate: number; scale?: number; start: number; side?: "left" | "right";
}) {
  const mirror = side === "right" ? -1 : 1;
  return (
    <g transform={"translate(" + x + " " + y + ") rotate(" + rotate + ") scale(" + mirror * scale + " " + scale + ")"}
      className="services-botanical-leaf" style={reveal(start, start)}>
      <g className="services-botanical-leaf-motion">
        <path d="M0 0 C7 -30 35 -43 55 -34 C48 -8 25 8 0 0Z" />
        <path d="M3 -3 C20 -12 35 -23 50 -33" className="leaf-vein" />
      </g>
    </g>
  );
}

function FallingLeaf({ x, y, rotate, scale, start, end, side = "left" }: {
  x: number; y: number; rotate: number; scale: number; start: number; end: number; side?: "left" | "right";
}) {
  const mirror = side === "right" ? -1 : 1;
  return (
    <g transform={"translate(" + x + " " + y + ") rotate(" + rotate + ") scale(" + mirror * scale + " " + scale + ")"}
      className="services-botanical-falling-leaf" style={reveal(start, end)}>
      <path d="M0 0 C7 -24 28 -34 45 -27 C40 -8 22 7 0 0Z" />
    </g>
  );
}

export default function ServicesBotanical() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = ref.current;
    if (!layer) return;

    const update = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const viewportAnchor = window.innerHeight * 0.72;
      const progress = Math.min(1, Math.max(0, (window.scrollY + viewportAnchor) / (maxScroll + viewportAnchor)));

      for (const element of layer.querySelectorAll<SVGElement>("[style*='--start']")) {
        const start = Number(getComputedStyle(element).getPropertyValue("--start"));
        const end = Number(getComputedStyle(element).getPropertyValue("--end"));
        const value = end <= start ? (progress >= start ? 1 : 0) : Math.min(1, Math.max(0, (progress - start) / (end - start)));
        element.style.setProperty("--reveal", String(value));
      }

      for (const element of layer.querySelectorAll<SVGGElement>(".services-botanical-leaf")) {
        const start = Number(getComputedStyle(element).getPropertyValue("--start"));
        const leafProgress = Math.min(1, Math.max(0, (progress - start) / 0.022));
        element.style.setProperty("--leaf-visible", String(leafProgress));
        element.style.setProperty("--leaf-grow", String(0.72 + leafProgress * 0.28));
        element.style.setProperty("--leaf-lift", String((1 - leafProgress) * 8));
      }

      for (const element of layer.querySelectorAll<SVGGElement>(".services-botanical-falling-leaf")) {
        const start = Number(getComputedStyle(element).getPropertyValue("--start"));
        const end = Number(getComputedStyle(element).getPropertyValue("--end"));
        const fallProgress = end <= start ? (progress >= start ? 1 : 0) : Math.min(1, Math.max(0, (progress - start) / (end - start)));
        element.style.setProperty("--fall-progress", String(fallProgress));
      }
    };

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => { frame = 0; update(); });
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
      <svg className="services-botanical-svg" viewBox="0 0 1440 7200" preserveAspectRatio="none">
        <g>
          <VinePath d="M42 900 C145 875 255 900 350 955 C455 1015 555 1040 690 1010" start={0.08} end={0.18} width={17} />
          <VinePath d="M185 930 C195 875 220 825 265 790" start={0.11} end={0.15} width={5} className="services-botanical-thin" />
          <VinePath d="M355 955 C430 920 505 915 575 945" start={0.145} end={0.19} width={5} className="services-botanical-thin" />
          <Leaf x={175} y={890} rotate={-30} scale={0.8} start={0.12} />
          <Leaf x={360} y={950} rotate={24} scale={0.7} start={0.155} />
          <Leaf x={565} y={955} rotate={-16} scale={0.62} start={0.19} />
        </g>
        <g>
          <VinePath d="M1398 1750 C1295 1715 1190 1740 1095 1810 C990 1890 885 1920 750 1885" start={0.22} end={0.33} width={18} />
          <VinePath d="M1280 1740 C1270 1685 1240 1640 1190 1610" start={0.25} end={0.29} width={5} className="services-botanical-thin" />
          <VinePath d="M1095 1810 C1020 1765 945 1750 870 1775" start={0.29} end={0.34} width={5} className="services-botanical-thin" />
          <Leaf x={1280} y={1725} rotate={32} scale={0.82} start={0.255} side="right" />
          <Leaf x={1090} y={1805} rotate={-26} scale={0.7} start={0.30} side="right" />
          <Leaf x={865} y={1770} rotate={20} scale={0.62} start={0.335} side="right" />
        </g>
        <g>
          <VinePath d="M42 3500 C145 3460 255 3490 350 3550 C460 3620 565 3645 700 3605" start={0.39} end={0.51} width={17} />
          <VinePath d="M185 3530 C195 3470 225 3420 270 3390" start={0.42} end={0.46} width={5} className="services-botanical-thin" />
          <VinePath d="M355 3550 C430 3510 505 3505 575 3535" start={0.46} end={0.52} width={5} className="services-botanical-thin" />
          <Leaf x={175} y={3490} rotate={-28} scale={0.78} start={0.43} />
          <Leaf x={360} y={3545} rotate={26} scale={0.68} start={0.47} />
          <Leaf x={565} y={3605} rotate={-16} scale={0.62} start={0.515} />
        </g>
        <g>
          <VinePath d="M1398 5200 C1295 5165 1190 5190 1095 5260 C990 5340 885 5370 750 5335" start={0.62} end={0.75} width={18} />
          <VinePath d="M1280 5190 C1270 5135 1240 5090 1190 5060" start={0.65} end={0.70} width={5} className="services-botanical-thin" />
          <VinePath d="M1095 5260 C1020 5215 945 5200 870 5225" start={0.70} end={0.76} width={5} className="services-botanical-thin" />
          <Leaf x={1280} y={5175} rotate={32} scale={0.8} start={0.66} side="right" />
          <Leaf x={1090} y={5255} rotate={-24} scale={0.7} start={0.71} side="right" />
          <Leaf x={865} y={5220} rotate={20} scale={0.62} start={0.76} side="right" />
        </g>
        <g className="services-botanical-fall-cluster">
          <path className="services-botanical-fall-trail" d="M1110 2550 C1085 2620 1115 2690 1090 2760" style={reveal(0.18, 0.42)} />
          <path className="services-botanical-fall-trail" d="M330 4250 C360 4320 335 4390 365 4460" style={reveal(0.28, 0.52)} />
          <path className="services-botanical-fall-trail" d="M1160 5900 C1135 5970 1170 6040 1140 6110" style={reveal(0.50, 0.74)} />
          <FallingLeaf x={1110} y={2550} rotate={28} scale={0.58} start={0.18} end={0.42} side="right" />
          <FallingLeaf x={330} y={4250} rotate={-20} scale={0.52} start={0.28} end={0.52} />
          <FallingLeaf x={1160} y={5900} rotate={-28} scale={0.55} start={0.50} end={0.74} side="right" />
        </g>
      </svg>
    </div>
  );
}