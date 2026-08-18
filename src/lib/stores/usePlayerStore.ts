import { create } from "zustand";

export type MovementInput = {
  // Analog axes, both -1..1. moveY: forward(+1)/backward(-1). moveX: right(+1)/left(-1).
  // Keyboard sets these to a clean ±1/0 (a key is either fully pressed or not), the
  // touch joystick sets continuous values proportional to how far it's pushed —
  // that's what gives the joystick a real analog feel instead of a twitchy on/off
  // threshold where any small nudge instantly meant full speed.
  moveX: number;
  moveY: number;
  sprint: boolean;
  jump: boolean;
};

export type PlayerState = {
  // Live transform (updated every frame by CharacterController, read by camera/UI)
  position: [number, number, number];
  rotationY: number;
  isGrounded: boolean;
  isSprinting: boolean;
  isMoving: boolean;

  // Extra per-frame values that only the character rig's procedural animation
  // needs (jump height/fall speed for airborne pose, turn rate for lean-into-turn).
  verticalVelocity: number;
  turnInput: number;

  // Input snapshot (written by input hooks, read by CharacterController)
  input: MovementInput;

  // Actions
  setInput: (partial: Partial<MovementInput>) => void;
  setTransform: (position: [number, number, number], rotationY: number) => void;
  setGrounded: (grounded: boolean) => void;
  setMoving: (moving: boolean, sprinting: boolean) => void;
  setAnimState: (verticalVelocity: number, turnInput: number) => void;
  resetPosition: () => void;
  /** Bumped (not booleaned) so repeated presses always trigger a fresh reset even
   *  if the previous one hasn't been "seen" yet. CharacterController watches this
   *  and actually teleports the physics body — resetPosition() alone only updates
   *  published state, which gets silently overwritten by the physics body's real
   *  position on the very next frame. */
  resetRequestId: number;
  requestReset: () => void;
};

// Just inside the entrance gate (ENTRANCE_Z = 70), facing north into the plaza.
const SPAWN_POINT: [number, number, number] = [0, 1.2, 63];

export const usePlayerStore = create<PlayerState>((set) => ({
  position: SPAWN_POINT,
  // Forward is defined as (sin(rotationY), 0, cos(rotationY)); PI faces -z (north,
  // into the park) so the player starts looking at the plaza, not out the gate.
  rotationY: Math.PI,
  isGrounded: true,
  isSprinting: false,
  isMoving: false,
  verticalVelocity: 0,
  turnInput: 0,

  input: {
    moveX: 0,
    moveY: 0,
    sprint: false,
    jump: false,
  },

  setInput: (partial) =>
    set((state) => ({ input: { ...state.input, ...partial } })),

  setTransform: (position, rotationY) => set({ position, rotationY }),

  setGrounded: (grounded) => set({ isGrounded: grounded }),

  setMoving: (moving, sprinting) =>
    set({ isMoving: moving, isSprinting: sprinting }),

  setAnimState: (verticalVelocity, turnInput) => set({ verticalVelocity, turnInput }),

  resetPosition: () => set({ position: SPAWN_POINT, rotationY: Math.PI }),
  resetRequestId: 0,
  requestReset: () => set((s) => ({ resetRequestId: s.resetRequestId + 1 })),
}));
