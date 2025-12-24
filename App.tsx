// @ts-nocheck
// Disabling type checking for this file to resolve R3F intrinsic element type errors (e.g., 'color', 'ambientLight', 'pointLight')
import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera } from '@react-three/drei';
import { Scene } from './components/Scene';
import { Overlay } from './components/Overlay';

const App: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#05051a]">
      {/* 3D Scene */}
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 6, 18]} fov={40} />
        <color attach="background" args={['#05051a']} />
        
        {/* Cold Environment Lights */}
        <ambientLight intensity={0.2} color="#8888ff" />
        <pointLight position={[0, 15, 0]} intensity={0.5} color="#ffffff" />
        
        <Suspense fallback={null}>
          <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={0.5} />
          <Scene />
        </Suspense>

        <OrbitControls 
          enablePan={false} 
          minDistance={12} 
          maxDistance={30} 
          maxPolarAngle={Math.PI / 2.1} 
          autoRotate={false} 
        />
      </Canvas>

      {/* UI Overlay */}
      <Overlay isLoaded={isLoaded} />

      {/* Loading Screen */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#05051a] z-50">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
            <div className="text-white text-xl animate-pulse font-medium">
              Preparing Your Gift...
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;