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
    let previousScrollY = window.scrollY;
    const textObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && window.scrollY >= previousScrollY) {
            node.classList.add("is-visible");
            textObserver.unobserve(node);
          }
        });
      },
      { threshold: 0.28, rootMargin: "0px 0px -12% 0px" }
    );

    const media = node.parentElement?.querySelector(".service-media-slot");
    const mediaObserver = media
      ? new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting && window.scrollY >= previousScrollY) {
                media.classList.add("is-visible");
                mediaObserver?.unobserve(media);
              }
            });
          },
          { threshold: 0.3, rootMargin: "0px 0px -8% 0px" }
        )
      : null;

    const onScroll = () => {
      previousScrollY = lastScrollY;
      lastScrollY = window.scrollY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    textObserver.observe(node);
    if (media && mediaObserver) mediaObserver.observe(media);

    return () => {
      window.removeEventListener("scroll", onScroll);
      textObserver.disconnect();
      mediaObserver?.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className={`animated-service-content animated-service-${variant}`}>
      {children}
    </div>
  );
}
