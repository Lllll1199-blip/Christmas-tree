
import React from 'react';

interface OverlayProps {
  isLoaded: boolean;
}

export const Overlay: React.FC<OverlayProps> = ({ isLoaded }) => {
  return (
    <div className={`absolute inset-0 pointer-events-none flex flex-col items-center p-8 md:p-12 transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Header Content */}
      <div className="mt-20 text-center flex flex-col items-center relative">
        <div className="text-white/80 text-lg md:text-xl font-medium tracking-[0.2em] mb-2 z-10">
          12.25
        </div>
      </div>

      {/* Footer Branding */}
      <div className="mt-auto mb-8 flex flex-col items-center">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 px-10 py-5 rounded-xl shadow-2xl">
          <p className="text-white text-lg md:text-2xl font-semibold tracking-[0.15em]">
            Christmas Greetings from Boway!
          </p>
        </div>
      </div>
    </div>
  );
};