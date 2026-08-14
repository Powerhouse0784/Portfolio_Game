export default function Dustbin({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.22, 0.18, 0.6, 10]} />
        <meshStandardMaterial color="#2f4f3a" roughness={0.6} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.66, 0]}>
        <cylinderGeometry args={[0.24, 0.24, 0.05, 10]} />
        <meshStandardMaterial color="#1f3a28" roughness={0.5} metalness={0.3} />
      </mesh>
    </group>
  );
}
