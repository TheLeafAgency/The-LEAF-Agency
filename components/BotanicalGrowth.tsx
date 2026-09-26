"use client";

import { useEffect, useRef } from "react";

type AnimatedPathProps = {
  d: string;
  start: number;
  end: number;
  width: number;
  className?: string;
};

function AnimatedPath({ d, start, end, width, className = "" }: AnimatedPathProps) {
  return (
    <path
      d={d}
      pathLength="1"
      data-animated-path
      data-start={start}
      data-end={end}
      className={`leaf-botanical-path ${className}`}
      strokeWidth={width}
    />
  );
}

type LeafProps = {
  x: number;
  y: number;
  rotate: number;
  scale?: number;
  start: number;
  end: number;
  side?: "left" | "right";
};

function Leaf({ x, y, rotate, scale = 1, start, end, side = "left" }: LeafProps) {
  const mirror = side === "right" ? -1 : 1;

  return (
    <g
      transform={`translate(${x} ${y}) rotate(${rotate}) scale(${mirror * scale} ${scale})`}
      data-animated-leaf
      data-start={start}
      data-end={end}
      className="leaf-botanical-leaf"
    >
      <path d="M0 0 C7 -30 35 -43 55 -34 C48 -8 25 8 0 0Z" />
      <path d="M3 -3 C20 -12 35 -23 50 -33" className="leaf-vein" />
    </g>
  );
}

