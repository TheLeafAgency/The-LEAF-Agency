"use client";

import { useEffect, useRef } from "react";

type RevealProps = {
  start: number;
  end: number;
};

function reveal(start: number, end: number) {
  return { "--start": start, "--end": end } as React.CSSProperties;
}

function Leaf({
  x, y, rotate, scale = 1, start, side = "left",
}: {
  x: number;
  y: number;
  rotate: number;
  scale?: number;
  start: number;
  side?: "left" | "right";
}) {
  const mirror = side === "right" ? -1 : 1;

  return (
    <g
      transform={`translate(${x} ${y}) rotate(${rotate}) scale(${mirror * scale} ${scale})`}
      className="leaf-botanical-leaf"
      style={reveal(start, start)}
    >
      <path d="M0 0 C7 -30 35 -43 55 -34 C48 -8 25 8 0 0Z" />
      <path d="M3 -3 C20 -12 35 -23 50 -33" className="leaf-vein" />
    </g>
  );
}

function VinePath({
  d, start, end, width, className = "",
}: {
  d: string;
  start: number;
  end: number;
  width: number;
  className?: string;
}) {
  return (
    <path
      d={d}
      pathLength="1"
      className={`leaf-botanical-path ${className}`}
      strokeWidth={width}
      style={reveal(start, end)}
    />
  );
}

