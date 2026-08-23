import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Navigation } from 'lucide-react';

interface CompassCanvasProps {
  className?: string;
  size?: number;
  interactive?: boolean;
}

export const CompassCanvas: React.FC<CompassCanvasProps> = ({
  className = '',
  size = 300,
  interactive = true,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Needle angle & display states
  const [needleAngle, setNeedleAngle] = useState<number>(0);
  const [bezelAngle, setBezelAngle] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [activePulse, setActivePulse] = useState<boolean>(false);

  // Physics animation refs
  const needleAngleRef = useRef<number>(0);
  const targetNeedleAngleRef = useRef<number>(0);
  const angularVelocityRef = useRef<number>(0);
  const dragStartAngleRef = useRef<number>(0);
  const requestRef = useRef<number | null>(null);

  // Calculate cardinal direction label from angle in degrees (0-360)
  const normalizedHeading = ((needleAngle % 360) + 360) % 360;
  const getCardinalDirection = (deg: number) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(deg / 22.5) % 16;
    return directions[index];
  };

  // Impulse animation on click
  const triggerImpulse = useCallback(() => {
    setActivePulse(true);
    angularVelocityRef.current = (Math.random() > 0.5 ? 1 : -1) * (20 + Math.random() * 15);
    setTimeout(() => setActivePulse(false), 700);
  }, []);

  // Physics tick loop - pure rotation around center (160, 160)
  useEffect(() => {
    let lastTime = performance.now();

    const updatePhysics = () => {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      if (!isDragging) {
        // Natural magnetic tracking towards target angle with responsive spring dampening
        let diff = targetNeedleAngleRef.current - needleAngleRef.current;
        // Shortest path angle wrapping between -180 and +180
        diff = ((((diff + 180) % 360) + 360) % 360) - 180;

        const springForce = diff * 9.0; // Snappy, direct attraction
        angularVelocityRef.current += springForce * dt;
        angularVelocityRef.current *= Math.pow(0.80, dt * 60); // Magnetic damping

        needleAngleRef.current += angularVelocityRef.current * dt * 20;
        setNeedleAngle(needleAngleRef.current);
      }

      // Gentle ambient orbital ring rotation
      setBezelAngle((prev) => (prev + 0.03) % 360);

      requestRef.current = requestAnimationFrame(updatePhysics);
    };

    requestRef.current = requestAnimationFrame(updatePhysics);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isDragging]);

  // Window-wide cursor tracking so North end follows cursor with 360° free rotation
  useEffect(() => {
    if (!interactive) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Calculate exact center of the SVG compass dial
      const el = svgRef.current || containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;

      // Calculate angle from center to mouse position
      // In screen coords, top is -Y (0 deg = North). atan2(dy, dx) returns 0 for East (+X).
      // Converting to compass degrees: 0 deg = North (+Y in compass = -Y in screen):
      const cursorAngle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;

      if (isDragging) {
        const delta = cursorAngle - dragStartAngleRef.current;
        needleAngleRef.current = cursorAngle;
        targetNeedleAngleRef.current = cursorAngle;
        angularVelocityRef.current = delta * 1.5;
        setNeedleAngle(cursorAngle);
        dragStartAngleRef.current = cursorAngle;
        return;
      }

      targetNeedleAngleRef.current = cursorAngle;
    };

    const handleMouseLeaveWindow = () => {
      targetNeedleAngleRef.current = 0; // Return to True North when cursor leaves window
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeaveWindow);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeaveWindow);
    };
  }, [interactive, isDragging]);

  // Pointer down to grab or spin
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!interactive) return;
    const el = svgRef.current || containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    dragStartAngleRef.current = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
    setIsDragging(true);
    angularVelocityRef.current = 0;
  };

  // Generate degree ticks around perimeter (5° increments)
  const ticks = Array.from({ length: 72 }, (_, i) => {
    const deg = i * 5;
    const isMajor = deg % 30 === 0;
    const isMedium = deg % 10 === 0 && !isMajor;
    return {
      deg,
      length: isMajor ? 12 : isMedium ? 7 : 4,
      width: isMajor ? 1.5 : 0.8,
      isMajor,
      isMedium,
    };
  });

  return (
    <div
      ref={containerRef}
      id="cambridge-precision-compass"
      className={`relative flex flex-col items-center justify-center select-none group touch-none cursor-grab active:cursor-grabbing ${className}`}
      style={{
        width: size,
        height: size + 44,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onPointerDown={handlePointerDown}
      onClick={triggerImpulse}
      title="Cambridge Precision Compass // Fixed center pivot with 360° cursor tracking"
    >
      {/* Compass Dial Container (Solid stationary frame) */}
      <div className="relative w-full aspect-square flex items-center justify-center">
        {/* Ambient Subtle Luminous Backdrop Glow */}
        <div
          className={`absolute inset-0 rounded-full transition-opacity duration-500 pointer-events-none ${
            isHovered ? 'opacity-100' : 'opacity-40'
          }`}
          style={{
            background:
              'radial-gradient(circle, rgba(196, 166, 120, 0.14) 0%, rgba(196, 166, 120, 0.03) 55%, transparent 72%)',
          }}
        />

        {/* Pulse Ripple Wave on click */}
        {activePulse && (
          <div className="absolute inset-0 rounded-full border border-[#C4A678] animate-ping pointer-events-none opacity-40" />
        )}

        {/* Main Precision Instrument Dial (SVG) */}
        <svg
          ref={svgRef}
          viewBox="0 0 320 320"
          className="w-full h-full drop-shadow-sm transition-colors duration-300"
        >
          <defs>
            {/* Compass Face Gradient */}
            <radialGradient id="compassFaceGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--cc-surface-secondary, #FAF7F0)" stopOpacity="0.9" />
              <stop offset="70%" stopColor="var(--cc-surface-secondary, #FAF7F0)" stopOpacity="0.45" />
              <stop offset="100%" stopColor="var(--cc-surface-secondary, #FAF7F0)" stopOpacity="0.05" />
            </radialGradient>

            {/* Brass Needle Shading */}
            <linearGradient id="northNeedleShade" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C4A678" />
              <stop offset="48%" stopColor="#DFC398" />
              <stop offset="52%" stopColor="#A88B5D" />
              <stop offset="100%" stopColor="#8C7144" />
            </linearGradient>

            {/* Ink South Needle Shading */}
            <linearGradient id="southNeedleShade" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2A2A2E" />
              <stop offset="48%" stopColor="#3F3F46" />
              <stop offset="52%" stopColor="#18181B" />
              <stop offset="100%" stopColor="#09090B" />
            </linearGradient>

            {/* Subtle Radiant Core Glow behind the Needle */}
            <radialGradient id="needleAuraGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#C4A678" stopOpacity="0.45" />
              <stop offset="35%" stopColor="#C4A678" stopOpacity="0.22" />
              <stop offset="70%" stopColor="#DFC398" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#C4A678" stopOpacity="0" />
            </radialGradient>

            {/* Directional North Beam Light Cone behind the Golden Pointer */}
            <radialGradient id="northPointerBeam" cx="50%" cy="30%" r="55%">
              <stop offset="0%" stopColor="#DFC398" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#C4A678" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#C4A678" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* BACKGROUND & OUTER BEZEL (Stationary at center 160, 160) */}
          <circle cx="160" cy="160" r="148" fill="url(#compassFaceGrad)" />

          {/* Outermost Precision Gauge Ring */}
          <circle
            cx="160"
            cy="160"
            r="148"
            fill="none"
            stroke="currentColor"
            className="text-[#EBE8E1] transition-colors"
            strokeWidth="1.2"
          />

          {/* Secondary Concentric Latitude Track */}
          <circle
            cx="160"
            cy="160"
            r="141"
            fill="none"
            stroke="currentColor"
            className="text-[#EBE8E1]/80"
            strokeWidth="0.8"
          />

          {/* Rotating Outer Micro-Degree Orbital Ring */}
          <g transform={`rotate(${bezelAngle}, 160, 160)`} className="opacity-60 transition-opacity">
            <circle
              cx="160"
              cy="160"
              r="134"
              fill="none"
              stroke="#C4A678"
              strokeWidth="0.6"
              strokeDasharray="4 6 12 6"
            />
            <circle cx="160" cy="26" r="1.5" fill="#C4A678" />
            <circle cx="160" cy="294" r="1.5" fill="#C4A678" />
            <circle cx="26" cy="160" r="1.5" fill="#C4A678" />
            <circle cx="294" cy="160" r="1.5" fill="#C4A678" />
          </g>

          {/* Inner Chapter Ring */}
          <circle
            cx="160"
            cy="160"
            r="112"
            fill="none"
            stroke="currentColor"
            className="text-[#EBE8E1]"
            strokeWidth="0.8"
          />

          {/* DEGREE TICKS (360° Scale) */}
          <g>
            {ticks.map((t) => (
              <line
                key={t.deg}
                x1="160"
                y1={160 - 141}
                x2="160"
                y2={160 - 141 + t.length}
                stroke={t.isMajor ? '#C4A678' : t.isMedium ? '#71717A' : '#A1A1AA'}
                strokeWidth={t.width}
                strokeLinecap="round"
                transform={`rotate(${t.deg}, 160, 160)`}
                className="transition-colors"
              />
            ))}
          </g>

          {/* DEGREE NUMBERS (every 30°) */}
          <g className="text-[7.5px] font-mono select-none" fill="#71717A">
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
              const rad = ((deg - 90) * Math.PI) / 180;
              const r = 124;
              const x = 160 + r * Math.cos(rad);
              const y = 160 + r * Math.sin(rad);
              const label = deg.toString().padStart(3, '0') + '°';
              return (
                <text
                  key={deg}
                  x={x}
                  y={y + 2.5}
                  textAnchor="middle"
                  fill={deg === 0 ? '#C4A678' : '#71717A'}
                  fontWeight={deg === 0 ? '700' : '400'}
                  fontSize="7.5"
                  className="font-mono tracking-tighter"
                >
                  {label}
                </text>
              );
            })}
          </g>

          {/* RETICLE CROSSHAIR GRID */}
          <g className="text-[#EBE8E1] transition-colors" stroke="currentColor" strokeWidth="0.6">
            <line x1="160" y1="56" x2="160" y2="135" strokeDasharray="3 3" />
            <line x1="160" y1="185" x2="160" y2="264" strokeDasharray="3 3" />
            <line x1="56" y1="160" x2="135" y2="160" strokeDasharray="3 3" />
            <line x1="185" y1="160" x2="264" y2="160" strokeDasharray="3 3" />
            <circle cx="160" cy="160" r="48" fill="none" strokeWidth="0.6" strokeDasharray="1 5" />
          </g>

          {/* CARDINAL GLYPHS (N, E, S, W) in Serif Typography */}
          <g className="select-none font-serif font-bold">
            {/* North */}
            <text
              x="160"
              y="74"
              textAnchor="middle"
              fill="#C4A678"
              fontSize="14"
              letterSpacing="0.05em"
              className="font-serif tracking-widest font-extrabold"
            >
              N
            </text>
            <circle cx="160" cy="80" r="1.5" fill="#C4A678" />

            {/* South */}
            <text
              x="160"
              y="254"
              textAnchor="middle"
              fill="#71717A"
              fontSize="12"
              className="font-serif"
            >
              S
            </text>

            {/* East */}
            <text
              x="248"
              y="164"
              textAnchor="middle"
              fill="#71717A"
              fontSize="12"
              className="font-serif"
            >
              E
            </text>

            {/* West */}
            <text
              x="72"
              y="164"
              textAnchor="middle"
              fill="#71717A"
              fontSize="12"
              className="font-serif"
            >
              W
            </text>
          </g>

          {/* INNER AESTHETIC COMPASS ROSE FACETS */}
          <g className="opacity-20 transition-opacity" fill="none" stroke="#C4A678" strokeWidth="0.6">
            <polygon points="160,96 166,154 224,160 166,166 160,224 154,166 96,160 154,154" />
          </g>

          {/* =============================================================
              MAGNETIC NEEDLE ASSEMBLY - RIGIDLY FIXED AT EXACT CENTER (160, 160)
              360° pure rotation with zero positional translation or drift.
              ============================================================= */}
          {/* Static Ambient Center Aura behind the rotating needle */}
          <circle
            cx="160"
            cy="160"
            r="82"
            fill="url(#needleAuraGlow)"
            className="animate-pulse pointer-events-none"
            style={{ animationDuration: '3.5s' }}
          />

          <g transform={`rotate(${needleAngle}, 160, 160)`}>
            {/* Dynamic Radial Glow Beam that rotates and pulses directly behind the needle */}
            <ellipse
              cx="160"
              cy="108"
              rx="38"
              ry="74"
              fill="url(#northPointerBeam)"
              className="pointer-events-none"
            />

            {/* North Needle Pointer (Golden Chamfered Rhombus centered on X=160, Y=160) */}
            <g id="north-needle-pointer">
              {/* Left Light Facet */}
              <polygon
                points="160,40 168,155 160,160"
                fill="#DFC398"
                stroke="#C4A678"
                strokeWidth="0.5"
              />
              {/* Right Shaded Facet */}
              <polygon
                points="160,40 152,155 160,160"
                fill="#A88B5D"
                stroke="#C4A678"
                strokeWidth="0.5"
              />
              {/* Spine Highlight */}
              <line x1="160" y1="50" x2="160" y2="150" stroke="#FAF7F0" strokeWidth="0.8" />
              {/* North Pointer Tip Dot */}
              <circle cx="160" cy="45" r="1.5" fill="#FAF7F0" />
            </g>

            {/* South Needle Pointer (Matte Ink Diamond Balance centered on X=160, Y=160) */}
            <g id="south-needle-pointer">
              {/* Left Facet */}
              <polygon
                points="160,280 168,165 160,160"
                fill="#3F3F46"
                stroke="#18181B"
                strokeWidth="0.5"
              />
              {/* Right Facet */}
              <polygon
                points="160,280 152,165 160,160"
                fill="#18181B"
                stroke="#18181B"
                strokeWidth="0.5"
              />
              {/* South Spine Line */}
              <line x1="160" y1="270" x2="160" y2="170" stroke="#71717A" strokeWidth="0.6" />
            </g>

            {/* FIXED CENTER PIVOT BEARING (Anchored permanently at 160, 160) */}
            <circle cx="160" cy="160" r="13" fill="#FAF7F0" stroke="#C4A678" strokeWidth="1.5" />
            <circle cx="160" cy="160" r="8" fill="url(#northNeedleShade)" />
            <circle cx="160" cy="160" r="3.5" fill="#1A1A1A" />
            <circle cx="160" cy="160" r="1.2" fill="#FAF7F0" />
          </g>
        </svg>
      </div>

      {/* MINIMAL TELEMETRY READOUT */}
      <div className="mt-3 flex items-center justify-between w-full px-2 max-w-[260px] text-[10px] font-mono tracking-wider text-[#71717A] border-t border-[#EBE8E1]/70 pt-2 transition-colors">
        <div className="flex items-center gap-1.5">
          <Navigation className="w-3 h-3 text-[#C4A678] transform -rotate-45" />
          <span className="font-bold text-[#1A1A1A] text-[11px]">
            {Math.round(normalizedHeading).toString().padStart(3, '0')}°
          </span>
          <span className="text-[#C4A678] font-bold text-[10px]">
            {getCardinalDirection(normalizedHeading)}
          </span>
        </div>

        <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-[#A1A1AA]">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500/80 animate-pulse" />
          <span>CURSOR TRACKING</span>
        </div>
      </div>
    </div>
  );
};
