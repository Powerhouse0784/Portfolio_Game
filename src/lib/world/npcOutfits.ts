import { mulberry32 } from "@/lib/utils/geometry";

export type NPCOutfit = {
  shirt: string;
  pants: string;
  skin: string;
  hair: string;
  shoe: string;
};

const SHIRT_COLORS = ["#2b3a55", "#4a7a3f", "#7a3f4a", "#3f4a7a", "#7a6a3f", "#3f7a6a"];
const PANTS_COLORS = ["#33363f", "#4a3f33", "#3f3f4a"];
const SKIN_COLORS = ["#e0a978", "#c98d5e", "#8d5a3c", "#f2c9a0"];
const HAIR_COLORS = ["#2b2018", "#1a1a1a", "#4a3320", "#6b4423"];
const SHOE_COLORS = ["#f4f4f2", "#2b2b2b", "#7a3f3f"];

/** Deterministic per-NPC outfit so reloads don't reshuffle everyone's clothes. */
export function generateOutfit(seedIndex: number): NPCOutfit {
  const rand = mulberry32(9500 + seedIndex);
  const pick = (arr: string[]) => arr[Math.floor(rand() * arr.length)];
  return {
    shirt: pick(SHIRT_COLORS),
    pants: pick(PANTS_COLORS),
    skin: pick(SKIN_COLORS),
    hair: pick(HAIR_COLORS),
    shoe: pick(SHOE_COLORS),
  };
}
