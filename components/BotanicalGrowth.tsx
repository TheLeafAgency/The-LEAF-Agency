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
      <g className="leaf-botanical-leaf-motion">
        <path
          d="M0 0 C7 -30 35 -43 55 -34 C48 -8 25 8 0 0Z"
          fill="var(--leaf-text)"
          stroke="var(--leaf-text)"
        />
        <path
          d="M3 -3 C20 -12 35 -23 50 -33"
          className="leaf-vein"
          stroke="var(--leaf-text)"
        />
      </g>
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

    // The botanical layer has many SVG elements. Keep the scroll work to a
    // single CSS custom property on the parent instead of mutating every
    // branch and leaf on every animation frame.
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

      layer.style.setProperty("--botanical-progress", String(progress));
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
        <defs>
          {/* Keep the botanical artwork on the outside edges of the page.
              The middle of the page is reserved for headings, cards, and body text. */}
          <clipPath id="leaf-edge-clip">
            <rect x="0" y="0" width="300" height="5000" />
            <rect x="1140" y="0" width="300" height="5000" />
          </clipPath>
        </defs>

                <svg className="leaf-botanical-svg leaf-botanical-svg-section" viewBox="0 0 1440 1250" preserveAspectRatio="none" style={{ top: "0%", height: "25%" }}>
          <defs>
            <clipPath id="leaf-edge-clip-1">
              <rect x="0" y="0" width="300" height="1250" />
              <rect x="1140" y="0" width="300" height="1250" />
            </clipPath>
          </defs>
          <g clipPath="url(#leaf-edge-clip-1)">
<g>
          <VinePath d="M1465 1080 C1405 1045 1360 1050 1325 1085 C1295 1115 1260 1125 1225 1115" start={0.17} end={0.235} width={17} />
          <VinePath d="M1370 1060 C1350 1020 1325 995 1290 980" start={0.19} end={0.22} width={5} className="leaf-botanical-thin" />
          <VinePath d="M1325 1085 C1340 1120 1360 1145 1390 1155" start={0.215} end={0.245} width={5} className="leaf-botanical-thin" />
          <Leaf x={1380} y={1045} rotate={35} scale={0.82} start={0.19} side="right" />
          <Leaf x={1260} y={1085} rotate={-30} scale={0.7} start={0.215} side="right" />
          <Leaf x={1195} y={1160} rotate={28} scale={0.66} start={0.235} side="right" />
        </g>
          </g>
        </svg>
        <svg className="leaf-botanical-svg leaf-botanical-svg-section" viewBox="0 1250 1440 750" preserveAspectRatio="none" style={{ top: "25%", height: "15%" }}>
          <defs>
            <clipPath id="leaf-edge-clip-2">
              <rect x="0" y="1250" width="300" height="750" />
              <rect x="1140" y="1250" width="300" height="750" />
            </clipPath>
          </defs>
          <g clipPath="url(#leaf-edge-clip-2)">
<g>
          <VinePath d="M-20 1320 C35 1288 75 1295 105 1320" start={0.22} end={0.26} width={12} />
          <VinePath d="M65 1300 C65 1270 78 1250 98 1232" start={0.235} end={0.25} width={4} className="leaf-botanical-thin" />
          <Leaf x={45} y={1300} rotate={-35} scale={0.60} start={0.24} />
        </g>
