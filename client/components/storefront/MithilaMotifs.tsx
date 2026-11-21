import React from "react";

interface MotifProps {
  className?: string;
  size?: number;
  color?: string;
}

/**
 * Sacred Mithila Lotus (Kamal) - Folk-art double line aesthetic
 * Symbol of sacred wetland pokhars where makhana blossoms.
 */
export function MithilaLotus({ className = "h-8 w-8", color = "currentColor" }: MotifProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Central Makhana Seed Pod */}
      <circle cx="50" cy="50" r="10" stroke={color} strokeWidth="2.2" fill="none" />
      <circle cx="50" cy="50" r="5" fill={color} opacity="0.8" />
      <circle cx="47" cy="46" r="1.5" fill="#FFF" />

      {/* Inner Petals with fine Madhubani Kachni lines */}
      <path
        d="M50 40C44 28 50 16 50 16C50 16 56 28 50 40Z"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M50 60C44 72 50 84 50 84C50 84 56 72 50 60Z"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M40 50C28 44 16 50 16 50C16 50 28 56 40 50Z"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M60 50C72 44 84 50 84 50C84 50 72 56 60 50Z"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />

      {/* Diagonal Outer Petals with Mithila Kachni hatching */}
      <path
        d="M43 43C33 33 24 38 24 38C24 38 29 47 39 49"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M57 43C67 33 76 38 76 38C76 38 71 47 61 49"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M43 57C33 67 24 62 24 62C24 62 29 53 39 51"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M57 57C67 67 76 62 76 62C76 62 71 53 61 51"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Decorative fine-line points */}
      <circle cx="50" cy="12" r="2.2" fill={color} />
      <circle cx="50" cy="88" r="2.2" fill={color} />
      <circle cx="12" cy="50" r="2.2" fill={color} />
      <circle cx="88" cy="50" r="2.2" fill={color} />
    </svg>
  );
}

/**
 * Mithila Heritage Double-Border Ribbon with geometric diamond-hatching
 */
export function MithilaBorderRibbon({ className = "w-full h-3" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`} aria-hidden="true">
      <svg
        className="w-full h-full preserve-3d"
        viewBox="0 0 1200 12"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line x1="0" y1="1" x2="1200" y2="1" stroke="#E8B84E" strokeWidth="1.5" strokeOpacity="0.8" />
        <line x1="0" y1="11" x2="1200" y2="11" stroke="#E8B84E" strokeWidth="1.5" strokeOpacity="0.8" />
        <pattern id="mithila-diamonds-v2" width="20" height="12" patternUnits="userSpaceOnUse">
          <path d="M0 6L10 1L20 6L10 11Z" stroke="#E8B84E" strokeWidth="1" fill="none" opacity="0.75" />
          <circle cx="10" cy="6" r="1.5" fill="#702C32" />
        </pattern>
        <rect x="0" y="1" width="1200" height="10" fill="url(#mithila-diamonds-v2)" />
      </svg>
    </div>
  );
}

/**
 * Traditional Maithil Matsya (Twin Fish) - Symbol of good fortune and freshwater pond ecology
 */
export function MithilaMatsya({ className = "h-6 w-6", color = "currentColor" }: MotifProps) {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M20 30C28 18 52 18 60 30C52 42 28 42 20 30Z"
        stroke={color}
        strokeWidth="2.2"
        fill="none"
      />
      <circle cx="28" cy="30" r="2.5" fill={color} />
      <circle cx="28.5" cy="29.5" r="0.8" fill="#FFF" />
      <path d="M40 24C44 20 48 22 46 25" stroke={color} strokeWidth="1.6" />
      <path d="M38 28C41 30 41 33 38 34" stroke={color} strokeWidth="1.4" />
      <path d="M44 28C47 30 47 33 44 34" stroke={color} strokeWidth="1.4" />
      <path d="M60 30L68 22M60 30L68 38" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      {/* Water Ripple Waves */}
      <path
        d="M15 54C22 51 28 57 35 54C42 51 48 57 55 54C62 51 68 57 75 54"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.75"
      />
    </svg>
  );
}

/**
 * Symmetrical Ornate Divider with Central Mithila Lotus Blossom
 */
export function MithilaDivider({ className = "my-6", text }: { className?: string; text?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`} aria-hidden="true">
      <div className="flex-1 max-w-xs h-[1px] bg-gradient-to-r from-transparent via-[#E8B84E]/70 to-[#702C32]" />
      <div className="flex items-center gap-2 text-[#702C32]">
        <span className="text-xs font-serif tracking-[0.2em] text-[#C65D35] uppercase">✦</span>
        <MithilaLotus className="h-5 w-5 text-[#E8B84E]" />
        {text && (
          <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#33251F]/85 font-serif">
            {text}
          </span>
        )}
        <span className="text-xs font-serif tracking-[0.2em] text-[#C65D35] uppercase">✦</span>
      </div>
      <div className="flex-1 max-w-xs h-[1px] bg-gradient-to-l from-transparent via-[#E8B84E]/70 to-[#702C32]" />
    </div>
  );
}