export default function BotanicalGrowth() {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;

    const update = () => {
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const viewportAnchor = window.innerHeight * 0.72;
      const progress = Math.min(
        1,
        Math.max(
          0,
          (window.scrollY + viewportAnchor) /
            (maxScroll + viewportAnchor)
        )
      );

      for (const element of layer.querySelectorAll<SVGElement>("[style*='--start']")) {
        const start = Number(
          getComputedStyle(element).getPropertyValue("--start")
        );
        const end = Number(
          getComputedStyle(element).getPropertyValue("--end")
        );
        const value =
          end <= start
            ? progress >= start ? 1 : 0
            : Math.min(1, Math.max(0, (progress - start) / (end - start)));

        element.style.setProperty("--reveal", String(value));
      }

      for (const element of layer.querySelectorAll<SVGGElement>(".leaf-botanical-leaf")) {
        const start = Number(
          getComputedStyle(element).getPropertyValue("--start")
        );
        element.style.setProperty(
          "--leaf-visible",
          progress >= start ? "1" : "0"
        );
      }
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
    <div ref={layerRef} className="leaf-botanical-layer" aria-hidden="true">
      <svg
        className="leaf-botanical-svg"
        viewBox="0 0 1440 5000"
        preserveAspectRatio="none"
      >
        {/* Each branch is independent on purpose. The asymmetry is part of the experiment. */}

        {/* The hero is intentionally left clear for the video area. */}

        {/* ABOUT - right */}
        <g>
          <VinePath d="M1465 1080 C1370 1035 1300 1045 1245 1110 C1205 1155 1170 1175 1110 1160" start={0.17} end={0.27} width={17} />
          <VinePath d="M1330 1050 C1315 1000 1285 965 1235 945" start={0.19} end={0.235} width={5} className="leaf-botanical-thin" />
          <VinePath d="M1245 1110 C1260 1160 1285 1190 1330 1210" start={0.225} end={0.275} width={5} className="leaf-botanical-thin" />
          <Leaf x={1380} y={1045} rotate={35} scale={0.82} start={0.19} side="right" />
          <Leaf x={1260} y={1085} rotate={-30} scale={0.7} start={0.22} side="right" />
          <Leaf x={1195} y={1160} rotate={28} scale={0.66} start={0.25} side="right" />
        </g>

        {/* ABOUT - left, tiny accent */}
        <g>
          <VinePath d="M-20 1320 C55 1275 100 1285 145 1325 C175 1350 205 1355 245 1340" start={0.22} end={0.29} width={12} />
          <VinePath d="M105 1300 C105 1260 120 1235 150 1210" start={0.235} end={0.27} width={4} className="leaf-botanical-thin" />
          <Leaf x={60} y={1290} rotate={-35} scale={0.65} start={0.24} />
          <Leaf x={150} y={1330} rotate={25} scale={0.58} start={0.27} />
        </g>

        {/* SERVICES - left */}
        <g>
          <VinePath d="M-25 1750 C80 1680 160 1695 220 1770 C265 1825 310 1840 375 1805" start={0.30} end={0.42} width={18} />
          <VinePath d="M115 1710 C110 1655 125 1610 165 1575" start={0.315} end={0.365} width={5} className="leaf-botanical-thin" />
          <VinePath d="M225 1775 C275 1730 325 1715 380 1725" start={0.35} end={0.405} width={5} className="leaf-botanical-thin" />
          <VinePath d="M285 1830 C305 1880 340 1910 390 1920" start={0.39} end={0.435} width={5} className="leaf-botanical-thin" />
          <Leaf x={70} y={1700} rotate={-35} scale={0.85} start={0.32} />
          <Leaf x={190} y={1770} rotate={28} scale={0.72} start={0.35} />
          <Leaf x={300} y={1810} rotate={-25} scale={0.66} start={0.39} />
        </g>

        {/* SERVICES - right, Media-area branch */}
        <g>
          <VinePath d="M1480 2470 C1395 2380 1345 2275 1290 2170 C1230 2050 1160 1940 1070 1840 C1010 1775 950 1735 870 1700" start={0.34} end={0.55} width={22} />
          <VinePath d="M1385 2360 C1395 2295 1375 2235 1330 2180" start={0.38} end={0.45} width={6} className="leaf-botanical-thin" />
          <VinePath d="M1290 2170 C1240 2120 1185 2090 1125 2080" start={0.43} end={0.50} width={6} className="leaf-botanical-thin" />
          <VinePath d="M1160 1940 C1110 1890 1055 1860 990 1850" start={0.48} end={0.54} width={6} className="leaf-botanical-thin" />
          <VinePath d="M1010 1780 C970 1735 920 1710 865 1695" start={0.52} end={0.58} width={5} className="leaf-botanical-thin" />
          <Leaf x={1425} y={2410} rotate={38} scale={0.92} start={0.38} side="right" />
          <Leaf x={1340} y={2220} rotate={25} scale={0.82} start={0.43} side="right" />
          <Leaf x={1230} y={2070} rotate={-28} scale={0.78} start={0.48} side="right" />
          <Leaf x={1085} y={1870} rotate={-12} scale={0.72} start={0.53} side="right" />
          <Leaf x={950} y={1740} rotate={18} scale={0.68} start={0.57} side="right" />
        </g>

        {/* SERVICES - right, Copywriting / 9th card branch */}
        <g>
          <VinePath d="M1480 2860 C1360 2815 1235 2750 1110 2670 C960 2575 810 2500 650 2440 C480 2375 300 2335 100 2310" start={0.52} end={0.70} width={19} />
          <VinePath d="M1380 2820 C1390 2765 1365 2720 1315 2685" start={0.54} end={0.60} width={5} className="leaf-botanical-thin" />
          <VinePath d="M1130 2680 C1070 2635 1010 2610 945 2600" start={0.59} end={0.64} width={5} className="leaf-botanical-thin" />
          <VinePath d="M850 2520 C790 2475 725 2450 655 2445" start={0.64} end={0.68} width={5} className="leaf-botanical-thin" />
          <VinePath d="M550 2405 C485 2370 420 2350 350 2345" start={0.68} end={0.72} width={5} className="leaf-botanical-thin" />
          <Leaf x={1425} y={2830} rotate={38} scale={0.86} start={0.55} side="right" />
          <Leaf x={1210} y={2730} rotate={24} scale={0.78} start={0.60} side="right" />
          <Leaf x={980} y={2615} rotate={-25} scale={0.72} start={0.64} side="right" />
          <Leaf x={740} y={2485} rotate={-12} scale={0.68} start={0.67} side="right" />
          <Leaf x={500} y={2385} rotate={18} scale={0.64} start={0.70} />
          <Leaf x={270} y={2325} rotate={-20} scale={0.60} start={0.73} />
        </g>

        {/* SERVICE OPTIONS - left accent */}
        <g>
          <VinePath d="M-20 3260 C55 3210 115 3225 155 3280 C185 3320 220 3330 265 3310" start={0.61} end={0.68} width={13} />
          <VinePath d="M100 3240 C100 3200 115 3170 145 3145" start={0.625} end={0.665} width={4} className="leaf-botanical-thin" />
          <Leaf x={55} y={3225} rotate={-35} scale={0.66} start={0.63} />
          <Leaf x={175} y={3290} rotate={25} scale={0.58} start={0.66} />
        </g>

        {/* LOWER PAGE - left */}
        <g>
          <VinePath d="M-25 3770 C75 3700 155 3715 215 3790 C255 3840 300 3850 355 3820" start={0.70} end={0.80} width={17} />
          <VinePath d="M115 3730 C110 3680 125 3645 165 3610" start={0.715} end={0.765} width={5} className="leaf-botanical-thin" />
          <VinePath d="M220 3790 C260 3750 305 3735 350 3745" start={0.75} end={0.80} width={5} className="leaf-botanical-thin" />
          <Leaf x={75} y={3715} rotate={-34} scale={0.8} start={0.72} />
          <Leaf x={205} y={3800} rotate={27} scale={0.68} start={0.76} />
        </g>

        {/* LOWER PAGE - right */}
        <g>
          <VinePath d="M1465 4200 C1380 4150 1310 4165 1260 4220 C1215 4270 1170 4285 1110 4260" start={0.82} end={0.92} width={16} />
          <VinePath d="M1350 4170 C1335 4125 1305 4095 1260 4080" start={0.835} end={0.885} width={5} className="leaf-botanical-thin" />
          <VinePath d="M1260 4220 C1280 4270 1315 4300 1360 4310" start={0.87} end={0.93} width={5} className="leaf-botanical-thin" />
          <Leaf x={1390} y={4160} rotate={36} scale={0.78} start={0.84} side="right" />
          <Leaf x={1280} y={4210} rotate={-28} scale={0.68} start={0.88} side="right" />
          <Leaf x={1200} y={4270} rotate={25} scale={0.62} start={0.915} side="right" />
        </g>

        {/* Bottom roots: one small connected cluster, not giant mirrored roots */}
        <g>
          <VinePath d="M1110 4260 C1085 4330 1075 4390 1090 4450" start={0.89} end={1} width={11} />
          <VinePath d="M1090 4450 C1055 4510 1015 4560 970 4600" start={0.93} end={1} width={4} className="leaf-root-thin" />
          <VinePath d="M1090 4450 C1110 4520 1130 4580 1120 4640" start={0.94} end={1} width={4} className="leaf-root-thin" />
          <VinePath d="M1080 4490 C1040 4510 1000 4520 950 4520" start={0.96} end={1} width={3} className="leaf-root-thin" />
        </g>
      </svg>
    </div>
  );
}
