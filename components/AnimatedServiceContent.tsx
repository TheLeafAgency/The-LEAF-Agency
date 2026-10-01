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

    let lastScrollY = window.scrollY;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || window.scrollY < lastScrollY) return;
          node.classList.add("is-visible");
          node.parentElement?.querySelector(".service-media-slot")?.classList.add("is-visible");
          observer.unobserve(node);
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );

    const onScroll = () => {
      lastScrollY = window.scrollY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    observer.observe(node);

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className={`animated-service-content animated-service-${variant}`}>
      {children}
    </div>
  );
}
