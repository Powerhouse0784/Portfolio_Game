"use client";

import { useEffect, useState } from "react";

/** True once we've confirmed this is a touch-capable device. Checked client-side
 *  only — starts false so desktop never flashes touch controls before this runs. */
export function useIsTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const hasTouch =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches;
    setIsTouch(hasTouch);
  }, []);

  return isTouch;
}