<g>
          <VinePath d="M-25 1750 C80 1680 160 1695 220 1770 C265 1825 310 1840 375 1805" start={0.30} end={0.42} width={18} />
          <VinePath d="M115 1710 C110 1655 125 1610 165 1575" start={0.315} end={0.365} width={5} className="leaf-botanical-thin" />
          <VinePath d="M225 1775 C275 1730 325 1715 380 1725" start={0.35} end={0.405} width={5} className="leaf-botanical-thin" />
          <VinePath d="M285 1830 C305 1880 340 1910 390 1920" start={0.39} end={0.435} width={5} className="leaf-botanical-thin" />
          <Leaf x={70} y={1700} rotate={-35} scale={0.85} start={0.32} />
          <Leaf x={190} y={1770} rotate={28} scale={0.72} start={0.35} />
          <Leaf x={300} y={1810} rotate={-25} scale={0.66} start={0.39} />
        </g>
          </g>
        </svg>
        <svg className="leaf-botanical-svg leaf-botanical-svg-section" viewBox="0 2000 1440 1300" preserveAspectRatio="none" style={{ top: "40%", height: "26%" }}>
          <defs>
            <clipPath id="leaf-edge-clip-3">
              <rect x="0" y="2000" width="300" height="1300" />
              <rect x="1140" y="2000" width="300" height="1300" />
            </clipPath>
          </defs>
          <g clipPath="url(#leaf-edge-clip-4)">
            <g className="leaf-falling-cluster">
              <path className="leaf-fall-trail" d="M430 3260 C405 3300 435 3340 410 3385" />
              <path className="leaf-fall-trail leaf-fall-trail-soft" d="M930 3370 C955 3410 925 3450 950 3495" />
              <path className="leaf-fall-trail" d="M1120 3710 C1095 3750 1125 3790 1100 3835" />
              <path className="leaf-fall-trail leaf-fall-trail-soft" d="M260 3970 C285 4010 255 4050 280 4095" />
              <path className="leaf-fall-trail" d="M1370 3990 C1345 4030 1375 4070 1350 4115" />
              <g className="leaf-falling-leaf" style={reveal(0.53,0.86)}><Leaf x={430} y={3260} rotate={18} scale={0.41} start={0} /></g>
              <g className="leaf-falling-leaf" style={reveal(0.57,0.90)}><Leaf x={930} y={3370} rotate={-20} scale={0.37} start={0} side="right" /></g>
              <g className="leaf-falling-leaf" style={reveal(0.63,0.95)}><Leaf x={1120} y={3710} rotate={25} scale={0.43} start={0} side="right" /></g>
              <g className="leaf-falling-leaf" style={reveal(0.70,0.98)}><Leaf x={260} y={3970} rotate={-26} scale={0.39} start={0} /></g>
              <g className="leaf-falling-leaf" style={reveal(0.76,1)}><Leaf x={1370} y={3990} rotate={20} scale={0.40} start={0} side="right" /></g>
            </g>
            <g>          <VinePath d="M-40 3565 C180 3535 360 3545 540 3560 C760 3580 960 3580 1120 3560 C1270 3545 1380 3535 1480 3565" start={0.60} end={0.70} width={15} />
          <VinePath d="M260 3545 C275 3510 300 3485 335 3465" start={0.625} end={0.665} width={4} className="leaf-botanical-thin" />
          <VinePath d="M720 3580 C740 3545 770 3525 805 3510" start={0.65} end={0.69} width={4} className="leaf-botanical-thin" />
          <VinePath d="M1110 3565 C1135 3530 1170 3510 1210 3495" start={0.655} end={0.70} width={4} className="leaf-botanical-thin" />
          <Leaf x={220} y={3540} rotate={-28} scale={0.62} start={0.625} />
          <Leaf x={660} y={3570} rotate={22} scale={0.58} start={0.655} />
          <Leaf x={1060} y={3550} rotate={-18} scale={0.60} start={0.675} side="right" />
          <Leaf x={1320} y={3545} rotate={28} scale={0.56} start={0.69} side="right" />
        </g>
<g>
          <VinePath d="M-25 3770 C75 3700 155 3715 215 3790 C255 3840 300 3850 355 3820" start={0.70} end={0.80} width={17} />
          <VinePath d="M115 3730 C110 3680 125 3645 165 3610" start={0.715} end={0.765} width={5} className="leaf-botanical-thin" />
          <VinePath d="M220 3790 C260 3750 305 3735 350 3745" start={0.75} end={0.80} width={5} className="leaf-botanical-thin" />
          <Leaf x={75} y={3715} rotate={-34} scale={0.8} start={0.72} />
          <Leaf x={205} y={3800} rotate={27} scale={0.68} start={0.76} />
        </g>
          </g>
        </svg>
        <svg className="leaf-botanical-svg leaf-botanical-svg-section" viewBox="0 4350 1440 650" preserveAspectRatio="none" style={{ top: "87%", height: "13%" }}>
          <defs>
            <clipPath id="leaf-edge-clip-5">
              <rect x="0" y="4350" width="300" height="650" />
              <rect x="1140" y="4350" width="300" height="650" />
            </clipPath>
          </defs>
          <g clipPath="url(#leaf-edge-clip-5)">
<g>
          <VinePath d="M1465 4200 C1380 4150 1310 4165 1260 4220 C1215 4270 1170 4285 1110 4260" start={0.82} end={0.92} width={16} />
          <VinePath d="M1350 4170 C1335 4125 1305 4095 1260 4080" start={0.835} end={0.885} width={5} className="leaf-botanical-thin" />
          <VinePath d="M1260 4220 C1280 4270 1315 4300 1360 4310" start={0.87} end={0.93} width={5} className="leaf-botanical-thin" />
          <Leaf x={1390} y={4160} rotate={36} scale={0.78} start={0.84} side="right" />
          <Leaf x={1280} y={4210} rotate={-28} scale={0.68} start={0.88} side="right" />
          <Leaf x={1200} y={4270} rotate={25} scale={0.62} start={0.915} side="right" />
        </g>
<g>
          <VinePath d="M1110 4260 C1085 4330 1075 4390 1090 4450" start={0.89} end={1} width={11} />
          <VinePath d="M1090 4450 C1055 4510 1015 4560 970 4600" start={0.93} end={1} width={4} className="leaf-root-thin" />
          <VinePath d="M1090 4450 C1110 4520 1130 4580 1120 4640" start={0.94} end={1} width={4} className="leaf-root-thin" />
          <VinePath d="M1080 4490 C1040 4510 1000 4520 950 4520" start={0.96} end={1} width={3} className="leaf-root-thin" />
        </g>
          </g>
        </svg>
        </g>
      </svg>
    </div>
  );
}
