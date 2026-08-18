"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlayerStore } from "@/lib/stores/usePlayerStore";
import { ZONES, ZONE_RING_RADIUS, PLAZA_RADIUS, angleToPosition } from "@/lib/constants/zones";
import { WORLD_BOUNDARY_RADIUS } from "@/lib/constants/world";

const MINIMAP_SIZE = 128;
const EXPANDED_SIZE = 380;
const MAP_WORLD_RADIUS = WORLD_BOUNDARY_RADIUS;

function worldToMap(x: number, z: number, mapRadiusPx: number) {
  const scale = mapRadiusPx / MAP_WORLD_RADIUS;
  return { x: x * scale, y: z * scale };
}

function MapContent({ sizePx, showLabels }: { sizePx: number; showLabels: boolean }) {
  const position = usePlayerStore((s) => s.position);
  const rotationY = usePlayerStore((s) => s.rotationY);
  const radiusPx = sizePx / 2;
  const player = worldToMap(position[0], position[2], radiusPx - 10);

  return (
    <svg viewBox={`${-radiusPx} ${-radiusPx} ${sizePx} ${sizePx}`} width={sizePx} height={sizePx}>
      <circle cx={0} cy={0} r={radiusPx - 2} fill="#0d1b12" fillOpacity={0.8} stroke="rgba(255,255,255,0.15)" strokeWidth={1.5} />

      {/* Plaza */}
      <circle cx={0} cy={0} r={worldToMap(PLAZA_RADIUS, 0, radiusPx - 10).x} fill="rgba(255,255,255,0.06)" />

      {ZONES.map((zone) => {
        const [zx, , zz] = angleToPosition(zone.angleDeg, ZONE_RING_RADIUS);
        const p = worldToMap(zx, zz, radiusPx - 10);
        return (
          <g key={zone.id}>
            <circle cx={p.x} cy={p.y} r={showLabels ? 5 : 3} fill={zone.color} />
            {showLabels && (
              <text x={p.x} y={p.y - 9} fontSize={9} fill="white" textAnchor="middle" opacity={0.9}>
                {zone.name}
              </text>
            )}
          </g>
        );
      })}

      <circle cx={0} cy={0} r={showLabels ? 4 : 2.5} fill="#FFB800" />

      <g transform={`translate(${player.x}, ${player.y}) rotate(${(rotationY * 180) / Math.PI})`}>
        <path d="M 0 -7 L 5 6 L 0 3 L -5 6 Z" fill="#38BDF8" stroke="#0d1b12" strokeWidth={0.6} />
      </g>
    </svg>
  );
}

export default function Minimap() {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <button
        onClick={() => setExpanded(true)}
        aria-label="Open full map"
        className="pointer-events-auto fixed left-4 top-4 z-30 overflow-hidden rounded-full border border-white/15 shadow-lg backdrop-blur transition-transform hover:scale-105"
        style={{ width: MINIMAP_SIZE, height: MINIMAP_SIZE }}
      >
        <MapContent sizePx={MINIMAP_SIZE} showLabels={false} />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
            onClick={() => setExpanded(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="rounded-2xl border border-white/10 bg-[#12181f] p-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#FFB800]">Park Map</h3>
                <button
                  onClick={() => setExpanded(false)}
                  aria-label="Close"
                  className="rounded-full p-1 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <MapContent sizePx={EXPANDED_SIZE} showLabels />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
