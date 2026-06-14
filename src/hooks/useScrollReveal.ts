"use client";

import { useCallback, useRef } from "react";

interface ScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

export function useScrollReveal(options: ScrollRevealOptions = {}) {
  const { threshold = 0.1, rootMargin = "0px 0px -50px 0px", once = true } =
    options;
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementsRef = useRef<Set<Element>>(new Set());

  const ref = useCallback(
    (node: HTMLElement | null) => {
      if (typeof window === "undefined") return;

      // Clean up previous observer if it exists
      if (observerRef.current) {
        elementsRef.current.forEach((el) =>
          observerRef.current?.unobserve(el)
        );
        observerRef.current.disconnect();
        elementsRef.current.clear();
      }

      if (!node) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("revealed");
              if (once) {
                observerRef.current?.unobserve(entry.target);
                elementsRef.current.delete(entry.target);
              }
            } else if (!once) {
              entry.target.classList.remove("revealed");
            }
          });
        },
        { threshold, rootMargin }
      );

      observerRef.current.observe(node);
      elementsRef.current.add(node);
    },
    [threshold, rootMargin, once]
  );

  return ref;
}
