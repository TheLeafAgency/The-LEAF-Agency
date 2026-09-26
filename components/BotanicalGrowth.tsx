"use client";

import { useEffect, useState } from "react";

function revealFor(progress: number, start: number, end: number) {
  if (progress <= start) return 0;
  if (progress >= end) return 1;
  return (progress - start) / (end - start);
}

function Leaf({
  x,
  y,
  rotate = 0,
  scale = 1,
  reveal,
  side = "left",
}: {
  x: number;
  y: number;
  rotate?: number;
  scale?: number;
  reveal: number;
  side?: "left" | "right";
}) {
  const mirrored = side === "right" ? -1 : 1;
  return (
    <g
      transform={`translate(${x} ${y}) rotate(${rotate}) scale(${mirrored * scale} ${scale})`}
      opacity={reveal}
      className="leaf-botanical-leaf"
    >
      <path
        d="M0 0 C 8 -28, 34 -38, 48 -31 C 43 -7, 24 8, 0 0 Z"
        fill="#4F7D31"
      />
      <path
        d="M2 -2 C 17 -10, 29 -19, 43 -28"
        fill="none"
        stroke="#315522"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity=".72"
      />
    </g>
  );
}

function BranchPath({
  d,
  reveal,
  className = "",
  width = 7,
}: {
  d: string;
  reveal: number;
  className?: string;
  width?: number;
}) {
  return (
    <path
      d={d}
      pathLength="1"
      strokeDasharray="1"
      strokeDashoffset={1 - reveal}
      className={`leaf-botanical-branch ${className}`}
      strokeWidth={width}
    />
  );
}

