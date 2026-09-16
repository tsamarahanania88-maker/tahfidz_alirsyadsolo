import React from "react";

interface ZiyadahTahfidzLogoProps {
  className?: string;
  variant?: "full-color" | "white-badge" | "light-contrast";
  width?: number | string;
  height?: number | string;
}

/**
 * Official Ziyadah Tahfidz Excellence Program Logo
 * Preserves the exact graphic design from MMT 2 X 1_20260915_204930_0000.png:
 * - Top: Arabic calligraphy "زيادة" in deep forest green (#004724)
 * - Middle: "TAHFIDZ" in heavy italic emerald green (#009B4D)
 * - Bottom: Bright yellow rounded banner (#FFDD00) with "EXCELLENCE PROGRAM" in dark green
 */
export const ZiyadahTahfidzLogo: React.FC<ZiyadahTahfidzLogoProps> = ({
  className = "w-36 h-auto",
  variant = "full-color",
}) => {
  // If variant is white-badge, wrap in a crisp white rounded plaque with subtle border
  if (variant === "white-badge") {
    return (
      <div className={`bg-white/95 backdrop-blur-xs px-2.5 py-1.5 rounded-lg shadow-md border border-amber-200/60 flex items-center justify-center shrink-0 ${className}`}>
        <ZiyadahTahfidzLogoSvg />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <ZiyadahTahfidzLogoSvg />
    </div>
  );
};

export const ZiyadahTahfidzLogoSvg: React.FC<{
  primaryGreen?: string;
  brightGreen?: string;
  yellowBanner?: string;
}> = ({
  primaryGreen = "#004724",
  brightGreen = "#009B4D",
  yellowBanner = "#FFDD00",
}) => {
  return (
    <svg
      viewBox="0 0 250 185"
      className="w-full h-auto select-none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 1. TOP SECTION: ARABIC CALLIGRAPHY "زيادة" */}
      <g fill={primaryGreen}>
        {/* Dot above Zay (far right) */}
        <rect x="220" y="8" width="15" height="15" rx="2" />

        {/* Letter Zay (ز) */}
        <path
          d="M 220 34 L 235 34 L 235 76 C 235 98 226 112 204 112 L 200 100 C 215 100 220 90 220 78 L 220 34 Z"
        />

        {/* Two dots below Yaa (ـيـ) */}
        <rect x="168" y="104" width="13" height="13" rx="2" />
        <rect x="187" y="104" width="13" height="13" rx="2" />

        {/* Baseline connecting Yaa to Zay */}
        <rect x="156" y="82" width="65" height="16" />

        {/* Letter Alif (ا) */}
        <rect x="156" y="32" width="17" height="66" rx="1.5" />

        {/* Letter Dal (د) */}
        <path
          d="M 98 34 L 115 34 L 115 82 L 148 82 L 148 98 L 98 98 Z"
        />

        {/* Two dots above Taa Marbutah (far left) */}
        <rect x="19" y="8" width="15" height="15" rx="2" />
        <rect x="39" y="8" width="15" height="15" rx="2" />

        {/* Letter Taa Marbutah (ة) */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M 12 34 C 7 34 4 37 4 42 L 4 90 C 4 95 7 98 12 98 L 64 98 C 69 98 72 95 72 90 L 72 42 C 72 37 69 34 64 34 Z M 20 48 C 20 46 22 44 25 44 L 51 44 C 54 44 56 46 56 48 L 56 84 C 56 86 54 88 51 88 L 25 88 C 22 88 20 86 20 84 Z"
        />
      </g>

      {/* 2. MIDDLE SECTION: "TAHFIDZ" */}
      <text
        x="4"
        y="138"
        fill={brightGreen}
        fontFamily="Montserrat, 'Arial Black', -apple-system, sans-serif"
        fontWeight="900"
        fontStyle="italic"
        fontSize="38"
        letterSpacing="-0.5px"
        transform="skewX(-10)"
      >
        TAHFIDZ
      </text>

      {/* 3. BOTTOM SECTION: YELLOW BANNER WITH "EXCELLENCE PROGRAM" */}
      <rect
        x="4"
        y="148"
        width="242"
        height="32"
        rx="8"
        fill={yellowBanner}
      />
      <text
        x="125"
        y="170"
        fill={primaryGreen}
        fontFamily="Montserrat, -apple-system, Arial, sans-serif"
        fontWeight="800"
        fontSize="13"
        letterSpacing="1.8px"
        textAnchor="middle"
      >
        EXCELLENCE PROGRAM
      </text>
    </svg>
  );
};

export default ZiyadahTahfidzLogo;
