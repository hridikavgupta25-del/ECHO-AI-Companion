import { useEffect, useState } from "react";

type EchoCharacterProps = {
  intensity?: "idle" | "speaking" | "distressed" | "thinking";
  glitch?: boolean;
};

export function EchoCharacter({
  intensity = "idle",
  glitch = false,
}: EchoCharacterProps) {
  const [glitchActive, setGlitchActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBreathPhase((p) => (p + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!glitch) return;
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 150 + Math.random() * 200);
    }, 2000 + Math.random() * 3000);
    return () => clearInterval(glitchInterval);
  }, [glitch]);

  const breathScale = 1 + Math.sin(breathPhase * 0.063) * 0.015;
  const floatY = Math.sin(breathPhase * 0.04) * 4;

  const intensityOpacity = {
    idle: 0.7,
    speaking: 0.92,
    distressed: 0.6,
    thinking: 0.5,
  }[intensity];

  const glowStrength = {
    idle: 20,
    speaking: 35,
    distressed: 45,
    thinking: 15,
  }[intensity];

  return (
    <div
      className="echo-character"
      style={{
        transform: `translateY(${floatY}px) scale(${breathScale})`,
        opacity: glitchActive ? 0.4 : intensityOpacity,
        filter: glitchActive
          ? `hue-rotate(15deg) blur(1px)`
          : "none",
      }}
    >
      {/* Glow aura */}
      <div
        className="echo-aura"
        style={{
          opacity: glitchActive ? 0.3 : 0.5,
          boxShadow: `0 0 ${glowStrength}px 8px rgba(80, 120, 255, 0.4), 0 0 ${glowStrength * 2}px 20px rgba(140, 80, 255, 0.2)`,
        }}
      />

      {/* Holographic humanoid SVG */}
      <svg
        viewBox="0 0 120 280"
        className="echo-svg"
        style={{ filter: `drop-shadow(0 0 ${glowStrength * 0.3}px rgba(100, 150, 255, 0.8))` }}
      >
        <defs>
          <linearGradient id="echoBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6ba3ff" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#5070ff" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#8a4fff" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="echoVisorGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#a0e0ff" stopOpacity="1" />
            <stop offset="100%" stopColor="#5070ff" stopOpacity="0.8" />
          </linearGradient>
          <radialGradient id="echoCoreGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a0e0ff" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#5070ff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#4040ff" stopOpacity="0" />
          </radialGradient>
          <filter id="echoGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Head */}
        <ellipse cx="60" cy="28" rx="18" ry="22" fill="url(#echoBodyGrad)" filter="url(#echoGlow)" opacity="0.85" />
        {/* Visor / face area */}
        <rect x="48" y="20" width="24" height="14" rx="6" fill="url(#echoVisorGrad)" filter="url(#echoGlow)" opacity="0.95" />
        {/* Visor eyes glow */}
        <circle cx="54" cy="27" r="2.5" fill="#e0f5ff" opacity="0.9" />
        <circle cx="66" cy="27" r="2.5" fill="#e0f5ff" opacity="0.9" />

        {/* Neck */}
        <rect x="56" y="48" width="8" height="10" fill="url(#echoBodyGrad)" opacity="0.6" />

        {/* Torso - upper body / chest plate */}
        <path
          d="M40 58 Q60 55 80 58 L78 110 Q60 115 42 110 Z"
          fill="url(#echoBodyGrad)"
          filter="url(#echoGlow)"
          opacity="0.8"
        />
        {/* Chest core glow */}
        <circle cx="60" cy="82" r="12" fill="url(#echoCoreGrad)" />
        <circle cx="60" cy="82" r="5" fill="#a0e0ff" opacity="0.8" filter="url(#echoGlow)" />

        {/* Shoulder panels */}
        <ellipse cx="38" cy="62" rx="8" ry="6" fill="url(#echoBodyGrad)" opacity="0.7" />
        <ellipse cx="82" cy="62" rx="8" ry="6" fill="url(#echoBodyGrad)" opacity="0.7" />

        {/* Arms - left */}
        <rect x="30" y="62" width="7" height="42" rx="3.5" fill="url(#echoBodyGrad)" opacity="0.7" filter="url(#echoGlow)" />
        <rect x="28" y="100" width="8" height="20" rx="4" fill="url(#echoBodyGrad)" opacity="0.6" />
        {/* Arms - right */}
        <rect x="83" y="62" width="7" height="42" rx="3.5" fill="url(#echoBodyGrad)" opacity="0.7" filter="url(#echoGlow)" />
        <rect x="84" y="100" width="8" height="20" rx="4" fill="url(#echoBodyGrad)" opacity="0.6" />

        {/* Lower body / waist */}
        <path
          d="M44 110 Q60 113 76 110 L74 140 Q60 145 46 140 Z"
          fill="url(#echoBodyGrad)"
          opacity="0.75"
        />

        {/* Legs */}
        <rect x="48" y="140" width="10" height="60" rx="4" fill="url(#echoBodyGrad)" opacity="0.7" filter="url(#echoGlow)" />
        <rect x="62" y="140" width="10" height="60" rx="4" fill="url(#echoBodyGrad)" opacity="0.7" filter="url(#echoGlow)" />

        {/* Feet */}
        <ellipse cx="53" cy="205" rx="8" ry="5" fill="url(#echoBodyGrad)" opacity="0.6" />
        <ellipse cx="67" cy="205" rx="8" ry="5" fill="url(#echoBodyGrad)" opacity="0.6" />

        {/* Holographic data lines on body */}
        <line x1="60" y1="58" x2="60" y2="140" stroke="#a0d0ff" strokeWidth="0.5" opacity="0.4" strokeDasharray="3 5" />
        <line x1="48" y1="70" x2="72" y2="70" stroke="#a0d0ff" strokeWidth="0.3" opacity="0.3" />
        <line x1="50" y1="90" x2="70" y2="90" stroke="#a0d0ff" strokeWidth="0.3" opacity="0.3" />
        <line x1="50" y1="125" x2="70" y2="125" stroke="#a0d0ff" strokeWidth="0.3" opacity="0.3" />
      </svg>

      {/* Scanline overlay */}
      <div className="echo-scanlines" />
      {/* Holographic flicker */}
      <div className={`echo-flicker ${glitchActive ? "glitching" : ""}`} />
      {/* Floor emitter ring */}
      <div className="echo-emitter-ring" />
      <div className="echo-emitter-ring echo-emitter-ring-2" />
    </div>
  );
}