export default function BotanicalGrowth() {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;

    const paths = Array.from(
      layer.querySelectorAll<SVGPathElement>("[data-animated-path]")
    );
    const leaves = Array.from(
      layer.querySelectorAll<SVGGElement>("[data-animated-leaf]")
    );

    const update = () => {
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));

      for (const element of paths) {
        const start = Number(element.dataset.start || 0);
        const end = Number(element.dataset.end || 1);
        const reveal = end <= start
          ? 1
          : Math.min(1, Math.max(0, (progress - start) / (end - start)));

        element.style.setProperty("--reveal", String(reveal));
      }

      for (const element of leaves) {
        const start = Number(element.dataset.start || 0);
        const end = Number(element.dataset.end || 1);
        const reveal = end <= start
          ? 1
          : Math.min(1, Math.max(0, (progress - start) / (end - start)));

        element.style.opacity = String(reveal);
        element.style.transform = `scale(${0.86 + reveal * 0.14})`;
      }
    };

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
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
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={layerRef} className="leaf-botanical-layer" aria-hidden="true">
      <svg className="leaf-botanical-svg" viewBox="0 0 1440 5000" preserveAspectRatio="none">
        <g className="leaf-botanical-side">
          <AnimatedPath d="M-30 260 C90 190 170 225 255 285 C340 345 420 300 520 205" start={0.00} end={0.15} width={18} />
          <AnimatedPath d="M-20 270 C95 205 175 242 255 300 C340 360 425 315 520 220" start={0.01} end={0.16} width={4} className="leaf-botanical-light" />
          <AnimatedPath d="M115 235 C110 170 130 120 165 90" start={0.03} end={0.12} width={5} className="leaf-botanical-thin" />
          <AnimatedPath d="M245 292 C270 235 300 205 350 178" start={0.06} end={0.18} width={4} className="leaf-botanical-thin" />
          <AnimatedPath d="M365 318 C385 270 420 245 458 232" start={0.08} end={0.20} width={4} className="leaf-botanical-thin" />
          <Leaf x={135} y={175} rotate={-35} scale={1.0} start={0.055} end={0.11} />
          <Leaf x={205} y={275} rotate={25} scale={0.72} start={0.075} end={0.13} />
          <Leaf x={300} y={265} rotate={-34} scale={0.82} start={0.10} end={0.155} />
          <Leaf x={405} y={285} rotate={24} scale={0.68} start={0.125} end={0.18} />
          <Leaf x={455} y={235} rotate={-28} scale={0.62} start={0.14} end={0.195} />

          <AnimatedPath d="M-35 1450 C95 1370 180 1405 270 1490 C350 1565 430 1540 525 1450" start={0.16} end={0.34} width={16} />
          <AnimatedPath d="M-25 1460 C100 1385 185 1420 270 1502 C350 1575 435 1550 525 1460" start={0.17} end={0.35} width={3.5} className="leaf-botanical-light" />
          <AnimatedPath d="M115 1410 C100 1350 105 1300 140 1250" start={0.19} end={0.28} width={4} className="leaf-botanical-thin" />
          <AnimatedPath d="M285 1505 C305 1440 335 1400 375 1375" start={0.23} end={0.33} width={4} className="leaf-botanical-thin" />
          <AnimatedPath d="M400 1535 C430 1480 455 1455 495 1440" start={0.26} end={0.36} width={4} className="leaf-botanical-thin" />
          <Leaf x={112} y={1380} rotate={-68} scale={0.72} start={0.20} end={0.255} />
          <Leaf x={185} y={1430} rotate={-8} scale={0.78} start={0.22} end={0.275} />
          <Leaf x={300} y={1515} rotate={34} scale={0.72} start={0.25} end={0.305} />
          <Leaf x={390} y={1535} rotate={-28} scale={0.66} start={0.28} end={0.335} />
          <Leaf x={470} y={1470} rotate={25} scale={0.64} start={0.31} end={0.365} />

          <AnimatedPath d="M-30 2850 C90 2760 175 2790 250 2895 C325 3000 420 3020 540 2920" start={0.39} end={0.58} width={15} />
          <AnimatedPath d="M-15 2860 C100 2775 180 2810 252 2905 C330 3010 420 3030 540 2930" start={0.40} end={0.59} width={3.2} className="leaf-botanical-light" />
          <AnimatedPath d="M125 2810 C115 2755 125 2705 155 2660" start={0.42} end={0.51} width={4} className="leaf-botanical-thin" />
          <AnimatedPath d="M270 2930 C300 2870 325 2840 365 2810" start={0.47} end={0.57} width={4} className="leaf-botanical-thin" />
          <AnimatedPath d="M390 3020 C420 2970 450 2940 490 2925" start={0.51} end={0.61} width={4} className="leaf-botanical-thin" />
          <Leaf x={125} y={2780} rotate={-38} scale={0.72} start={0.44} end={0.49} />
          <Leaf x={205} y={2865} rotate={30} scale={0.7} start={0.46} end={0.515} />
          <Leaf x={320} y={2995} rotate={-34} scale={0.68} start={0.50} end={0.555} />
          <Leaf x={420} y={3000} rotate={28} scale={0.7} start={0.54} end={0.595} />

          <AnimatedPath d="M100 4670 C110 4510 150 4370 230 4260 C295 4170 300 4040 270 3920" start={0.67} end={0.82} width={14} />
          <AnimatedPath d="M145 4480 C90 4560 62 4640 55 4760" start={0.72} end={0.86} width={4} />
          <AnimatedPath d="M180 4410 C230 4500 250 4600 240 4740" start={0.74} end={0.88} width={3.5} />
          <AnimatedPath d="M210 4350 C300 4410 345 4500 360 4610" start={0.76} end={0.90} width={3.2} />
          <AnimatedPath d="M130 4520 C75 4570 30 4600 -5 4610" start={0.78} end={0.92} width={2.8} />
          <AnimatedPath d="M225 4270 C170 4320 125 4350 80 4370" start={0.80} end={0.94} width={2.5} className="leaf-root-thin" />
        </g>

        <g className="leaf-botanical-side">
          <AnimatedPath d="M1470 260 C1350 190 1270 225 1185 285 C1100 345 1020 300 920 205" start={0.015} end={0.165} width={18} />
          <AnimatedPath d="M1460 270 C1345 205 1265 242 1185 300 C1100 360 1015 315 920 220" start={0.025} end={0.175} width={4} className="leaf-botanical-light" />
          <AnimatedPath d="M1325 235 C1330 170 1310 120 1275 90" start={0.045} end={0.135} width={5} className="leaf-botanical-thin" />
          <AnimatedPath d="M1195 292 C1170 235 1140 205 1090 178" start={0.075} end={0.195} width={4} className="leaf-botanical-thin" />
          <AnimatedPath d="M1075 318 C1055 270 1020 245 982 232" start={0.10} end={0.215} width={4} className="leaf-botanical-thin" />
          <Leaf x={1305} y={175} rotate={35} scale={1.0} start={0.07} end={0.125} side="right" />
          <Leaf x={1235} y={275} rotate={-25} scale={0.72} start={0.09} end={0.145} side="right" />
          <Leaf x={1140} y={265} rotate={34} scale={0.82} start={0.115} end={0.17} side="right" />
          <Leaf x={1035} y={285} rotate={-24} scale={0.68} start={0.14} end={0.195} side="right" />
          <Leaf x={985} y={235} rotate={28} scale={0.62} start={0.155} end={0.21} side="right" />

          <AnimatedPath d="M1475 1450 C1345 1370 1260 1405 1170 1490 C1090 1565 1010 1540 915 1450" start={0.19} end={0.37} width={16} />
          <AnimatedPath d="M1465 1460 C1340 1385 1255 1420 1170 1502 C1090 1575 1005 1550 915 1460" start={0.20} end={0.38} width={3.5} className="leaf-botanical-light" />
          <AnimatedPath d="M1325 1410 C1340 1350 1335 1300 1300 1250" start={0.22} end={0.31} width={4} className="leaf-botanical-thin" />
          <AnimatedPath d="M1155 1505 C1135 1440 1105 1400 1065 1375" start={0.26} end={0.36} width={4} className="leaf-botanical-thin" />
          <AnimatedPath d="M1040 1535 C1010 1480 985 1455 945 1440" start={0.29} end={0.39} width={4} className="leaf-botanical-thin" />
          <Leaf x={1328} y={1380} rotate={68} scale={0.72} start={0.23} end={0.285} side="right" />
          <Leaf x={1255} y={1430} rotate={8} scale={0.78} start={0.25} end={0.305} side="right" />
          <Leaf x={1140} y={1515} rotate={-34} scale={0.72} start={0.28} end={0.335} side="right" />
          <Leaf x={1050} y={1535} rotate={28} scale={0.66} start={0.31} end={0.365} side="right" />
          <Leaf x={970} y={1470} rotate={-25} scale={0.64} start={0.34} end={0.395} side="right" />

          <AnimatedPath d="M1470 2850 C1350 2760 1265 2790 1190 2895 C1115 3000 1020 3020 900 2920" start={0.42} end={0.61} width={15} />
          <AnimatedPath d="M1455 2860 C1340 2775 1260 2810 1188 2905 C1110 3010 1020 3030 900 2930" start={0.43} end={0.62} width={3.2} className="leaf-botanical-light" />
          <AnimatedPath d="M1315 2810 C1325 2755 1315 2705 1285 2660" start={0.45} end={0.54} width={4} className="leaf-botanical-thin" />
          <AnimatedPath d="M1170 2930 C1140 2870 1115 2840 1075 2810" start={0.50} end={0.60} width={4} className="leaf-botanical-thin" />
          <AnimatedPath d="M1050 3020 C1020 2970 990 2940 950 2925" start={0.54} end={0.64} width={4} className="leaf-botanical-thin" />
          <Leaf x={1315} y={2780} rotate={38} scale={0.72} start={0.47} end={0.52} side="right" />
          <Leaf x={1235} y={2865} rotate={-30} scale={0.7} start={0.49} end={0.545} side="right" />
          <Leaf x={1120} y={2995} rotate={34} scale={0.68} start={0.53} end={0.585} side="right" />
          <Leaf x={1020} y={3000} rotate={-28} scale={0.7} start={0.57} end={0.625} side="right" />

          <AnimatedPath d="M1340 4670 C1330 4510 1290 4370 1210 4260 C1145 4170 1140 4040 1170 3920" start={0.70} end={0.85} width={14} />
          <AnimatedPath d="M1295 4480 C1350 4560 1378 4640 1385 4760" start={0.75} end={0.89} width={4} />
          <AnimatedPath d="M1260 4410 C1210 4500 1190 4600 1200 4740" start={0.77} end={0.91} width={3.5} />
          <AnimatedPath d="M1230 4350 C1140 4410 1095 4500 1080 4610" start={0.79} end={0.93} width={3.2} />
          <AnimatedPath d="M1330 4520 C1385 4570 1430 4600 1465 4610" start={0.81} end={0.95} width={2.8} />
          <AnimatedPath d="M1215 4270 C1270 4320 1315 4350 1360 4370" start={0.83} end={0.97} width={2.5} className="leaf-root-thin" />
        </g>
      </svg>
    </div>
  );
}
