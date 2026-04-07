"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { createNoise3D } from "simplex-noise";

const noise3D = createNoise3D();

function ParticleField() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 6000;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const { positions, colors, speeds } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.random() * 80 + 10;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      const isFraud = Math.random() < 0.13;
      col[i * 3] = isFraud ? 1.0 : 0.72;
      col[i * 3 + 1] = isFraud ? 0.18 : 0.78;
      col[i * 3 + 2] = isFraud ? 0.33 : 0.94;
      spd[i] = (Math.random() - 0.5) * 0.003;
    }
    return { positions: pos, colors: col, speeds: spd };
  }, [count]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    for (let i = 0; i < count; i++) {
      const x = positions[i * 3] + noise3D(positions[i * 3] * 0.01, t * 0.3, 0) * 0.3;
      const y = positions[i * 3 + 1] + noise3D(0, positions[i * 3 + 1] * 0.01, t * 0.3) * 0.3;
      const z = positions[i * 3 + 2] + noise3D(t * 0.3, 0, positions[i * 3 + 2] * 0.01) * 0.3;
      dummy.position.set(x, y, z);
      const scale = colors[i * 3] > 0.9 ? 0.18 + Math.sin(t + i * 0.3) * 0.08 : 0.12;
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial vertexColors transparent opacity={0.8} />
      <instancedBufferAttribute attach="geometry-attributes-color" args={[colors, 3]} />
    </instancedMesh>
  );
}

function HolographicCore() {
  const icoRef = useRef<THREE.Mesh>(null);
  const ringARef = useRef<THREE.Mesh>(null);
  const ringBRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (icoRef.current) {
      icoRef.current.rotation.x += 0.002;
      icoRef.current.rotation.y += 0.004;
      icoRef.current.rotation.z += 0.0015;
    }
    if (ringARef.current) ringARef.current.rotation.x += 0.003;
    if (ringBRef.current) ringBRef.current.rotation.y += 0.003;
  });

  return (
    <group>
      <mesh ref={icoRef}>
        <icosahedronGeometry args={[4.5, 2]} />
        <meshBasicMaterial color="#818cf8" opacity={0.25} transparent wireframe />
      </mesh>
      <mesh ref={ringARef}>
        <torusGeometry args={[7.5, 0.05, 8, 80]} />
        <meshBasicMaterial color="#06b6d4" opacity={0.3} transparent />
      </mesh>
      <mesh ref={ringBRef} rotation={[0, 0, Math.PI / 3]}>
        <torusGeometry args={[7.5, 0.05, 8, 80]} />
        <meshBasicMaterial color="#818cf8" opacity={0.25} transparent />
      </mesh>
    </group>
  );
}

function ScanPlane() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime();
      ref.current.position.y = 70 - ((t * 28) % 140);
    }
  });
  return (
    <mesh ref={ref} rotation={[0, 0, 0]}>
      <planeGeometry args={[200, 0.3]} />
      <meshBasicMaterial color="#6366f1" opacity={0.1} transparent side={THREE.DoubleSide} />
    </mesh>
  );
}

function CameraController() {
  const { camera } = useThree();
  const targetZ = useRef(120);
  const currentZ = useRef(120);

  useEffect(() => {
    camera.position.z = 120;
    const timer = setTimeout(() => {
      targetZ.current = 32;
    }, 500);
    return () => clearTimeout(timer);
  }, [camera]);

  useFrame(() => {
    currentZ.current += (targetZ.current - currentZ.current) * 0.02;
    camera.position.z = currentZ.current;
  });

  return null;
}

function MouseParallax() {
  const groupRef = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 20;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 20;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.x += (mouse.current.x - groupRef.current.position.x) * 0.04;
      groupRef.current.position.y += (-mouse.current.y - groupRef.current.position.y) * 0.04;
    }
  });

  return (
    <group ref={groupRef}>
      <ParticleField />
      <HolographicCore />
      <ScanPlane />
    </group>
  );
}

export default function Scene() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 120], fov: 55 }}
        dpr={[1, 1.5]}
      >
        <color attach="background" args={["#080616"]} />
        <CameraController />
        <MouseParallax />
        <EffectComposer>
          <Bloom luminanceThreshold={0.55} luminanceSmoothing={0.9} intensity={0.5} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
