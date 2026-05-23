import React from 'react';

interface GiftzeeLogoProps {
  className?: string;
  showText?: boolean;
}

export const GiftzeeLogo: React.FC<GiftzeeLogoProps> = ({ className = "h-16 w-auto", showText = true }) => {
  return (
    <svg 
      viewBox="0 0 500 420" 
      className={className} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      id="giftzee-vector-logo"
    >
      {/* Top Outer Golden Ring */}
      <path 
        d="M 115 150 A 150 150 0 0 1 385 150" 
        stroke="#D4AF37" 
        strokeWidth="6" 
        strokeLinecap="round" 
      />
      {/* Top Inner Golden Ring */}
      <path 
        d="M 135 150 A 130 130 0 0 1 365 150" 
        stroke="#E6C15C" 
        strokeWidth="3" 
        strokeLinecap="round" 
      />

      {/* Bottom Outer Golden Ring */}
      <path 
        d="M 115 280 A 150 150 0 0 0 385 280" 
        stroke="#D4AF37" 
        strokeWidth="6" 
        strokeLinecap="round" 
      />
      {/* Bottom Inner Golden Ring */}
      <path 
        d="M 135 280 A 130 130 0 0 0 365 280" 
        stroke="#E6C15C" 
        strokeWidth="3" 
        strokeLinecap="round" 
      />

      {/* Decorative Elements - Top Hanging Gifts & Stars */}
      {/* Small Left Maroon Gift Box */}
      <rect x="145" y="45" width="22" height="22" rx="3" fill="#7A0026" transform="rotate(-15 145 45)" />
      <path d="M 134 40 L 138 35 M 145 42 L 141 37" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
      <circle cx="139" cy="38" r="2.5" fill="#D4AF37" />

      {/* Small Right Gold Gift Box */}
      <rect x="345" y="60" width="22" height="22" rx="3" fill="#D4AF37" transform="rotate(20 345 60)" />
      <path d="M 353 54 L 357 48 M 361 56 L 366 51" stroke="#7A0026" strokeWidth="2" strokeLinecap="round" />
      <circle cx="359" cy="51" r="2.5" fill="#7A0026" />

      {/* Sparkle Stars - Top Left Gold Star */}
      <path d="M 125 90 L 128 82 L 136 82 L 129 77 L 132 69 L 125 74 L 118 69 L 121 77 L 114 82 L 122 82 Z" fill="#D4AF37" />
      {/* Top Center-Right Maroon Star */}
      <path d="M 225 100 L 229 90 L 239 90 L 231 84 L 235 74 L 225 80 L 215 74 L 219 84 L 211 90 L 221 90 Z" fill="#7A0026" />
      {/* Top Right Big Gold Star */}
      <path d="M 285 110 L 290 98 L 302 98 L 292 91 L 296 79 L 285 86 L 274 79 L 278 91 L 268 98 L 280 98 Z" fill="#C5A55B" />

      {/* Bottom Ornaments */}
      {/* Bottom Left Falling Gold Box */}
      <rect x="110" y="295" width="18" height="18" rx="2" fill="#C5A55B" transform="rotate(12 110 295)" />
      <path d="M 112 291 C 114 286, 120 286, 116 291" stroke="#7A0026" strokeWidth="1.5" fill="none" />

      {/* Bottom Right Hanging Gift Box */}
      <rect x="360" y="290" width="18" height="18" rx="2" fill="#C5A55B" transform="rotate(-18 360 290)" />
      <path d="M 358 285 C 362 281, 368 281, 364 285" stroke="#7A0026" strokeWidth="1.5" fill="none" />

      {/* Small Bot Right Star */}
      <path d="M 355 332 L 357 327 L 362 327 L 358 324 L 360 319 L 355 322 L 350 319 L 352 324 L 348 327 L 353 327 Z" fill="#D4AF37" />

      {/* MAIN TEXT: GIFTZEE */}
      <text 
        x="250" 
        y="225" 
        fontFamily="Consolas, 'Space Grotesk', Georgia, 'Playfair Display', serif" 
        fontWeight="900" 
        fontSize="78" 
        fill="#7A0026" 
        textAnchor="middle" 
        letterSpacing="-1.5"
      >
        Giftzee
      </text>

      {/* Large Gift Box below the title */}
      <g transform="translate(210, 275)">
        {/* Main gift box body - Golden Kraft */}
        <rect x="0" y="25" width="80" height="60" rx="4" fill="#C59A40" />
        
        {/* Lid of the gift box - Golden Kraft */}
        <rect x="-4" y="16" width="88" height="12" rx="2" fill="#D4AF37" />
        
        {/* Vertical Burgundy Ribbon */}
        <rect x="34" y="16" width="12" height="69" fill="#7A0026" />
        
        {/* Ribbon Bow in Burgundy */}
        {/* Left Loop */}
        <path 
          d="M 37 18 C 15 -10, 5 10, 37 18 Z" 
          fill="#7A0026" 
          stroke="#7A0026" 
          strokeWidth="2" 
          strokeLinejoin="round" 
        />
        {/* Right Loop */}
        <path 
          d="M 43 18 C 65 -10, 75 10, 43 18 Z" 
          fill="#7A0026" 
          stroke="#7A0026" 
          strokeWidth="2" 
          strokeLinejoin="round" 
        />
        {/* Ribbon knot */}
        <rect x="34" y="14" width="12" height="8" rx="2" fill="#5F001D" />
        
        {/* Hanging Ribbon Tails */}
        <path 
          d="M 37 20 C 25 35, 15 35, 12 45" 
          stroke="#7A0026" 
          strokeWidth="3.5" 
          strokeLinecap="round" 
          fill="none" 
        />
        <path 
          d="M 43 20 C 55 35, 65 35, 68 45" 
          stroke="#7A0026" 
          strokeWidth="3.5" 
          strokeLinecap="round" 
          fill="none" 
        />
      </g>
    </svg>
  );
};
