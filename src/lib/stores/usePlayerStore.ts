import { create } from "zustand";

export type MovementInput = {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
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
    forward: false,
    backward: false,
    left: false,
    right: false,
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
}));
