"use client";

import { useCallback, useEffect, useState } from "react";

type FullscreenDoc = Document & {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void>;
};
type FullscreenEl = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void>;
};

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    const doc = document as FullscreenDoc;
    // iPhone Safari doesn't support the Fullscreen API for arbitrary elements at
    // all (iPad does) — detect that up front so the button can hide itself there
    // instead of doing nothing when tapped.
    const el = document.documentElement as FullscreenEl;
    setIsSupported(Boolean(el.requestFullscreen || el.webkitRequestFullscreen));

    const onChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement || doc.webkitFullscreenElement));
    };
    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange);
    };
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const doc = document as FullscreenDoc;
    const el = document.documentElement as FullscreenEl;
    try {
      if (document.fullscreenElement || doc.webkitFullscreenElement) {
        if (document.exitFullscreen) await document.exitFullscreen();
        else if (doc.webkitExitFullscreen) await doc.webkitExitFullscreen();
      } else {
        if (el.requestFullscreen) await el.requestFullscreen();
        else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
      }
    } catch {
      // Fullscreen requests can be rejected (no user gesture, unsupported, etc) —
      // fail silently rather than throwing in the user's face over a nice-to-have.
    }
  }, []);

  return { isFullscreen, isSupported, toggleFullscreen };
}
