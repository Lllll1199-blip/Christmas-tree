// @ts-nocheck
// Disabling type checking for this file to resolve R3F intrinsic element type errors
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SnowProps {
  count?: number;
}

export const Snow: React.FC<SnowProps> = ({ count = 200 }) => {
  const mesh = useRef<THREE.InstancedMesh>(null);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 50;
      const y = Math.random() * 25;
      const z = (Math.random() - 0.5) * 50;
      const speed = 0.02 + Math.random() * 0.06;
      const size = 0.03 + Math.random() * 0.06; // Roughly 0.5-2px relative to scene scale
      const driftSpeed = 0.2 + Math.random() * 0.5;
      const driftOffset = Math.random() * Math.PI * 2;
      temp.push({ x, y, z, speed, size, driftSpeed, driftOffset });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    particles.forEach((p, i) => {
      // Fall down
      p.y -= p.speed;
      
      // Drift horizontally
      const currentX = p.x + Math.sin(time * p.driftSpeed + p.driftOffset) * 0.5;
      const currentZ = p.z + Math.cos(time * p.driftSpeed * 0.8 + p.driftOffset) * 0.5;

      // Wrap around
      if (p.y < -2) {
        p.y = 22;
        p.x = (Math.random() - 0.5) * 50;
        p.z = (Math.random() - 0.5) * 50;
      }

      dummy.position.set(currentX, p.y, currentZ);
      dummy.scale.setScalar(p.size);
      dummy.updateMatrix();
      
      if (mesh.current) {
        mesh.current.setMatrixAt(i, dummy.matrix);
      }
    });
    
    if (mesh.current) {
      mesh.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.7} />
    </instancedMesh>
  );
};