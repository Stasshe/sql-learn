"use client";

import type { RefObject } from "react";
import { useLayoutEffect, useState } from "react";

export interface FlightVector {
  dx: number;
  dy: number;
}

export interface FlightVectors {
  left: FlightVector;
  right: FlightVector;
}

/**
 * Measures the on-screen offset from two "source" elements to a "target"
 * element, so newly-mounted rows in the target can animate in with a
 * transform starting at that offset (i.e. visibly fly in from the source).
 * Recomputed on mount/resize; source/target positions are stable across
 * join-type or union-mode switches, so this doesn't need to rerun per change.
 */
export function useFlightVectors(
  leftSourceRef: RefObject<HTMLElement | null>,
  rightSourceRef: RefObject<HTMLElement | null>,
  targetRef: RefObject<HTMLElement | null>,
): FlightVectors | null {
  const [vectors, setVectors] = useState<FlightVectors | null>(null);

  useLayoutEffect(() => {
    function measure() {
      const left = leftSourceRef.current;
      const right = rightSourceRef.current;
      const target = targetRef.current;
      if (!left || !right || !target || window.innerWidth < 768) {
        setVectors(null);
        return;
      }
      const leftRect = left.getBoundingClientRect();
      const rightRect = right.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      setVectors({
        left: { dx: leftRect.left - targetRect.left, dy: leftRect.top - targetRect.top },
        right: { dx: rightRect.left - targetRect.left, dy: rightRect.top - targetRect.top },
      });
    }

    measure();
    const raf = requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, [leftSourceRef, rightSourceRef, targetRef]);

  return vectors;
}
