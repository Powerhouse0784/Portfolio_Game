"use client";

import { ENTRANCE_Z } from "@/lib/constants/zones";
import { getZoneBenchSpots } from "@/lib/world/benchSpots";
import LampPost from "./LampPost";
import Bench from "./Bench";
import Dustbin from "./Dustbin";

const LAMP_SPACING = 12;
const LAMP_OFFSET_X = 3.2; // either side of the entrance path

export default function PropField() {
  const lampCount = Math.floor((ENTRANCE_Z - 12) / LAMP_SPACING);
  const lamps = Array.from({ length: lampCount }, (_, i) => {
    const z = ENTRANCE_Z - 8 - i * LAMP_SPACING;
    return [
      { position: [-LAMP_OFFSET_X, 0, z] as [number, number, number] },
      { position: [LAMP_OFFSET_X, 0, z] as [number, number, number] },
    ];
  }).flat();

  const benchSpots = getZoneBenchSpots();

  return (
    <>
      {lamps.map((lamp, i) => (
        <LampPost key={i} position={lamp.position} />
      ))}

      {benchSpots.map((spot, i) => (
        <group key={i}>
          <Bench position={spot.position} rotationY={spot.rotationY} />
          <Dustbin position={[spot.position[0], spot.position[1], spot.position[2] - 1]} />
        </group>
      ))}
    </>
  );
}