/**
 * Traditional Mithila Surya (Radiant Sun Motif)
 */
export function MithilaSun({ className = "h-8 w-8", color = "currentColor" }: MotifProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="16" stroke={color} strokeWidth="2.2" />
      <circle cx="50" cy="50" r="8" fill={color} opacity="0.85" />
      <circle cx="50" cy="50" r="3" fill="#FFF" />
      {/* 8 Primary Sun Rays */}
      <path d="M50 14L50 26M50 74L50 86M14 50L26 50M74 50L86 50" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M24.5 24.5L33 33M67 67L75.5 75.5M75.5 24.5L67 33M33 67L24.5 75.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle cx="50" cy="8" r="1.8" fill={color} />
      <circle cx="50" cy="92" r="1.8" fill={color} />
      <circle cx="8" cy="50" r="1.8" fill={color} />
      <circle cx="92" cy="50" r="1.8" fill={color} />
    </svg>
  );
}

/**
 * Traditional Mithila Corner Flourish
 */
export function MithilaCorner({ className = "h-6 w-6 text-[#E8B84E]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
      <path d="M4 36V12C4 7.58 7.58 4 12 4H36" stroke="currentColor" strokeWidth="2" />
      <path d="M10 36V16C10 12.69 12.69 10 16 10H36" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 2" />
      <circle cx="4" cy="4" r="2.5" fill="currentColor" />
    </svg>
  );
}

/**
 * Mithila Mayur (Peacock Motif) - Folk art bird of Mithila wetland abundance
 */
export function MithilaPeacock({ className = "h-10 w-10", color = "currentColor" }: MotifProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Body & S-curve Neck */}
      <path
        d="M48 68 C38 68, 30 58, 32 46 C34 34, 44 26, 48 20 C50 17, 54 18, 52 23 C48 32, 54 40, 58 48 C62 56, 58 68, 48 68 Z"
        stroke={color}
        strokeWidth="2.2"
        fill="none"
      />
      {/* Beak & Eye */}
      <path d="M48 20 L42 22" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle cx="49" cy="22" r="1.5" fill={color} />
      {/* Crest plumes */}
      <path d="M52 18 C54 12, 58 10, 60 12" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="61" cy="12" r="1.5" fill={color} />
      {/* Elaborate Madhubani Tail Feathers */}
      <path d="M56 54 C66 48, 76 52, 82 62 C76 68, 66 64, 58 62" stroke={color} strokeWidth="1.8" />
      <circle cx="74" cy="58" r="3" stroke={color} strokeWidth="1.5" fill="#E8B84E" />
      <path d="M52 64 C64 68, 72 76, 76 86 C68 86, 60 80, 50 72" stroke={color} strokeWidth="1.8" />
      <circle cx="68" cy="78" r="3" stroke={color} strokeWidth="1.5" fill="#E8B84E" />
    </svg>
  );
}
