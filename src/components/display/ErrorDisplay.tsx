"use client";

import React from 'react';

interface ErrorDisplayProps {
  title?: string;
  message: string;
  onRetry?: () => void; 
}

const ErrorDisplay = ({ 
  title = "Oops! Đã có lỗi xảy ra", 
  message,
  onRetry
}: ErrorDisplayProps) => {
  
  const handleAction = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-rose-50 via-orange-100 to-yellow-100 p-6">
      <div className="text-center space-y-6 bg-white/70 p-10 rounded-2xl shadow-xl backdrop-blur-lg border border-white/40 max-w-lg">
        <div className="text-6xl text-red-500">!</div>
        <h1 className="text-4xl font-bold text-rose-900 font-bevietnampop">
          {title}
        </h1>
        <p className="text-lg text-rose-800">
          {message}
        </p>
        <button
          onClick={handleAction}
          className="inline-block bg-gradient-to-r from-[#FF086A] to-[#FB5D5D] text-white font-extrabold px-10 py-4 rounded-full shadow-lg ring-4 ring-[#FF086A]/30 transition-all duration-300 ease-in-out transform hover:scale-105 hover:brightness-110 text-lg tracking-wide font-bevietnampop"
        >
          {onRetry ? 'Thử lại' : 'Tải lại trang'}
        </button>
      </div>
      <style jsx global>{`
        .font-bevietnampop {
           font-family: 'Be Vietnam Pro', 'Inter', 'Montserrat', 'Arial', sans-serif;
        }
      `}</style>
    </div>
  );
};

export default ErrorDisplay;