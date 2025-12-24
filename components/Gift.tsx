// @ts-nocheck
// Disabling type checking for this file to resolve R3F intrinsic element type errors
import React from 'react';
import { Float } from '@react-three/drei';

interface GiftProps {
  position: [number, number, number];
  color: string;
  rotation?: [number, number, number];
}

export const Gift: React.FC<GiftProps> = ({ position, color, rotation = [0, 0, 0] }) => {
  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5} position={position}>
      <group rotation={rotation}>
        {/* Main Box */}
        <mesh castShadow>
          <boxGeometry args={[1, 0.8, 1]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
        
        {/* Ribbon Horizontal */}
        <mesh position={[0, 0, 0]} scale={[1.05, 0.2, 1.05]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>

        {/* Ribbon Vertical */}
        <mesh position={[0, 0, 0]} scale={[0.2, 1.05, 1.05]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>

        {/* Bow on Top */}
        <mesh position={[0, 0.45, 0]}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      </group>
    </Float>
  );
};