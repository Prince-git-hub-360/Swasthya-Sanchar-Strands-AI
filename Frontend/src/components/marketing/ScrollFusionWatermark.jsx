import React, { useEffect, useState } from 'react';

/**
 * 🌟 ScrollFusionWatermark
 * 
 * - Two FULL Swasthya Sanchar AI brand logos start at the far left (-42vw) and far right (+42vw) edges.
 * - As the user scrolls down towards the Connected Healthcare Showcase, both full logos glide inward
 *   and fuse together into ONE unified glowing brand mark in the center behind the mobile interface.
 * - After the user scrolls past the mobile phone showcase, both full logos smoothly SEPARATE back out
 *   to the left and right margins.
 * - When scrolling back up, they fuse again behind the mobile phone and separate toward the top.
 */
export const ScrollFusionWatermark = () => {
  const [fusion, setFusion] = useState(0); // 0 = separated at edges, 1 = fused in center

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const el = document.getElementById('how-it-works');
          if (el) {
            const rect = el.getBoundingClientRect();
            const vh = window.innerHeight;

            // 1. ENTRY PHASE: Glides inward as the showcase section approaches
            // from rect.top = 95% of viewport down to 15% of viewport
            const entryStart = vh * 0.95;
            const entryEnd = vh * 0.15;
            const entryRatio = Math.max(0, Math.min(1, (entryStart - rect.top) / (entryStart - entryEnd)));

            // 2. EXIT PHASE: Starts separating again as the mobile phone & showcase scroll past upwards
            // from rect.bottom = 75% of viewport down to 10% of viewport
            const exitStart = vh * 0.75;
            const exitEnd = vh * 0.10;
            const exitRatio = Math.max(0, Math.min(1, (rect.bottom - exitEnd) / (exitStart - exitEnd)));

            // Combined ratio: 1 when centered around mobile showcase, smoothly drops to 0 before and after
            const rawRatio = Math.min(entryRatio, exitRatio);
            
            // Smooth cubic ease-in-out (3x^2 - 2x^3)
            const smoothRatio = rawRatio * rawRatio * (3 - 2 * rawRatio);
            setFusion(smoothRatio);
          } else {
            // Fallback scroll coordinates if element ref is initializing
            const scrollY = window.scrollY || window.pageYOffset;
            const startY = 180;
            const peakStart = 900;
            const peakEnd = 1650;
            const exitY = 2350;

            let raw = 0;
            if (scrollY <= startY) {
              raw = 0;
            } else if (scrollY < peakStart) {
              raw = (scrollY - startY) / (peakStart - startY);
            } else if (scrollY <= peakEnd) {
              raw = 1;
            } else if (scrollY < exitY) {
              raw = 1 - (scrollY - peakEnd) / (exitY - peakEnd);
            } else {
              raw = 0;
            }
            const smooth = raw * raw * (3 - 2 * raw);
            setFusion(smooth);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // When fusion is 0: pushed to left/right screen edges (~42vw)
  // When fusion is 1: offset is 0px (locked together in center behind phone!)
  const maxOffsetVw = 42;
  const currentOffsetVw = (1 - fusion) * maxOffsetVw;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none flex items-center justify-center">
      
      {/* Soft Ambient Radial Backdrop Aura that glows brighter when fused */}
      <div 
        className="absolute w-[500px] sm:w-[620px] h-[500px] sm:h-[620px] rounded-full blur-[100px] transition-opacity duration-500 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(15,118,110,0.18) 0%, rgba(20,184,166,0.12) 45%, rgba(245,158,11,0.06) 70%, transparent 85%)',
          opacity: 0.12 + fusion * 0.58,
          transform: `scale(${0.85 + fusion * 0.25})`,
        }}
      />

      {/* 🌟 WATERMARK CONTAINER: Two Full Logos Converging & Separating */}
      <div className="relative flex items-center justify-center w-full max-w-7xl h-[340px]">
        
        {/* ======================================================== */}
        {/* FULL BRAND LOGO 1: Glides from Left Screen Edge ➔ Center  */}
        {/* ======================================================== */}
        <div 
          className="absolute flex items-center justify-center will-change-transform"
          style={{
            transform: `translate3d(-${currentOffsetVw}vw, 0, 0)`,
            transition: 'transform 0.12s cubic-bezier(0.2, 0.8, 0.3, 1)',
            opacity: 0.15 + fusion * 0.15,
          }}
        >
          <img 
            src="/assets/branding/swasthya-sanchar-mark.png" 
            alt="Swasthya Sanchar AI Brand Emblem 1"
            className="w-[260px] sm:w-[320px] h-[260px] sm:h-[320px] object-contain filter drop-shadow-[0_4px_24px_rgba(15,118,110,0.25)] select-none"
            draggable="false"
          />
        </div>

        {/* ======================================================== */}
        {/* FULL BRAND LOGO 2: Glides from Right Screen Edge ➔ Center */}
        {/* ======================================================== */}
        <div 
          className="absolute flex items-center justify-center will-change-transform"
          style={{
            transform: `translate3d(${currentOffsetVw}vw, 0, 0)`,
            transition: 'transform 0.12s cubic-bezier(0.2, 0.8, 0.3, 1)',
            opacity: 0.15 + fusion * 0.15,
          }}
        >
          <img 
            src="/assets/branding/swasthya-sanchar-mark.png" 
            alt="Swasthya Sanchar AI Brand Emblem 2"
            className="w-[260px] sm:w-[320px] h-[260px] sm:h-[320px] object-contain filter drop-shadow-[0_4px_24px_rgba(20,184,166,0.25)] select-none"
            draggable="false"
          />
        </div>

      </div>
    </div>
  );
};

export default ScrollFusionWatermark;
