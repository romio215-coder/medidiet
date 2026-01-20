import React from 'react';

interface LargeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
}

export function LargeButton({ children, className = '', variant = 'primary', ...props }: LargeButtonProps) {
  const baseStyle = "w-full py-4 px-6 text-xl kawaii-button flex items-center justify-center";

  const variants = {
    // Glossy Green
    primary: "bg-[#69F0AE] text-[#00695C] border-none hover:bg-[#B9F6CA]",
    // Glossy Blue/White
    secondary: "bg-white text-[#FF8A80] border-4 border-[#FFCDD2] hover:bg-[#FFEBEE]",
    // Glossy Pink
    danger: "bg-[#FF8A80] text-white hover:bg-[#FFCDD2] hover:text-[#D32F2F]",
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      <span className="relative z-10 drop-shadow-sm flex items-center gap-2">
        {variant === 'primary' && '✨'}
        {children}
        {variant === 'primary' && '✨'}
      </span>
      {/* Glossy Reflection */}
      <div className="absolute top-0 left-0 w-full h-[40%] bg-white/40 rounded-t-full pointer-events-none"></div>
    </button>
  );
}
