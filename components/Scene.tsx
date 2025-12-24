// @ts-nocheck
// Disabling type checking for this file to resolve R3F intrinsic element type errors
import React from 'react';
import { ChristmasTree } from './ChristmasTree';
import { Snow } from './Snow';
import { Gift } from './Gift';

export const Scene: React.FC = () => {
  // Global vertical offset to move the "main stage" down (approx "2cm" in visual scene units)
  const yOffset = -2.0;

  // Gift positions around the tree base
  const giftPositions: [number, number, number, string][] = [
    [-1.8, 0, 1.5, '#dc143c'],
    [1.8, 0, 1.2, '#ffd700'],
    [-0.5, 0, 2.5, '#1e90ff'],
    [1.0, 0, 2.8, '#ba55d3'],
    [-3.0, 0, -1.0, '#22c55e'],
    [2.5, 0, -1.5, '#ffffff'],
    [0.2, 0, -2.5, '#ff4d4d'],
  ];

  return (
    <group>
      {/* Falling Snow Particles (kept at original height for full screen coverage) */}
      <Snow count={200} />

      {/* Main Assembly shifted downwards */}
      <group position={[0, yOffset, 0]}>
        {/* The Christmas Tree with Breathing & Rotation */}
        <ChristmasTree position={[0, 0, 0]} scale={1.3} />

        {/* Gifts clustered at the base */}
        {giftPositions.map((pos, idx) => (
          <Gift 
            key={idx} 
            position={[pos[0], pos[1], pos[2]]} 
            color={pos[3]} 
            rotation={[0, Math.random() * Math.PI, 0]}
          />
        ))}

        {/* Central Snow Mound at the base of the tree */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <circleGeometry args={[12, 64]} />
          <meshStandardMaterial 
            color="#ffffff" 
            transparent 
            opacity={0.15} 
            roughness={1}
          />
        </mesh>
      </group>

      {/* Snowy Floor (moved down with the subject) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, yOffset - 0.01, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#0a0a28" />
      </mesh>
      
      {/* Soft spotlight following the tree base */}
      <spotLight 
        position={[0, 10 + yOffset, 0]} 
        intensity={0.5} 
        angle={0.6} 
        penumbra={1} 
        color="#ffffff" 
      />
    </group>
  );
};