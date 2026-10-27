import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { plateColorKg, plateRadiusKg } from "../lib/plates";

const STEEL = "#2a2e2a";
const DARK = "#1a1d1a";
const VOLT = "#D6FF3F";

function Barbell({ plates, withBench }: { plates: number[]; withBench: boolean }) {
  // Plates load outward from the centre on both sides, in the order the
  // plate breakdown lists them (heaviest closest to the centre).
  const renderSide = (side: 1 | -1) => {
    let x = 0.95;
    return plates.map((kg, i) => {
      const thickness = 0.09;
      const centre = side * (x + thickness / 2);
      x += thickness + 0.015;
      return (
        <mesh key={`${side}-${i}`} position={[centre, 1.35, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[plateRadiusKg(kg), plateRadiusKg(kg), thickness, 28]} />
          <meshStandardMaterial color={plateColorKg(kg)} metalness={0.55} roughness={0.4} />
        </mesh>
      );
    });
  };
  return (
    <group>
      {/* bar */}
      <mesh position={[0, 1.35, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.035, 0.035, 2.6, 16]} />
        <meshStandardMaterial color={STEEL} metalness={0.8} roughness={0.3} />
      </mesh>
      {/* collars */}
      {[-0.9, 0.9].map((x) => (
        <mesh key={x} position={[x, 1.35, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.07, 0.07, 0.06, 16]} />
          <meshStandardMaterial color={VOLT} metalness={0.4} roughness={0.4} />
        </mesh>
      ))}
      {renderSide(1)}
      {renderSide(-1)}
      {withBench && (
        <group>
          <mesh position={[0, 0.45, 0]}>
            <boxGeometry args={[1.4, 0.12, 0.45]} />
            <meshStandardMaterial color={DARK} roughness={0.7} />
          </mesh>
          {[-0.55, 0.55].map((x) => (
            <mesh key={x} position={[x, 0.2, 0]}>
              <boxGeometry args={[0.1, 0.4, 0.4]} />
              <meshStandardMaterial color={STEEL} metalness={0.7} roughness={0.35} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}

function Rack() {
  const upright = (x: number, z: number) => (
    <mesh key={`${x}-${z}`} position={[x, 1.1, z]}>
      <boxGeometry args={[0.12, 2.2, 0.12]} />
      <meshStandardMaterial color={STEEL} metalness={0.75} roughness={0.35} />
    </mesh>
  );
  return (
    <group>
      {upright(-1.1, -0.55)}
      {upright(-1.1, 0.55)}
      {upright(1.1, -0.55)}
      {upright(1.1, 0.55)}
      {/* top crossmembers (front/back) and base feet */}
      {[-0.55, 0.55].map((z) => (
        <mesh key={`top-${z}`} position={[0, 2.18, z]}>
          <boxGeometry args={[2.32, 0.1, 0.1]} />
          <meshStandardMaterial color={STEEL} metalness={0.75} roughness={0.35} />
        </mesh>
      ))}
      {[-1.1, 1.1].map((x) => (
        <mesh key={`foot-${x}`} position={[x, 0.06, 0]}>
          <boxGeometry args={[0.14, 0.12, 1.5]} />
          <meshStandardMaterial color={DARK} metalness={0.6} roughness={0.5} />
        </mesh>
      ))}
      {/* safety bars running front-to-back */}
      {[-1.1, 1.1].map((x) => (
        <mesh key={`safe-${x}`} position={[x, 0.95, 0]}>
          <boxGeometry args={[0.08, 0.08, 1.15]} />
          <meshStandardMaterial color={VOLT} metalness={0.5} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

function FloorProps() {
  const dumbbell = (x: number, z: number) => (
    <group key={`${x}-${z}`} position={[x, 0.14, z]}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.03, 0.5, 12]} />
        <meshStandardMaterial color={STEEL} metalness={0.8} roughness={0.3} />
      </mesh>
      {[-0.28, 0.28].map((dx) => (
        <mesh key={dx} position={[dx, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.13, 0.13, 0.07, 20]} />
          <meshStandardMaterial color={DARK} metalness={0.5} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
  // Kettlebell: sphere body + a handle made of three straight bars (an
  // inverted U), so the silhouette reads as a kettlebell without any
  // curved-ring geometry.
  const kettlebell = (x: number, z: number) => (
    <group key={`kb-${x}-${z}`} position={[x, 0, z]}>
      <mesh position={[0, 0.16, 0]}>
        <sphereGeometry args={[0.17, 24, 18]} />
        <meshStandardMaterial color={DARK} metalness={0.5} roughness={0.5} />
      </mesh>
      {[-0.09, 0.09].map((dx) => (
        <mesh key={dx} position={[dx, 0.36, 0]}>
          <boxGeometry args={[0.05, 0.16, 0.05]} />
          <meshStandardMaterial color={STEEL} metalness={0.7} roughness={0.35} />
        </mesh>
      ))}
      <mesh position={[0, 0.44, 0]}>
        <boxGeometry args={[0.23, 0.05, 0.05]} />
        <meshStandardMaterial color={STEEL} metalness={0.7} roughness={0.35} />
      </mesh>
    </group>
  );
  const stack = (x: number, z: number) => (
    <group key={`stack-${x}-${z}`} position={[x, 0, z]}>
      {[0.45, 0.4, 0.35].map((r, i) => (
        <mesh key={i} position={[0, 0.06 + i * 0.11, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[r, r, 0.09, 28]} />
          <meshStandardMaterial color={i === 0 ? "#3a3f3a" : "#8a8f88"} metalness={0.5} roughness={0.45} />
        </mesh>
      ))}
    </group>
  );
  return (
    <group>
      {dumbbell(-2.1, 1.2)}
      {dumbbell(-2.1, -1.1)}
      {kettlebell(2.2, 1.1)}
      {kettlebell(2.2, -1.2)}
      {stack(-2.3, 0.1)}
      {stack(2.4, 0.1)}
    </group>
  );
}

function RigScene({ plates, variant, paused }: { plates: number[]; variant: "rack" | "barbell"; paused: boolean }) {
  const group = useRef<THREE.Group>(null);
  const target = useRef({ x: 0, y: 0 });
  useFrame((state, delta) => {
    if (paused || !group.current) return;
    // Cursor-lerp, never snap: ease the rig toward the pointer.
    target.current.x = state.pointer.y * 0.12;
    target.current.y = state.pointer.x * 0.35;
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, target.current.x, 1 - Math.pow(0.001, delta));
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, target.current.y, 1 - Math.pow(0.001, delta));
  });
  return (
    <group ref={group}>
      {variant === "rack" && <Rack />}
      <Barbell plates={plates} withBench={variant === "rack"} />
      {variant === "rack" && <FloorProps />}
      {/* floor + volt guide line */}
      <mesh position={[0, -0.06, 0]}>
        <boxGeometry args={[9, 0.12, 7]} />
        <meshStandardMaterial color="#141614" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.01, 1.9]}>
        <boxGeometry args={[9, 0.02, 0.06]} />
        <meshStandardMaterial color={VOLT} roughness={0.5} />
      </mesh>
    </group>
  );
}

export default function Rig3D({
  plates, variant, paused, reducedMotion, height,
}: {
  plates: number[];
  variant: "rack" | "barbell";
  paused: boolean;
  reducedMotion: boolean;
  height: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  if (reducedMotion) {
    return (
      <div ref={wrapRef} style={{ height }} className="rig-poster">
        <div className="rig-poster-inner">
          <div className="rig-poster-mark">FORGE RIG</div>
          <p>Squat rack · barbell · bench — 3D paused for reduced motion.</p>
          <p className="mono">LOAD: {plates.length ? `${plates.join(" + ")} / SIDE` : "BAR ONLY"}</p>
        </div>
      </div>
    );
  }
  if (!inView) {
    return (
      <div ref={wrapRef} style={{ height }} className="rig-poster">
        <div className="rig-poster-inner"><p className="mono">RIG STANDBY — SCROLL BACK TO RESUME 3D</p></div>
      </div>
    );
  }
  return (
    <div ref={wrapRef} style={{ height }} className="rig-wrap">
      <Canvas
        dpr={[1, 1.75]}
        frameloop={paused ? "never" : "always"}
        camera={{ position: variant === "rack" ? [3.4, 2.2, 4.6] : [0.6, 1.8, 3.4], fov: 42 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[4, 6, 4]} intensity={1.4} />
        <pointLight position={[-3, 3, 2]} intensity={12} color={VOLT} />
        <RigScene plates={plates} variant={variant} paused={paused} />
      </Canvas>
      {paused && <div className="rig-paused-badge mono">3D PAUSED</div>}
    </div>
  );
}
