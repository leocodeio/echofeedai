"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import CommonHeader from "@/components/common/CommonHeader";

// function SpinningLogo() {
//   const groupRef = useRef<THREE.Group>(null);

//   useFrame((state, delta) => {
//     state;
//     if (groupRef.current) {
//       groupRef.current.rotation.y += delta * 0.5;
//     }
//   });

//   return (
//     <group ref={groupRef}>
//       <mesh position={[0, 0, 0]}>
//         <boxGeometry args={[1, 1, 1]} />
//         <meshStandardMaterial color="#333333" />
//       </mesh>
//       <mesh position={[0.5, 0.5, 0.5]}>
//         <boxGeometry args={[0.5, 0.5, 0.5]} />
//         <meshStandardMaterial color="#666666" />
//       </mesh>
//       <mesh position={[-0.5, -0.5, -0.5]}>
//         <boxGeometry args={[0.5, 0.5, 0.5]} />
//         <meshStandardMaterial color="#999999" />
//       </mesh>
//     </group>
//   );
// }

function AnimatedBox({
  initialPosition,
}: {
  initialPosition: [number, number, number];
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [targetPosition, setTargetPosition] = useState(
    new THREE.Vector3(...initialPosition)
  );
  const currentPosition = useRef(new THREE.Vector3(...initialPosition));

  const getAdjacentIntersection = (current: THREE.Vector3) => {
    const directions = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    const randomDirection =
      directions[Math.floor(Math.random() * directions.length)];
    return new THREE.Vector3(
      current.x + randomDirection[0] * 3,
      0.5,
      current.z + randomDirection[1] * 3
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const newPosition = getAdjacentIntersection(currentPosition.current);
      newPosition.x = Math.max(-15, Math.min(15, newPosition.x));
      newPosition.z = Math.max(-15, Math.min(15, newPosition.z));
      setTargetPosition(newPosition);
    }, 1000);

    return () => clearInterval(interval);
  }, [currentPosition, getAdjacentIntersection, setTargetPosition]);

  useFrame((state, delta) => {
    state;
    delta;
    if (meshRef.current) {
      currentPosition.current.lerp(targetPosition, 0.1);
      meshRef.current.position.copy(currentPosition.current);
    }
  });

  return (
    <mesh ref={meshRef} position={initialPosition}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#333333" opacity={0.9} transparent />
      <lineSegments>
        <edgesGeometry
          attach="geometry"
          args={[new THREE.BoxGeometry(1, 1, 1)]}
        />
        <lineBasicMaterial attach="material" color="#666666" linewidth={2} />
      </lineSegments>
    </mesh>
  );
}

function Scene() {
  const initialPositions: [number, number, number][] = [
    [-9, 0.5, -9],
    [-3, 0.5, -3],
    [0, 0.5, 0],
    [3, 0.5, 3],
    [9, 0.5, 9],
    [-6, 0.5, 6],
    [6, 0.5, -6],
    [-12, 0.5, 0],
    [12, 0.5, 0],
    [0, 0.5, 12],
  ];

  return (
    <>
      <OrbitControls />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Grid
        renderOrder={-1}
        position={[0, 0, 0]}
        infiniteGrid
        cellSize={1}
        cellThickness={0.5}
        sectionSize={3}
        sectionThickness={1}
        sectionColor={new THREE.Color(0.5, 0.5, 0.5)}
        fadeDistance={50}
      />
      {initialPositions.map((position, index) => (
        <AnimatedBox key={index} initialPosition={position} />
      ))}
    </>
  );
}

export default function Thankyou() {
  return (
    <div className="relative w-full h-screen bg-background text-foreground overflow-hidden">
      <div className="absolute top-0 left-0 right-0 z-20">
        <CommonHeader />
      </div>
      <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10">
        <h1 className="text-6xl font-bold mb-8 max-w-4xl mx-auto">Thank You</h1>
        <h2 className="text-xl mb-10 text-muted-foreground">
          We have received your feedback and will use it to improve our service.
        </h2>
        <Button size="lg">
          <Link to="/feature/generate">Generate Again</Link>
        </Button>
      </div>
      <Canvas
        shadows
        camera={{ position: [30, 30, 30], fov: 50 }}
        className="absolute inset-0"
        style={{ background: "hsl(var(--background))" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
