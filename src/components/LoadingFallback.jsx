// import React from 'react';
import { Plane } from "lucide-react";

const LoadingFallback = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="relative">
        {/* Animated plane */}
        <div className="animate-bounce">
          <Plane className="w-16 h-16 text-blue-600" />
        </div>

        {/* Animated dots trail */}
        <div className="absolute top-1/2 -left-8 flex space-x-1">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping delay-75"></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping delay-150"></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping delay-300"></div>
        </div>
      </div>

      {/* Loading text */}
      <div className="mt-8 space-y-2 text-center">
        <h2 className="text-xl font-semibold text-gray-800">
          Preparing for Takeoff
        </h2>
        <p className="text-gray-600">
          Please fasten your seatbelt while we load your experience
        </p>
      </div>

      {/* Progress bar */}
      <div className="mt-6 w-64">
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div className="bg-blue-600 h-2 rounded-full animate-[loading_1.5s_ease-in-out_infinite]"></div>
        </div>
      </div>
    </div>
  );
};

// Add custom keyframe animation for the progress bar
const style = document.createElement("style");
style.textContent = `
  @keyframes loading {
    0% { width: 0% }
    50% { width: 100% }
    100% { width: 0% }
  }
`;
document.head.appendChild(style);

export default LoadingFallback;
