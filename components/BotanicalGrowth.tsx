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
        <path d="M0 0 C7 -30 35 -43 55 -34 C48 -8 25 8 0 0Z" />
        <path d="M3 -3 C20 -12 35 -23 50 -33" className="leaf-vein" />
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

function BotanicalImage({
  href,
  x,
  y,
  width,
  height,
  start,
  side = "left",
  className = "",
}: {
  href: string;
  x: number;
  y: number;
  width: number;
  height: number;
  start: number;
  side?: "left" | "right";
  className?: string;
}) {
  return (
    <g
      className={`leaf-botanical-image ${side === "right" ? "leaf-botanical-image-right" : "leaf-botanical-image-left"} ${className}`}
      style={reveal(start, start)}
    >
      <image
        href={href}
        x={x}
        y={y}
        width={width}
        height={height}
        preserveAspectRatio="xMidYMid meet"
      />
    </g>
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
        const leafRevealEnd = start + 0.022;
        const leafProgress = Math.min(
          1,
          Math.max(0, (progress - start) / (leafRevealEnd - start))
        );
        element.style.setProperty("--leaf-visible", String(leafProgress));
        element.style.setProperty("--leaf-grow", String(0.72 + leafProgress * 0.28));
        element.style.setProperty("--leaf-lift", String((1 - leafProgress) * 8));
      }

      for (const element of layer.querySelectorAll<SVGGElement>(".leaf-falling-leaf")) {
        const start = Number(
          getComputedStyle(element).getPropertyValue("--start")
        );
        const end = Number(
          getComputedStyle(element).getPropertyValue("--end")
        );
        const fallProgress =
          end <= start
            ? progress >= start ? 1 : 0
            : Math.min(1, Math.max(0, (progress - start) / (end - start)));
        element.style.setProperty("--fall-progress", String(fallProgress));
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

        {/* FINAL BOTANICAL ARTWORK - ABOUT */}
        <BotanicalImage href="/botanical/branch-large-right.png" x={900} y={820} width={620} height={500} start={0.17} side="right" />
        <BotanicalImage href="/botanical/branch-corner.png" x={-120} y={1160} width={430} height={420} start={0.22} />

        {/* FINAL BOTANICAL ARTWORK - SERVICES */}
        <BotanicalImage href="/botanical/branch-large-left.png" x={-140} y={1500} width={720} height={650} start={0.30} />
        <BotanicalImage href="/botanical/branch-large-right.png" x={850} y={2050} width={700} height={620} start={0.34} side="right" />
        <BotanicalImage href="/botanical/branch-large-left.png" x={40} y={2250} width={1450} height={700} start={0.31} side="right" className="leaf-botanical-copywriting" />

        {/* Falling leaves: subtle motion with light guide trails. */}
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

        {/* Additional falling leaves for a fuller, natural drift. */}
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

        {/* A few extra falling leaves, kept sparse and staggered. */}
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

        {/* Additional sparse falling leaves across the home page. */}
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


        {/* More scattered falling leaves across the page. */}
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

        {/* FINAL BOTANICAL ARTWORK - SERVICE OPTIONS */}
        <BotanicalImage href="/botanical/branch-wave.png" x={-80} y={3380} width={1600} height={420} start={0.60} />

        {/* FINAL BOTANICAL ARTWORK - LOWER PAGE */}
        <BotanicalImage href="/botanical/branch-corner.png" x={-130} y={3650} width={520} height={500} start={0.70} />
        <BotanicalImage href="/botanical/branch-large-right.png" x={900} y={4020} width={620} height={520} start={0.82} side="right" />

        {/* Final roots connect directly to the lower-right branch. */}
        <BotanicalImage href="/botanical/root-vertical.png" x={1010} y={4250} width={260} height={720} start={0.89} side="right" />
        <BotanicalImage href="/botanical/root-large-horizontal.png" x={760} y={4480} width={520} height={360} start={0.93} side="right" />
      </svg>
    </div>
  );
}
