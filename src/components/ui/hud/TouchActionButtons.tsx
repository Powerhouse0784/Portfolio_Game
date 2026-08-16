"use client";

import { usePlayerStore } from "@/lib/stores/usePlayerStore";

export default function TouchActionButtons() {
  const setInput = usePlayerStore((s) => s.setInput);

  return (
    <div className="pointer-events-none fixed bottom-8 right-8 z-20 flex flex-col items-end gap-3">
      <button
        onTouchStart={(e) => {
          e.preventDefault();
          setInput({ jump: true });
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          setInput({ jump: false });
        }}
        onTouchCancel={(e) => {
          e.preventDefault();
          setInput({ jump: false });
        }}
        className="pointer-events-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10 text-sm font-semibold text-white backdrop-blur-sm active:bg-white/25"
        style={{ touchAction: "none" }}
      >
        Jump
      </button>
      <button
        onTouchStart={(e) => {
          e.preventDefault();
          setInput({ sprint: true });
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          setInput({ sprint: false });
        }}
        onTouchCancel={(e) => {
          e.preventDefault();
          setInput({ sprint: false });
        }}
        className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xs font-semibold text-white backdrop-blur-sm active:bg-white/25"
        style={{ touchAction: "none" }}
      >
        Sprint
      </button>
    </div>
  );
}
