"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function useScrollAnimation() {
  const pathname = usePathname();

  useEffect(() => {
    const elements = document.querySelectorAll(".scroll-item");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target); 
          }
        });
      },
      {
        threshold: 0.15,
      }
    );

    elements.forEach((el) => {
      el.classList.remove("show"); 
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [pathname]); 
}
