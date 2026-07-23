import React from 'react';

interface TwinLogoProps {
  className?: string;
  glow?: boolean;
}

export const TwinLogo: React.FC<TwinLogoProps> = ({
  className = "w-32 h-32",
  glow = false,
}) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Optional glowing effect behind the logo */}
      {glow && (
        <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-xl animate-pulse pointer-events-none" />
      )}
      
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full select-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Hexagon border gradient (Purple) */}
          <linearGradient id="logoHexBorder" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C084FC" /> {/* Purple-400 */}
            <stop offset="50%" stopColor="#9333EA" /> {/* Purple-600 */}
            <stop offset="100%" stopColor="#581C87" /> {/* Purple-900 */}
          </linearGradient>

          {/* Hexagon soft light pastel purple background */}
          <linearGradient id="logoHexBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FAF5FF" /> {/* Extremely light purple */}
            <stop offset="100%" stopColor="#E9D5FF" /> {/* Light purple */}
          </linearGradient>

          {/* Gemini pillars dark-purple gradient */}
          <linearGradient id="logoGeminiGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#9333EA" /> {/* Purple-600 */}
            <stop offset="100%" stopColor="#4C1D95" /> {/* Purple-900 */}
          </linearGradient>
        </defs>

        {/* 1. Outer rounded hexagon */}
        <path
          d="M92.5,23.5 C97,21 103,21 107.5,23.5 L165.5,57 C170,59.5 172.5,64.5 172.5,69.5 L172.5,130.5 C172.5,135.5 170,140.5 165.5,143 L107.5,176.5 C103,179 97,179 92.5,176.5 L34.5,143 C30,140.5 27.5,135.5 27.5,130.5 L27.5,69.5 C27.5,64.5 30,59.5 34.5,57 Z"
          fill="url(#logoHexBg)"
          stroke="url(#logoHexBorder)"
          strokeWidth="6"
          strokeLinejoin="round"
          filter="drop-shadow(0 4px 10px rgba(147, 51, 234, 0.15))"
        />

        {/* 2. Concentric inner thin hexagon border */}
        <path
          d="M92.5,23.5 C97,21 103,21 107.5,23.5 L165.5,57 C170,59.5 172.5,64.5 172.5,69.5 L172.5,130.5 C172.5,135.5 170,140.5 165.5,143 L107.5,176.5 C103,179 97,179 92.5,176.5 L34.5,143 C30,140.5 27.5,135.5 27.5,130.5 L27.5,69.5 C27.5,64.5 30,59.5 34.5,57 Z"
          fill="none"
          stroke="#9333EA"
          strokeWidth="2.5"
          strokeOpacity="0.4"
          transform="scale(0.88)"
          transformOrigin="100 100"
        />

        {/* 3. Centerpiece: Gemini pillars (Roman numeral II) */}
        <g filter="drop-shadow(0 2px 4px rgba(76, 29, 149, 0.3))">
          {/* Top bar (curved, tapered serif) */}
          <path
            d="M58,55 Q100,70 142,55 Q100,50 58,55 Z"
            fill="url(#logoGeminiGrad)"
          />

          {/* Bottom bar (curved, tapered serif) */}
          <path
            d="M58,145 Q100,130 142,145 Q100,150 58,145 Z"
            fill="url(#logoGeminiGrad)"
          />

          {/* Left pillar (organic curving outwards) */}
          <path
            d="M72,58 Q85,100 72,142 Q60,100 72,58 Z"
            fill="url(#logoGeminiGrad)"
          />

          {/* Right pillar (organic curving outwards) */}
          <path
            d="M128,58 Q115,100 128,142 Q140,100 128,58 Z"
            fill="url(#logoGeminiGrad)"
          />
        </g>
      </svg>
    </div>
  );
};
