"use client";

import { useEffect, useRef } from "react";

export default function AnimatedServiceContent({
  children,
  variant = "left",
}: {
  children: React.ReactNode;
  variant?: "left" | "center" | "right" | "ripple";
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            node.classList.add("is-visible");
            node.parentElement?.querySelector(".service-media-slot")?.classList.add("is-visible");
            observer.unobserve(node);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`animated-service-content animated-service-${variant}`}>
      {children}
    </div>
  );
}
