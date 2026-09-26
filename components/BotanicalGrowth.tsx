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
  x, y, rotate, scale = 1, start, end, side = "left",
}: {
  x: number; y: number; rotate: number; scale?: number; start: number; end: number; side?: "left" | "right";
}) {
  const mirror = side === "right" ? -1 : 1;
  return (
    <g
      transform={`translate(${x} ${y}) rotate(${rotate}) scale(${mirror * scale} ${scale})`}
      className="leaf-botanical-leaf"
      style={reveal(start, end)}
    >
      <path d="M0 0 C7 -30 35 -43 55 -34 C48 -8 25 8 0 0Z" />
      <path d="M3 -3 C20 -12 35 -23 50 -33" className="leaf-vein" />
    </g>
  );
}

function VinePath({ d, start, end, width, className = "" }: {
  d: string; start: number; end: number; width: number; className?: string;
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
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));

      layer.style.setProperty("--scroll-progress", String(progress));

      for (const element of layer.querySelectorAll<SVGElement>("[style*='--start']")) {
        const start = Number(getComputedStyle(element).getPropertyValue("--start"));
        const end = Number(getComputedStyle(element).getPropertyValue("--end"));
        const value = end <= start ? 1 : Math.min(1, Math.max(0, (progress - start) / (end - start)));
        element.style.setProperty("--reveal", String(value));
      }

      for (const element of leaves) {
        const start = Number(getComputedStyle(element).getPropertyValue("--start"));
        const visible = progress >= start;
        element.style.setProperty("--leaf-visible", visible ? "1" : "0");
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
      <svg className="leaf-botanical-svg" viewBox="0 0 1440 5000" preserveAspectRatio="none">
        {/* LEFT: one continuous living branch that enters from the side and grows downward */}
        <g>
          <VinePath
            d="M-35 170 C100 110 205 160 290 245 C365 320 430 285 500 220 C555 170 585 205 620 270 C650 325 615 385 560 430 C490 490 470 565 515 650 C555 730 530 805 460 865 C390 925 390 1010 445 1085 C500 1160 475 1245 405 1310 C335 1375 335 1465 390 1545 C445 1625 425 1710 355 1785 C285 1860 290 1950 350 2025 C410 2100 390 2190 320 2265 C250 2340 255 2430 315 2510 C375 2590 350 2680 280 2755 C210 2830 215 2920 275 3000 C335 3080 310 3170 240 3245 C170 3320 175 3410 235 3490 C295 3570 270 3660 200 3735 C130 3810 135 3900 190 3980 C245 4060 225 4145 170 4230 C135 4285 120 4340 115 4410"
            start={0}
            end={0.92}
            width={24}
          />
          <VinePath
            d="M-30 175 C100 118 205 168 292 252 C365 325 430 292 500 227 C555 178 585 212 620 276"
            start={0}
            end={0.13}
            width={6}
            className="leaf-botanical-light"
          />

          {/* connected side shoots */}
          <VinePath d="M300 255 C260 190 235 145 245 85" start={0.025} end={0.085} width={7} className="leaf-botanical-thin" />
          <VinePath d="M430 285 C455 220 485 180 535 155" start={0.055} end={0.12} width={6} className="leaf-botanical-thin" />
          <VinePath d="M515 650 C450 615 400 570 370 515" start={0.13} end={0.19} width={6} className="leaf-botanical-thin" />
          <VinePath d="M445 1085 C500 1030 535 990 550 930" start={0.27} end={0.33} width={6} className="leaf-botanical-thin" />
          <VinePath d="M390 1545 C330 1500 285 1460 260 1405" start={0.39} end={0.45} width={6} className="leaf-botanical-thin" />
          <VinePath d="M350 2025 C410 1970 445 1925 455 1865" start={0.50} end={0.56} width={6} className="leaf-botanical-thin" />
          <VinePath d="M315 2510 C255 2460 215 2415 195 2360" start={0.61} end={0.67} width={6} className="leaf-botanical-thin" />
          <VinePath d="M275 3000 C335 2950 370 2905 380 2845" start={0.72} end={0.78} width={6} className="leaf-botanical-thin" />
          <VinePath d="M235 3490 C175 3440 135 3395 115 3340" start={0.82} end={0.88} width={6} className="leaf-botanical-thin" />

          <Leaf x={135} y={160} rotate={-38} scale={1.0} start={0.018} end={0.06} />
          <Leaf x={225} y={215} rotate={30} scale={0.76} start={0.035} end={0.078} />
          <Leaf x={330} y={300} rotate={-30} scale={0.8} start={0.055} end={0.10} />
          <Leaf x={430} y={275} rotate={25} scale={0.7} start={0.08} end={0.125} />
          <Leaf x={480} y={580} rotate={-40} scale={0.72} start={0.14} end={0.19} />
          <Leaf x={470} y={800} rotate={28} scale={0.68} start={0.20} end={0.25} />
          <Leaf x={430} y={1050} rotate={-32} scale={0.72} start={0.26} end={0.31} />
          <Leaf x={365} y={1280} rotate={25} scale={0.68} start={0.32} end={0.37} />
          <Leaf x={370} y={1510} rotate={-30} scale={0.7} start={0.38} end={0.43} />
          <Leaf x={330} y={1760} rotate={28} scale={0.68} start={0.44} end={0.49} />
          <Leaf x={325} y={2000} rotate={-30} scale={0.72} start={0.50} end={0.55} />
          <Leaf x={275} y={2250} rotate={28} scale={0.68} start={0.56} end={0.61} />
          <Leaf x={290} y={2490} rotate={-28} scale={0.7} start={0.62} end={0.67} />
          <Leaf x={240} y={2740} rotate={28} scale={0.66} start={0.68} end={0.73} />
          <Leaf x={250} y={2990} rotate={-30} scale={0.68} start={0.74} end={0.79} />
          <Leaf x={195} y={3230} rotate={26} scale={0.66} start={0.80} end={0.85} />
          <Leaf x={205} y={3480} rotate={-28} scale={0.68} start={0.86} end={0.91} />

          {/* roots connected directly to the final stem */}
          <VinePath d="M115 4410 C100 4490 72 4555 30 4620 C5 4660 -10 4700 -25 4760" start={0.86} end={1} width={14} />
          <VinePath d="M100 4510 C145 4560 165 4620 170 4700" start={0.89} end={1} width={5} className="leaf-root-thin" />
          <VinePath d="M78 4560 C30 4610 0 4650 -25 4700" start={0.91} end={1} width={4} className="leaf-root-thin" />
          <VinePath d="M92 4600 C130 4640 145 4685 145 4740" start={0.93} end={1} width={3.5} className="leaf-root-thin" />
          <VinePath d="M60 4650 C20 4680 -10 4710 -35 4750" start={0.95} end={1} width={3} className="leaf-root-thin" />
        </g>

        {/* RIGHT: mirrored continuous branch */}
        <g>
          <VinePath
            d="M1475 170 C1340 110 1235 160 1150 245 C1075 320 1010 285 940 220 C885 170 855 205 820 270 C790 325 825 385 880 430 C950 490 970 565 925 650 C885 730 910 805 980 865 C1050 925 1050 1010 995 1085 C940 1160 965 1245 1035 1310 C1105 1375 1105 1465 1050 1545 C995 1625 1015 1710 1085 1785 C1155 1860 1150 1950 1090 2025 C1030 2100 1050 2190 1120 2265 C1190 2340 1185 2430 1125 2510 C1065 2590 1090 2680 1160 2755 C1230 2830 1225 2920 1165 3000 C1105 3080 1130 3170 1200 3245 C1270 3320 1265 3410 1205 3490 C1145 3570 1170 3660 1240 3735 C1310 3810 1305 3900 1250 3980 C1195 4060 1215 4145 1270 4230 C1305 4285 1320 4340 1325 4410"
            start={0.02}
            end={0.94}
            width={24}
          />
          <VinePath
            d="M1480 175 C1340 118 1235 168 1148 252 C1075 325 1010 292 940 227 C885 178 855 212 820 276"
            start={0.02}
            end={0.14}
            width={6}
            className="leaf-botanical-light"
          />

          <VinePath d="M1140 255 C1180 190 1205 145 1195 85" start={0.045} end={0.105} width={7} className="leaf-botanical-thin" />
          <VinePath d="M1010 285 C985 220 955 180 905 155" start={0.075} end={0.14} width={6} className="leaf-botanical-thin" />
          <VinePath d="M925 650 C990 615 1040 570 1070 515" start={0.15} end={0.21} width={6} className="leaf-botanical-thin" />
          <VinePath d="M995 1085 C940 1030 905 990 890 930" start={0.29} end={0.35} width={6} className="leaf-botanical-thin" />
          <VinePath d="M1050 1545 C1110 1500 1155 1460 1180 1405" start={0.41} end={0.47} width={6} className="leaf-botanical-thin" />
          <VinePath d="M1090 2025 C1030 1970 995 1925 985 1865" start={0.52} end={0.58} width={6} className="leaf-botanical-thin" />
          <VinePath d="M1125 2510 C1185 2460 1225 2415 1245 2360" start={0.63} end={0.69} width={6} className="leaf-botanical-thin" />
          <VinePath d="M1165 3000 C1105 2950 1070 2905 1060 2845" start={0.74} end={0.80} width={6} className="leaf-botanical-thin" />
          <VinePath d="M1205 3490 C1265 3440 1305 3395 1325 3340" start={0.84} end={0.90} width={6} className="leaf-botanical-thin" />

          <Leaf x={1305} y={160} rotate={38} scale={1.0} start={0.038} end={0.08} side="right" />
          <Leaf x={1215} y={215} rotate={-30} scale={0.76} start={0.055} end={0.098} side="right" />
          <Leaf x={1110} y={300} rotate={30} scale={0.8} start={0.075} end={0.12} side="right" />
          <Leaf x={1010} y={275} rotate={-25} scale={0.7} start={0.10} end={0.145} side="right" />
          <Leaf x={960} y={580} rotate={40} scale={0.72} start={0.16} end={0.21} side="right" />
          <Leaf x={970} y={800} rotate={-28} scale={0.68} start={0.22} end={0.27} side="right" />
          <Leaf x={1010} y={1050} rotate={32} scale={0.72} start={0.28} end={0.33} side="right" />
          <Leaf x={1075} y={1280} rotate={-25} scale={0.68} start={0.34} end={0.39} side="right" />
          <Leaf x={1070} y={1510} rotate={30} scale={0.7} start={0.40} end={0.45} side="right" />
          <Leaf x={1110} y={1760} rotate={-28} scale={0.68} start={0.46} end={0.51} side="right" />
          <Leaf x={1115} y={2000} rotate={30} scale={0.72} start={0.52} end={0.57} side="right" />
          <Leaf x={1165} y={2250} rotate={-28} scale={0.68} start={0.58} end={0.63} side="right" />
          <Leaf x={1150} y={2490} rotate={28} scale={0.7} start={0.64} end={0.69} side="right" />
          <Leaf x={1200} y={2740} rotate={-28} scale={0.66} start={0.70} end={0.75} side="right" />
          <Leaf x={1190} y={2990} rotate={30} scale={0.68} start={0.76} end={0.81} side="right" />
          <Leaf x={1245} y={3230} rotate={-26} scale={0.66} start={0.82} end={0.87} side="right" />
          <Leaf x={1235} y={3480} rotate={28} scale={0.68} start={0.88} end={0.93} side="right" />

          <VinePath d="M1325 4410 C1340 4490 1368 4555 1410 4620 C1435 4660 1450 4700 1465 4760" start={0.88} end={1} width={14} />
          <VinePath d="M1340 4510 C1295 4560 1275 4620 1270 4700" start={0.91} end={1} width={5} className="leaf-root-thin" />
          <VinePath d="M1362 4560 C1410 4610 1440 4650 1465 4700" start={0.93} end={1} width={4} className="leaf-root-thin" />
          <VinePath d="M1348 4600 C1310 4640 1295 4685 1295 4740" start={0.95} end={1} width={3.5} className="leaf-root-thin" />
          <VinePath d="M1380 4650 C1420 4680 1450 4710 1475 4750" start={0.97} end={1} width={3} className="leaf-root-thin" />
        </g>
      </svg>
    </div>
  );
}
