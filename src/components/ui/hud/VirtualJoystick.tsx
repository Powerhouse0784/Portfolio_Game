"use client";

import { useEffect, useRef, useState } from "react";
import { usePlayerStore } from "@/lib/stores/usePlayerStore";

const BASE_SIZE = 130; // px, matches the container below
const BASE_RADIUS = 55; // px, how far the nub can travel from center
// Raised from 0.2 and given a smooth falloff below — the old version used a hard
// on/off threshold, so *any* nudge past ~20% of the radius instantly meant 100%
// speed. That's exactly what made it feel twitchy. A soft deadzone means small
// pushes now genuinely produce small, controllable movement.
const DEADZONE = 0.22;

/** Below the deadzone: 0. Above it: rescaled so the joystick can still reach a
 *  full ±1 right at the edge, instead of the whole outer ring being wasted. */
function applyDeadzone(value: number, deadzone: number): number {
  const abs = Math.abs(value);
  if (abs < deadzone) return 0;
  return Math.sign(value) * ((abs - deadzone) / (1 - deadzone));
}

export default function VirtualJoystick() {
  const baseRef = useRef<HTMLDivElement>(null);
  const setInput = usePlayerStore((s) => s.setInput);
  const [nubPos, setNubPos] = useState({ x: 0, y: 0 });

  const activeTouchId = useRef<number | null>(null);
  const baseCenter = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const base = baseRef.current;
    if (!base) return;

    const updateFromTouch = (touch: Touch) => {
      const dx = touch.clientX - baseCenter.current.x;
      const dy = touch.clientY - baseCenter.current.y;
      const dist = Math.min(Math.sqrt(dx * dx + dy * dy), BASE_RADIUS);
      const angle = Math.atan2(dy, dx);
      const clampedX = Math.cos(angle) * dist;
      const clampedY = Math.sin(angle) * dist;
      setNubPos({ x: clampedX, y: clampedY });

      const nx = clampedX / BASE_RADIUS;
      const ny = clampedY / BASE_RADIUS;

      // Same MovementInput axes the keyboard hook sets — CharacterController
      // doesn't know or care whether the source was a key or a thumb. Screen Y
      // increases downward, so dragging up (forward) gives a negative ny; negate
      // it to match moveY's convention where positive means forward.
      setInput({
        moveX: applyDeadzone(nx, DEADZONE),
        moveY: applyDeadzone(-ny, DEADZONE),
      });
    };

    const onTouchStart = (e: TouchEvent) => {
      if (activeTouchId.current !== null) return;
      const touch = e.changedTouches[0];
      const rect = base.getBoundingClientRect();
      baseCenter.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      activeTouchId.current = touch.identifier;
      updateFromTouch(touch);
      e.preventDefault();
    };

    const onTouchMove = (e: TouchEvent) => {
      if (activeTouchId.current === null) return;
      const touch = Array.from(e.changedTouches).find((t) => t.identifier === activeTouchId.current);
      if (!touch) return;
      updateFromTouch(touch);
      e.preventDefault();
    };

    const endTouch = (e: TouchEvent) => {
      if (activeTouchId.current === null) return;
      const stillActive = Array.from(e.changedTouches).some((t) => t.identifier === activeTouchId.current);
      if (!stillActive) return;
      activeTouchId.current = null;
      setNubPos({ x: 0, y: 0 });
      setInput({ moveX: 0, moveY: 0 });
    };

    base.addEventListener("touchstart", onTouchStart, { passive: false });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", endTouch);
    window.addEventListener("touchcancel", endTouch);

    return () => {
      base.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", endTouch);
      window.removeEventListener("touchcancel", endTouch);
    };
  }, [setInput]);

  return (
    <div
      ref={baseRef}
      className="pointer-events-auto fixed bottom-8 left-8 z-20 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm"
      style={{ width: BASE_SIZE, height: BASE_SIZE, touchAction: "none" }}
    >
      <div
        className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30 bg-white/40 shadow-lg"
        style={{ transform: `translate(-50%, -50%) translate(${nubPos.x}px, ${nubPos.y}px)` }}
      />
    </div>
  );
}
