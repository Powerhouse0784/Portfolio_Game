"use client";

import { useEffect } from "react";
import { usePlayerStore } from "@/lib/stores/usePlayerStore";

const FORWARD_KEYS = ["KeyW", "ArrowUp"];
const BACKWARD_KEYS = ["KeyS", "ArrowDown"];
const LEFT_KEYS = ["KeyA", "ArrowLeft"];
const RIGHT_KEYS = ["KeyD", "ArrowRight"];
const SPRINT_KEYS = ["ShiftLeft", "ShiftRight"];
const JUMP_KEYS = ["Space"];

/**
 * Mounts once at the app root. Translates raw keyboard events into the
 * player store's `input` snapshot, which CharacterController reads every frame.
 * Keeping this separate from the controller means swapping/adding input
 * sources (touch, gamepad) never touches movement logic.
 */
export function useKeyboardControls() {
  const setInput = usePlayerStore((s) => s.setInput);

  useEffect(() => {
    const pressed = new Set<string>();

    const recompute = () => {
      setInput({
        forward: FORWARD_KEYS.some((k) => pressed.has(k)),
        backward: BACKWARD_KEYS.some((k) => pressed.has(k)),
        left: LEFT_KEYS.some((k) => pressed.has(k)),
        right: RIGHT_KEYS.some((k) => pressed.has(k)),
        sprint: SPRINT_KEYS.some((k) => pressed.has(k)),
        jump: JUMP_KEYS.some((k) => pressed.has(k)),
      });
    };

    const onKeyDown = (e: KeyboardEvent) => {
      // Ignore repeats and typing in inputs/textareas (e.g. guestbook, contact form)
      if (e.repeat) return;
      const target = e.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA"].includes(target.tagName)) return;

      pressed.add(e.code);
      recompute();
    };

    const onKeyUp = (e: KeyboardEvent) => {
      pressed.delete(e.code);
      recompute();
    };

    // Clear all input if window loses focus (prevents "stuck key" movement)
    const onBlur = () => {
      pressed.clear();
      recompute();
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
    };
  }, [setInput]);
}