export default function BotanicalGrowth() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const next = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      setProgress(next);
      frame = 0;
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const leftTop = revealFor(progress, 0.00, 0.18);
  const rightTop = revealFor(progress, 0.03, 0.22);
  const leftMiddle = revealFor(progress, 0.16, 0.43);
  const rightMiddle = revealFor(progress, 0.22, 0.50);
  const leftLower = revealFor(progress, 0.42, 0.70);
  const rightLower = revealFor(progress, 0.50, 0.78);
  const roots = revealFor(progress, 0.72, 1.00);

  return (
    <div className="leaf-botanical-layer" aria-hidden="true">
      <svg
        className="leaf-botanical-svg"
        viewBox="0 0 1000 5000"
        preserveAspectRatio="none"
      >
        <g className="leaf-botanical-left">
          <BranchPath
            d="M-30 210 C 120 150, 170 245, 300 205 C 390 178, 425 112, 515 160"
            reveal={leftTop}
            width={10}
          />
          <BranchPath
            d="M15 215 C 145 172, 205 250, 302 213 C 382 185, 438 122, 515 165"
            reveal={leftTop}
            className="leaf-botanical-highlight"
            width={2.2}
          />
          <Leaf x={145} y={185} rotate={-28} scale={0.9} reveal={revealFor(leftTop, .16, .42)} />
          <Leaf x={230} y={224} rotate={24} scale={0.72} reveal={revealFor(leftTop, .34, .58)} />
          <Leaf x={335} y={191} rotate={-34} scale={0.82} reveal={revealFor(leftTop, .48, .72)} />
          <Leaf x={410} y={157} rotate={25} scale={0.68} reveal={revealFor(leftTop, .64, .88)} />

          <BranchPath
            d="M-25 1050 C 80 980, 155 1010, 230 1085 C 305 1160, 390 1165, 505 1080"
            reveal={leftMiddle}
            width={8}
          />
          <BranchPath
            d="M-12 1050 C 90 995, 150 1020, 225 1090 C 305 1165, 392 1168, 505 1080"
            reveal={leftMiddle}
            className="leaf-botanical-highlight"
            width={2}
          />
          <path d="M165 1020 C 135 950, 118 910, 126 855" className="leaf-botanical-branchlet" />
          <path d="M270 1115 C 295 1055, 316 1022, 350 992" className="leaf-botanical-branchlet" />
          <Leaf x={125} y={925} rotate={-72} scale={0.65} reveal={revealFor(leftMiddle, .12, .30)} />
          <Leaf x={175} y={1030} rotate={-12} scale={0.78} reveal={revealFor(leftMiddle, .24, .42)} />
          <Leaf x={315} y={1128} rotate={-32} scale={0.7} reveal={revealFor(leftMiddle, .52, .70)} />
          <Leaf x={390} y={1135} rotate={30} scale={0.68} reveal={revealFor(leftMiddle, .68, .86)} />

          <BranchPath
            d="M-30 2180 C 100 2100, 180 2140, 250 2240 C 330 2355, 410 2360, 520 2265"
            reveal={leftLower}
            width={7}
          />
          <BranchPath
            d="M20 2178 C 112 2122, 180 2152, 250 2243 C 327 2350, 408 2364, 520 2268"
            reveal={leftLower}
            className="leaf-botanical-highlight"
            width={1.8}
          />
          <Leaf x={135} y={2140} rotate={-38} scale={0.72} reveal={revealFor(leftLower, .10, .28)} />
          <Leaf x={210} y={2200} rotate={34} scale={0.68} reveal={revealFor(leftLower, .25, .43)} />
          <Leaf x={325} y={2360} rotate={-35} scale={0.66} reveal={revealFor(leftLower, .48, .66)} />
          <Leaf x={425} y={2340} rotate={26} scale={0.72} reveal={revealFor(leftLower, .65, .84)} />

          <BranchPath
            d="M85 4050 C 110 3930, 130 3840, 205 3745 C 260 3670, 280 3560, 260 3460"
            reveal={roots}
            width={8}
          />
          <BranchPath d="M150 3960 C 90 4030, 65 4110, 55 4210" reveal={roots} width={3.2} />
          <BranchPath d="M178 3900 C 220 4000, 245 4090, 240 4200" reveal={roots} width={3} />
          <BranchPath d="M205 3825 C 290 3870, 330 3940, 350 4040" reveal={roots} width={2.8} />
          <BranchPath d="M120 3990 C 80 4045, 40 4070, 10 4080" reveal={roots} width={2.4} />
        </g>

        <g className="leaf-botanical-right">
          <BranchPath
            d="M1030 250 C 900 180, 835 245, 760 215 C 675 182, 620 112, 505 165"
            reveal={rightTop}
            width={10}
          />
          <BranchPath
            d="M1015 250 C 902 192, 840 252, 758 220 C 674 188, 620 120, 505 170"
            reveal={rightTop}
            className="leaf-botanical-highlight"
            width={2.2}
          />
          <Leaf x={850} y={220} rotate={-24} scale={0.88} reveal={revealFor(rightTop, .16, .40)} side="right" />
          <Leaf x={770} y={212} rotate={22} scale={0.74} reveal={revealFor(rightTop, .34, .58)} side="right" />
          <Leaf x={670} y={156} rotate={-30} scale={0.76} reveal={revealFor(rightTop, .50, .74)} side="right" />
          <Leaf x={590} y={132} rotate={26} scale={0.66} reveal={revealFor(rightTop, .66, .90)} side="right" />

          <BranchPath
            d="M1025 1190 C 920 1110, 850 1160, 765 1230 C 690 1290, 615 1280, 500 1180"
            reveal={rightMiddle}
            width={8}
          />
          <BranchPath
            d="M1010 1190 C 920 1122, 852 1170, 762 1235 C 686 1292, 610 1285, 500 1184"
            reveal={rightMiddle}
            className="leaf-botanical-highlight"
            width={2}
          />
          <path d="M855 1160 C 882 1090, 905 1050, 945 1025" className="leaf-botanical-branchlet" />
          <path d="M745 1240 C 720 1170, 695 1135, 665 1105" className="leaf-botanical-branchlet" />
          <Leaf x={875} y={1140} rotate={32} scale={0.72} reveal={revealFor(rightMiddle, .14, .32)} side="right" />
          <Leaf x={805} y={1190} rotate={-20} scale={0.7} reveal={revealFor(rightMiddle, .28, .46)} side="right" />
          <Leaf x={700} y={1260} rotate={28} scale={0.68} reveal={revealFor(rightMiddle, .52, .70)} side="right" />
          <Leaf x={610} y={1250} rotate={-30} scale={0.66} reveal={revealFor(rightMiddle, .70, .88)} side="right" />

          <BranchPath
            d="M1030 2300 C 900 2200, 820 2250, 755 2370 C 700 2470, 610 2480, 500 2370"
            reveal={rightLower}
            width={7}
          />
          <BranchPath
            d="M1010 2302 C 900 2215, 825 2260, 755 2375 C 700 2475, 608 2485, 500 2375"
            reveal={rightLower}
            className="leaf-botanical-highlight"
            width={1.8}
          />
          <Leaf x={870} y={2240} rotate={-25} scale={0.72} reveal={revealFor(rightLower, .10, .28)} side="right" />
          <Leaf x={790} y={2290} rotate={30} scale={0.68} reveal={revealFor(rightLower, .28, .46)} side="right" />
          <Leaf x={700} y={2470} rotate={-30} scale={0.66} reveal={revealFor(rightLower, .50, .68)} side="right" />
          <Leaf x={600} y={2470} rotate={26} scale={0.7} reveal={revealFor(rightLower, .68, .86)} side="right" />

          <BranchPath
            d="M915 4050 C 890 3930, 865 3840, 795 3745 C 735 3665, 715 3555, 740 3450"
            reveal={roots}
            width={8}
          />
          <BranchPath d="M850 3960 C 910 4030, 935 4110, 945 4210" reveal={roots} width={3.2} />
          <BranchPath d="M820 3890 C 780 4000, 755 4090, 760 4200" reveal={roots} width={3} />
          <BranchPath d="M790 3820 C 700 3870, 665 3940, 650 4040" reveal={roots} width={2.8} />
          <BranchPath d="M880 3990 C 925 4045, 965 4070, 995 4080" reveal={roots} width={2.4} />
        </g>
      </svg>
    </div>
  );
}
