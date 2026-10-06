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

    // Let the browser track which botanical sections are near the viewport.
    // This avoids calling getBoundingClientRect() on every SVG during every
    // scroll frame, which can force layout work and get progressively slower.
    const sections = Array.from(
      layer.querySelectorAll<SVGElement>(
        ".leaf-botanical-svg-section, .leaf-botanical-svg-overlay"
      )
    );

    const activeSections = new Set<SVGElement>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const section = entry.target as SVGElement;
          if (entry.isIntersecting) {
            activeSections.add(section);
          } else {
            activeSections.delete(section);
          }
        }
      },
      {
        root: null,
        rootMargin: "25% 0px 25% 0px",
        threshold: 0,
      }
    );

    for (const section of sections) {
      observer.observe(section);
    }

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

      for (const section of activeSections) {
        section.style.setProperty("--botanical-progress", String(progress));
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
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={layerRef} className="leaf-botanical-layer" aria-hidden="true">
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
              <rect x="0" y="1250" width="400" height="750" />
              <rect x="1040" y="1250" width="400" height="750" />
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
              <rect x="0" y="2000" width="400" height="1300" />
              <rect x="1040" y="2000" width="400" height="1300" />
            </clipPath>
          </defs>
          <g clipPath="url(#leaf-edge-clip-3)">
<g>
          <VinePath d="M1480 2470 C1410 2415 1370 2350 1350 2290 C1330 2240 1295 2205 1255 2185" start={0.34} end={0.45} width={22} />
          <VinePath d="M1400 2395 C1410 2350 1395 2315 1365 2280" start={0.38} end={0.425} width={6} className="leaf-botanical-thin" />
          <VinePath d="M1350 2290 C1315 2255 1285 2230 1245 2220" start={0.42} end={0.455} width={6} className="leaf-botanical-thin" />
          <VinePath d="M1310 2225 C1280 2190 1245 2170 1205 2165" start={0.45} end={0.49} width={6} className="leaf-botanical-thin" />
          <VinePath d="M1270 2185 C1240 2155 1205 2135 1170 2130" start={0.49} end={0.53} width={5} className="leaf-botanical-thin" />
          <Leaf x={1425} y={2410} rotate={38} scale={0.92} start={0.38} side="right" />
          <Leaf x={1340} y={2220} rotate={25} scale={0.82} start={0.42} side="right" />
          <Leaf x={1285} y={2275} rotate={-28} scale={0.78} start={0.445} side="right" />
          <Leaf x={1205} y={2185} rotate={-12} scale={0.72} start={0.49} side="right" />
          <Leaf x={1125} y={2145} rotate={18} scale={0.68} start={0.52} side="right" />
        </g>

<g className="leaf-falling-cluster">
          <path className="leaf-fall-trail" d="M1180 2960 C1160 3000 1185 3040 1155 3090" />
          <path className="leaf-fall-trail leaf-fall-trail-soft" d="M1060 2870 C1080 2910 1050 2950 1075 2995" />
          <path className="leaf-fall-trail" d="M900 3020 C875 3060 900 3100 875 3140" />
          <g className="leaf-falling-leaf leaf-falling-leaf-one" style={reveal(0.38, 0.72)}>
            <Leaf x={1180} y={2960} rotate={28} scale={0.52} start={0} />
          </g>
          <g className="leaf-falling-leaf leaf-falling-leaf-two" style={reveal(0.42, 0.76)}>
            <Leaf x={1060} y={2870} rotate={-24} scale={0.45} start={0} />
          </g>
          <g className="leaf-falling-leaf leaf-falling-leaf-three" style={reveal(0.47, 0.80)}>
            <Leaf x={900} y={3020} rotate={18} scale={0.42} start={0} />
          </g>
        </g>
<g className="leaf-falling-cluster">
          <path className="leaf-fall-trail leaf-fall-trail-soft" d="M720 2760 C700 2800 725 2840 695 2885" />
          <path className="leaf-fall-trail" d="M520 2940 C545 2980 515 3020 540 3065" />
          <path className="leaf-fall-trail leaf-fall-trail-soft" d="M1260 3150 C1235 3190 1265 3230 1235 3280" />
          <path className="leaf-fall-trail" d="M350 3100 C375 3140 350 3180 380 3225" />
          <g className="leaf-falling-leaf leaf-falling-leaf-four" style={reveal(0.50, 0.82)}>
            <Leaf x={720} y={2760} rotate={-18} scale={0.48} start={0} />
          </g>
          <g className="leaf-falling-leaf leaf-falling-leaf-five" style={reveal(0.55, 0.86)}>
            <Leaf x={520} y={2940} rotate={34} scale={0.42} start={0} />
          </g>
          <g className="leaf-falling-leaf leaf-falling-leaf-six" style={reveal(0.59, 0.90)}>
            <Leaf x={1260} y={3150} rotate={-30} scale={0.50} start={0} />
          </g>
          <g className="leaf-falling-leaf leaf-falling-leaf-seven" style={reveal(0.64, 0.94)}>
            <Leaf x={350} y={3100} rotate={20} scale={0.44} start={0} />
          </g>
        </g>
<g className="leaf-falling-cluster">
          <path className="leaf-fall-trail leaf-fall-trail-soft" d="M760 3050 C785 3090 760 3130 790 3175" />
          <path className="leaf-fall-trail" d="M145 2880 C120 2920 150 2960 125 3005" />
          <path className="leaf-fall-trail leaf-fall-trail-soft" d="M1335 3020 C1310 3060 1340 3100 1315 3145" />
          <g className="leaf-falling-leaf leaf-falling-leaf-eight" style={reveal(0.44, 0.78)}>
            <Leaf x={760} y={3050} rotate={30} scale={0.40} start={0} side="right" />
          </g>
          <g className="leaf-falling-leaf leaf-falling-leaf-nine" style={reveal(0.52, 0.84)}>
            <Leaf x={145} y={2880} rotate={-18} scale={0.38} start={0} />
          </g>
          <g className="leaf-falling-leaf leaf-falling-leaf-ten" style={reveal(0.61, 0.92)}>
            <Leaf x={1335} y={3020} rotate={24} scale={0.42} start={0} side="right" />
          </g>
        </g>
<g className="leaf-falling-cluster">
          <path className="leaf-fall-trail leaf-fall-trail-soft" d="M280 2050 C255 2090 285 2130 260 2175" />
          <path className="leaf-fall-trail" d="M640 2280 C665 2320 635 2360 660 2405" />
          <path className="leaf-fall-trail leaf-fall-trail-soft" d="M1180 2450 C1155 2490 1185 2530 1160 2575" />
          <path className="leaf-fall-trail" d="M1390 3400 C1365 3440 1395 3480 1370 3525" />
          <g className="leaf-falling-leaf leaf-falling-leaf-eleven" style={reveal(0.34, 0.68)}>
            <Leaf x={280} y={2050} rotate={18} scale={0.40} start={0} />
          </g>
          <g className="leaf-falling-leaf leaf-falling-leaf-twelve" style={reveal(0.41, 0.75)}>
            <Leaf x={640} y={2280} rotate={-26} scale={0.44} start={0} side="right" />
          </g>
          <g className="leaf-falling-leaf leaf-falling-leaf-thirteen" style={reveal(0.48, 0.82)}>
            <Leaf x={1180} y={2450} rotate={25} scale={0.38} start={0} side="right" />
          </g>
          <g className="leaf-falling-leaf leaf-falling-leaf-fourteen" style={reveal(0.57, 0.91)}>
            <Leaf x={1390} y={3400} rotate={-20} scale={0.42} start={0} side="right" />
          </g>
        </g>
<g className="leaf-falling-cluster">
          <path className="leaf-fall-trail leaf-fall-trail-soft" d="M430 1900 C405 1940 435 1980 410 2025" />
          <path className="leaf-fall-trail" d="M1010 2050 C1035 2090 1005 2130 1030 2175" />
          <path className="leaf-fall-trail leaf-fall-trail-soft" d="M118 2240 C95 2280 125 2320 100 2365" />
          <path className="leaf-fall-trail" d="M860 2600 C835 2640 865 2680 840 2725" />
          <path className="leaf-fall-trail leaf-fall-trail-soft" d="M1330 2700 C1355 2740 1325 2780 1350 2825" />
          <path className="leaf-fall-trail" d="M430 3260 C405 3300 435 3340 410 3385" />
          <path className="leaf-fall-trail leaf-fall-trail-soft" d="M930 3370 C955 3410 925 3450 950 3495" />
          <path className="leaf-fall-trail" d="M1120 3710 C1095 3750 1125 3790 1100 3835" />
          <path className="leaf-fall-trail leaf-fall-trail-soft" d="M260 3970 C285 4010 255 4050 280 4095" />
          <path className="leaf-fall-trail" d="M1370 3990 C1345 4030 1375 4070 1350 4115" />
          <g className="leaf-falling-leaf" style={reveal(0.27,0.61)}><Leaf x={430} y={1900} rotate={-22} scale={0.38} start={0} /></g>
          <g className="leaf-falling-leaf" style={reveal(0.31,0.66)}><Leaf x={1010} y={2050} rotate={24} scale={0.42} start={0} side="right" /></g>
          <g className="leaf-falling-leaf" style={reveal(0.36,0.70)}><Leaf x={118} y={2240} rotate={-16} scale={0.36} start={0} /></g>
          <g className="leaf-falling-leaf" style={reveal(0.40,0.74)}><Leaf x={860} y={2600} rotate={28} scale={0.40} start={0} /></g>
          <g className="leaf-falling-leaf" style={reveal(0.45,0.79)}><Leaf x={1330} y={2700} rotate={-24} scale={0.38} start={0} side="right" /></g>
          <g className="leaf-falling-leaf" style={reveal(0.53,0.86)}><Leaf x={430} y={3260} rotate={18} scale={0.41} start={0} /></g>
          <g className="leaf-falling-leaf" style={reveal(0.57,0.90)}><Leaf x={930} y={3370} rotate={-20} scale={0.37} start={0} side="right" /></g>
          <g className="leaf-falling-leaf" style={reveal(0.63,0.95)}><Leaf x={1120} y={3710} rotate={25} scale={0.43} start={0} side="right" /></g>
          <g className="leaf-falling-leaf" style={reveal(0.70,0.98)}><Leaf x={260} y={3970} rotate={-26} scale={0.39} start={0} /></g>
          <g className="leaf-falling-leaf" style={reveal(0.76,1)}><Leaf x={1370} y={3990} rotate={20} scale={0.40} start={0} side="right" /></g>
        </g>
          </g>
        </svg>
        <svg className="leaf-botanical-svg leaf-botanical-svg-section" viewBox="0 3300 1440 1050" preserveAspectRatio="none" style={{ top: "66%", height: "21%" }}>
          <defs>
            <clipPath id="leaf-edge-clip-4">
              <rect x="0" y="3300" width="400" height="1050" />
              <rect x="1040" y="3300" width="400" height="1050" />
            </clipPath>
          </defs>
          <g clipPath="url(#leaf-edge-clip-4)">



          </g>
<g>
          <VinePath d="M1440 4200 C1380 4150 1310 4165 1260 4220 C1215 4270 1170 4285 1110 4260" start={0.82} end={0.92} width={16} />
          <VinePath d="M1350 4170 C1335 4125 1305 4095 1260 4080" start={0.835} end={0.885} width={5} className="leaf-botanical-thin" />
          <VinePath d="M1260 4220 C1280 4270 1315 4300 1360 4310" start={0.87} end={0.93} width={5} className="leaf-botanical-thin" />
          <Leaf x={1390} y={4160} rotate={36} scale={0.78} start={0.84} side="right" />
          <Leaf x={1280} y={4210} rotate={-28} scale={0.68} start={0.88} side="right" />
          <Leaf x={1200} y={4270} rotate={25} scale={0.62} start={0.915} side="right" />
        </g>
         </svg>
        <svg className="leaf-botanical-svg leaf-botanical-svg-section" viewBox="0 4200 1440 800" preserveAspectRatio="none" style={{ top: "84%", height: "16%" }}>
          <defs>
            <clipPath id="leaf-edge-clip-5">
              <rect x="0" y="4200" width="300" height="800" />
              <rect x="1140" y="4200" width="300" height="800" />
            </clipPath>
          </defs>
          <g clipPath="url(#leaf-edge-clip-5)">
<g>
          <VinePath d="M1110 4260 C1085 4330 1075 4390 1090 4450" start={0.89} end={1} width={11} />
          <VinePath d="M1090 4450 C1055 4510 1015 4560 970 4600" start={0.93} end={1} width={4} className="leaf-root-thin" />
          <VinePath d="M1090 4450 C1110 4520 1130 4580 1120 4640" start={0.94} end={1} width={4} className="leaf-root-thin" />
          <VinePath d="M1080 4490 C1040 4510 1000 4520 950 4520" start={0.96} end={1} width={3} className="leaf-root-thin" />
        </g>
          </g>
        </svg>
        <svg className="leaf-botanical-svg leaf-botanical-svg-overlay" viewBox="0 2000 1440 1300" preserveAspectRatio="none" aria-hidden="true">
          <g>
            <VinePath d="M1480 2815 C1360 2780 1235 2725 1110 2660 C960 2575 815 2510 665 2460 C500 2405 340 2375 180 2355" start={0.31} end={0.49} width={19} />
            <VinePath d="M1380 2820 C1390 2765 1365 2720 1315 2685" start={0.34} end={0.40} width={5} className="leaf-botanical-thin" />
            <VinePath d="M1130 2680 C1070 2635 1010 2610 945 2600" start={0.39} end={0.44} width={5} className="leaf-botanical-thin" />
            <VinePath d="M850 2520 C790 2475 725 2450 655 2445" start={0.44} end={0.47} width={5} className="leaf-botanical-thin" />
            <VinePath d="M550 2405 C485 2370 420 2350 350 2345" start={0.47} end={0.50} width={5} className="leaf-botanical-thin" />
            <Leaf x={1425} y={2830} rotate={38} scale={0.86} start={0.34} side="right" />
            <Leaf x={1210} y={2730} rotate={24} scale={0.78} start={0.39} side="right" />
            <Leaf x={980} y={2615} rotate={-25} scale={0.72} start={0.44} side="right" />
            <Leaf x={740} y={2485} rotate={-12} scale={0.68} start={0.47} side="right" />
            <Leaf x={500} y={2385} rotate={18} scale={0.64} start={0.49} />
            <Leaf x={270} y={2325} rotate={-20} scale={0.60} start={0.50} />
          </g>
        </svg>
        <svg className="leaf-botanical-svg leaf-botanical-svg-overlay leaf-botanical-svg-help" viewBox="0 3300 1440 1050" preserveAspectRatio="none" aria-hidden="true">
          <g transform="translate(0 180)">
            <VinePath d="M-40 3565 C180 3535 360 3545 540 3560 C760 3580 960 3580 1120 3560 C1270 3545 1380 3535 1480 3565" start={0.60} end={0.70} width={15} />
            <VinePath d="M260 3545 C275 3510 300 3485 335 3465" start={0.625} end={0.665} width={4} className="leaf-botanical-thin" />
            <VinePath d="M720 3580 C740 3545 770 3525 805 3510" start={0.65} end={0.69} width={4} className="leaf-botanical-thin" />
            <VinePath d="M1110 3565 C1135 3530 1170 3510 1210 3495" start={0.655} end={0.70} width={4} className="leaf-botanical-thin" />
            <Leaf x={220} y={3540} rotate={-28} scale={0.62} start={0.625} />
            <Leaf x={660} y={3570} rotate={22} scale={0.58} start={0.655} />
            <Leaf x={1060} y={3550} rotate={-18} scale={0.60} start={0.675} side="right" />
            <Leaf x={1320} y={3545} rotate={28} scale={0.56} start={0.69} side="right" />
          </g>
        </svg>
    </div>
  );
}
