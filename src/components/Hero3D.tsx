import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function ForgeScene({ pausedRef }: { pausedRef: React.RefObject<boolean> }) {
  const group = useRef<THREE.Group>(null);
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e: PointerEvent) => {
      target.current.x = (e.clientX / window.innerWidth - 0.5) * 0.6;
      target.current.y = (e.clientY / window.innerHeight - 0.5) * 0.4;
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  useFrame((state, delta) => {
    if (!group.current) return;
    const d = Math.min(delta, 1 / 30);
    if (!pausedRef.current && !document.hidden) {
      group.current.rotation.y += d * 0.4;
      group.current.rotation.x += (target.current.y - group.current.rotation.x) * 0.03;
      group.current.position.y = Math.sin(state.clock.elapsedTime * 1.1) * 0.06;
    }
  });

  const particles = Array.from({ length: 40 }, (_, i) => {
    const angle = (i / 40) * Math.PI * 2;
    return [Math.cos(angle) * 2.6, Math.sin(angle * 2) * 1.2, -1 - (i % 5) * 0.3] as const;
  });

  return (
    <group ref={group}>
      <mesh>
        <torusKnotGeometry args={[0.75, 0.24, 160, 24]} />
        <meshStandardMaterial color="#d6ff3f" metalness={0.85} roughness={0.25} />
      </mesh>
      {/* Dumbbell built from boxes + cylinders, floating below the knot */}
      <group position={[0, -1.6, 0.4]} rotation={[0, 0, 0.35]}>
        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.09, 0.09, 1.8, 20]} />
          <meshStandardMaterial color="#888888" metalness={0.9} roughness={0.3} />
        </mesh>
        {[-0.85, -0.62, 0.62, 0.85].map((x, i) => (
          <mesh key={i} position={[x, 0, 0]}>
            <boxGeometry args={[0.18, 0.7, 0.7]} />
            <meshStandardMaterial color={i % 2 === 0 ? "#222222" : "#d6ff3f"} metalness={0.6} roughness={0.4} />
          </mesh>
        ))}
      </group>
      {particles.map((p, i) => (
        <mesh key={i} position={[p[0], p[1], p[2]]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color="#d6ff3f" />
        </mesh>
      ))}
    </group>
  );
}

export default function Hero3D({ paused }: { paused: boolean }) {
  const pausedRef = useRef(paused);
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduced) {
    return (
      <div className="hero-3d" role="img" aria-label="Minh họa tạ và khối kim loại volt của phòng gym FORGE">
        <div className="poster">🏋️ ⚡ 🏋️</div>
      </div>
    );
  }

  return (
    <div className="hero-3d" role="img" aria-label="Cảnh 3D khối kim loại volt và tạ xoay theo chuột, nút Pause dừng chuyển động">
      <Canvas dpr={[1, 1.75]} camera={{ position: [0, 0, 5.5], fov: 45 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[4, 5, 4]} intensity={1.6} />
        <pointLight position={[-4, -2, 3]} intensity={0.8} color="#d6ff3f" />
        <ForgeScene pausedRef={pausedRef} />
      </Canvas>
    </div>
  );
}
