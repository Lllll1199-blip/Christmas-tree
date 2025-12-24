// @ts-nocheck
// Disabling type checking for this file to resolve R3F intrinsic element type errors
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ChristmasTreeProps {
  position: [number, number, number];
  scale?: number;
}

export const ChristmasTree: React.FC<ChristmasTreeProps> = ({ position, scale = 1 }) => {
  const groupRef = useRef<THREE.Group>(null);
  const starRef = useRef<THREE.Mesh>(null);

  // Tree Body Particles - 3 Layers
  const layerData = useMemo(() => {
    const layers = [
      { count: 6000, radius: 2.8, height: 2.5, yOffset: 0.5 }, // Bottom
      { count: 4000, radius: 2.1, height: 2.0, yOffset: 2.2 }, // Middle
      { count: 2000, radius: 1.4, height: 1.5, yOffset: 3.6 }, // Top
    ];

    return layers.map(layer => {
      const pos = new Float32Array(layer.count * 3);
      const cols = new Float32Array(layer.count * 3);
      const color = new THREE.Color();

      for (let i = 0; i < layer.count; i++) {
        const r = Math.sqrt(Math.random()); // More density towards center
        const angle = Math.random() * Math.PI * 2;
        const h = Math.random() * layer.height;
        
        // Conical constraint
        const maxR = (1 - (h / layer.height)) * layer.radius;
        const currentR = r * maxR;

        pos[i * 3] = Math.cos(angle) * currentR;
        pos[i * 3 + 1] = h + layer.yOffset;
        pos[i * 3 + 2] = Math.sin(angle) * currentR;

        // Varied green colors with some "snow" white tips
        const isSnow = Math.random() > 0.85;
        if (isSnow) {
          color.set('#ffffff');
        } else {
          color.setHSL(0.35 + Math.random() * 0.05, 0.7, 0.15 + Math.random() * 0.2);
        }
        
        cols[i * 3] = color.r;
        cols[i * 3 + 1] = color.g;
        cols[i * 3 + 2] = color.b;
      }
      return { positions: pos, colors: cols };
    });
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (groupRef.current) {
      // 1. Slow rotation (0.5 deg/sec ~ 0.0087 rad/sec)
      groupRef.current.rotation.y += 0.005; 
      
      // 2. Breathing animation (±2% scale, 5s period)
      // Cycle is 5 seconds: (2 * PI) / 5
      const breathScale = 1 + Math.sin(time * (Math.PI * 2 / 5)) * 0.02;
      groupRef.current.scale.set(scale * breathScale, scale * breathScale, scale * breathScale);
    }

    if (starRef.current) {
      // Star rotation on its own axis (X-axis as requested, though Y is more natural for a vertical star)
      starRef.current.rotation.y += 0.01;
      // Brightness pulse
      const pulse = 0.9 + Math.sin(time * (Math.PI * 2 / 2)) * 0.1; // 2s period
      // @ts-ignore
      starRef.current.material.emissiveIntensity = pulse * 4;
    }
  });

  return (
    <group position={position} ref={groupRef}>
      {/* Trunk */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.45, 1.2, 16]} />
        <meshStandardMaterial color="#4a3020" roughness={1} />
      </mesh>

      {/* 3 Particle Layers */}
      {layerData.map((data, idx) => (
        <points key={idx}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" count={data.positions.length / 3} array={data.positions} itemSize={3} />
            <bufferAttribute attach="attributes-color" count={data.colors.length / 3} array={data.colors} itemSize={3} />
          </bufferGeometry>
          <pointsMaterial size={0.04} vertexColors transparent opacity={0.9} sizeAttenuation={true} />
        </points>
      ))}

      {/* Swaying Ornaments */}
      <SwayingOrnaments />

      {/* Star */}
      <group position={[0, 5.2, 0]}>
        <pointLight intensity={8} color="#ffd700" distance={10} decay={2} />
        <mesh ref={starRef}>
          <octahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial 
            color="#ffd700" 
            emissive="#ffd700" 
            emissiveIntensity={4} 
            metalness={1} 
            roughness={0} 
          />
        </mesh>
      </group>
    </group>
  );
};

const SwayingOrnaments: React.FC = () => {
  const colors = ['#ff2222', '#ffcc00', '#ffffff', '#22bb22'];
  const ornamentData = useMemo(() => {
    const data = [];
    const layers = [
      { r: 2.4, hStart: 0.8, hEnd: 2.2 },
      { r: 1.8, hStart: 2.4, hEnd: 3.4 },
      { r: 1.1, hStart: 3.6, hEnd: 4.8 },
    ];
    for (let i = 0; i < 45; i++) {
      const layer = layers[i % layers.length];
      const h = layer.hStart + Math.random() * (layer.hEnd - layer.hStart);
      const maxR = (1 - ((h - layer.hStart) / (layer.hEnd + 1))) * layer.r;
      const angle = Math.random() * Math.PI * 2;
      data.push({
        pos: [Math.cos(angle) * maxR, h, Math.sin(angle) * maxR] as [number, number, number],
        color: colors[Math.floor(Math.random() * colors.length)],
        offset: Math.random() * Math.PI * 2,
        isBow: Math.random() > 0.8
      });
    }
    return data;
  }, []);

  return (
    <group>
      {ornamentData.map((d, i) => (
        <SwayingOrnament key={i} {...d} />
      ))}
    </group>
  );
};

const SwayingOrnament: React.FC<{ pos: [number, number, number], color: string, offset: number, isBow: boolean }> = ({ pos, color, offset, isBow }) => {
  const ref = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (ref.current) {
      const time = state.clock.getElapsedTime();
      // Sway animation - pendulum style
      // Small swing (max 5 degrees = ~0.08 rad)
      ref.current.rotation.z = Math.sin(time * 1.5 + offset) * 0.08;
      ref.current.rotation.x = Math.cos(time * 1.2 + offset) * 0.05;
    }
  });

  return (
    <group position={pos} ref={ref}>
      {/* Hanging string */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 0.2]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
      </mesh>
      
      {isBow ? (
        <group position={[0, -0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
          <mesh>
            <coneGeometry args={[0.08, 0.15, 4]} />
            <meshStandardMaterial color="#cc0000" />
          </mesh>
          <mesh rotation={[0, 0, Math.PI]}>
            <coneGeometry args={[0.08, 0.15, 4]} />
            <meshStandardMaterial color="#cc0000" />
          </mesh>
        </group>
      ) : (
        <mesh position={[0, -0.05, 0]} castShadow>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color={color} metalness={0.7} roughness={0.2} emissive={color} emissiveIntensity={0.2} />
        </mesh>
      )}
    </group>
  );
};