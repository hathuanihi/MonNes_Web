"use client";

import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-rose-50 via-orange-100 to-yellow-100 text-rose-900">
      <div className="flex items-center space-x-3">
        <div className="w-4 h-4 bg-[#FF086A] rounded-full animate-pulse-fast"></div>
        <div 
          className="w-4 h-4 bg-[#FB5D5D] rounded-full animate-pulse-fast" 
          style={{ animationDelay: '0.2s' }}
        ></div>
        <div 
          className="w-4 h-4 bg-[#F19BDB] rounded-full animate-pulse-fast" 
          style={{ animationDelay: '0.4s' }}
        ></div>
      </div>
      <p 
        className="mt-6 text-xl font-semibold tracking-wide text-rose-800 font-bevietnampop"
        style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
      >
        Đang tải ứng dụng...
      </p>

      <style jsx global>{`
        @keyframes pulse-fast {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(0.9);
          }
        }
        .animate-pulse-fast {
          animation: pulse-fast 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .font-bevietnampop {
           font-family: 'Be Vietnam Pro', 'Inter', 'Montserrat', 'Arial', sans-serif;
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;