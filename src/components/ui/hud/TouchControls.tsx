"use client";

import { useIsTouchDevice } from "@/lib/hooks/useIsTouchDevice";
import VirtualJoystick from "./VirtualJoystick";
import TouchActionButtons from "./TouchActionButtons";

export default function TouchControls() {
  const isTouch = useIsTouchDevice();
  if (!isTouch) return null;

  return (
    <>
      <VirtualJoystick />
      <TouchActionButtons />
    </>
  );
}
