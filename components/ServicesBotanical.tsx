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
      <svg className="services-botanical-svg" viewBox="0 0 1440 6200" preserveAspectRatio="none">
        <g>
          <VinePath d="M18 900 C90 850 165 875 225 960 C290 1050 345 1085 420 1045" start={0.08} end={0.18} width={17} />
          <VinePath d="M135 885 C130 825 150 780 190 745" start={0.11} end={0.15} width={5} className="services-botanical-thin" />
          <VinePath d="M230 965 C280 925 330 915 375 930" start={0.145} end={0.19} width={5} className="services-botanical-thin" />
          <Leaf x={90} y={855} rotate={-34} scale={0.8} start={0.12} />
          <Leaf x={225} y={965} rotate={26} scale={0.7} start={0.155} />
          <Leaf x={365} y={1040} rotate={-18} scale={0.62} start={0.19} />
        </g>
        <g>
          <VinePath d="M1422 1650 C1360 1600 1290 1640 1245 1730 C1195 1830 1130 1875 1040 1840" start={0.22} end={0.33} width={18} />
          <VinePath d="M1320 1625 C1330 1570 1310 1525 1270 1490" start={0.25} end={0.29} width={5} className="services-botanical-thin" />
          <VinePath d="M1245 1730 C1190 1685 1135 1670 1080 1685" start={0.29} end={0.34} width={5} className="services-botanical-thin" />
          <Leaf x={1360} y={1615} rotate={34} scale={0.82} start={0.255} side="right" />
          <Leaf x={1240} y={1725} rotate={-28} scale={0.7} start={0.30} side="right" />
          <Leaf x={1090} y={1680} rotate={22} scale={0.62} start={0.335} side="right" />
        </g>
        <g>
          <VinePath d="M18 2920 C95 2855 180 2885 235 2980 C300 3090 365 3125 450 3080" start={0.39} end={0.51} width={17} />
          <VinePath d="M145 2890 C140 2830 160 2785 205 2750" start={0.42} end={0.46} width={5} className="services-botanical-thin" />
          <VinePath d="M240 2990 C295 2945 345 2930 400 2945" start={0.46} end={0.52} width={5} className="services-botanical-thin" />
          <Leaf x={95} y={2865} rotate={-30} scale={0.78} start={0.43} />
          <Leaf x={245} y={2980} rotate={28} scale={0.68} start={0.47} />
          <Leaf x={405} y={3075} rotate={-18} scale={0.62} start={0.515} />
        </g>
        <g>
          <VinePath d="M1422 4100 C1350 4040 1280 4075 1225 4170 C1170 4270 1100 4300 1015 4260" start={0.62} end={0.75} width={18} />
          <VinePath d="M1320 4060 C1330 4005 1305 3960 1265 3925" start={0.65} end={0.70} width={5} className="services-botanical-thin" />
          <VinePath d="M1225 4170 C1170 4120 1110 4105 1050 4125" start={0.70} end={0.76} width={5} className="services-botanical-thin" />
          <Leaf x={1360} y={4060} rotate={35} scale={0.8} start={0.66} side="right" />
          <Leaf x={1220} y={4165} rotate={-25} scale={0.7} start={0.71} side="right" />
          <Leaf x={1060} y={4120} rotate={20} scale={0.62} start={0.76} side="right" />
        </g>
        <g className="services-botanical-fall-cluster">
          <path className="services-botanical-fall-trail" d="M1120 2200 C1090 2260 1130 2320 1095 2380" style={reveal(0.18, 0.42)} />
          <path className="services-botanical-fall-trail" d="M350 2450 C380 2510 345 2570 380 2630" style={reveal(0.28, 0.52)} />
          <path className="services-botanical-fall-trail" d="M1180 3600 C1150 3660 1190 3720 1155 3780" style={reveal(0.50, 0.74)} />
          <FallingLeaf x={1120} y={2200} rotate={28} scale={0.58} start={0.18} end={0.42} side="right" />
          <FallingLeaf x={350} y={2450} rotate={-20} scale={0.52} start={0.28} end={0.52} />
          <FallingLeaf x={1180} y={3600} rotate={-28} scale={0.55} start={0.50} end={0.74} side="right" />
        </g>
      </svg>
    </div>
  );
}