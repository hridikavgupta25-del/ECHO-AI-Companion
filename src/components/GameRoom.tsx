import type { InteractiveObject } from "../game/types";
import { EchoCharacter } from "./EchoCharacter";
import { gameAudio } from "../game/audio";

type RoomObjectProps = {
  object: InteractiveObject;
  onInteract: (object: InteractiveObject) => void;
  investigated: boolean;
  hasPowerCell: boolean;
  hasAuthKey: boolean;
  powerRestored: boolean;
  labUnlocked: boolean;
};

function RoomObject({
  object,
  onInteract,
  investigated,
  hasPowerCell,
  hasAuthKey,
  powerRestored,
  labUnlocked,
}: RoomObjectProps) {
  const canInteract = true;

  return (
    <div
      className={`room-object ${investigated ? "investigated" : ""} ${canInteract ? "interactive" : "locked"}`}
      style={{
        left: `${object.position.x}%`,
        top: `${object.position.y}%`,
      }}
      onMouseEnter={() => gameAudio.playHover()}
      onClick={() => canInteract && onInteract(object)}
    >
      <div className="room-object-icon">
        {object.id === "terminal" && <TerminalIcon />}
        {object.id === "lab_door" && <DoorIcon locked={!labUnlocked} />}
        {object.id === "research_table" && <TableIcon hasKey={!hasAuthKey} />}
        {object.id === "power_console" && <ConsoleIcon hasPowerCell={hasPowerCell} hasAuthKey={hasAuthKey} active={powerRestored} />}
        {object.id === "echo_projector" && <ProjectorIcon />}
      </div>
      <div className="room-object-label">{object.name}</div>
      <div className="room-object-pulse" />
    </div>
  );
}

function TerminalIcon() {
  return (
    <svg viewBox="0 0 48 48" className="object-svg">
      <rect x="8" y="6" width="32" height="24" rx="2" fill="#0a1520" stroke="#3050a0" strokeWidth="1.5" opacity="0.9" />
      <rect x="10" y="8" width="28" height="20" rx="1" fill="#0a0a20" opacity="0.8" />
      <line x1="12" y1="12" x2="22" y2="12" stroke="#3070ff" strokeWidth="0.8" opacity="0.6" />
      <line x1="12" y1="16" x2="28" y2="16" stroke="#3070ff" strokeWidth="0.8" opacity="0.4" />
      <line x1="12" y1="20" x2="18" y2="20" stroke="#3070ff" strokeWidth="0.8" opacity="0.3" />
      <rect x="18" y="32" width="12" height="8" fill="#0a1520" stroke="#3050a0" strokeWidth="1" opacity="0.8" />
      <rect x="14" y="38" width="20" height="4" rx="1" fill="#0a1520" stroke="#3050a0" strokeWidth="1" opacity="0.8" />
      <line x1="8" y1="5" x2="40" y2="30" stroke="#5070ff" strokeWidth="0.5" opacity="0.3" />
    </svg>
  );
}

function DoorIcon({ locked }: { locked: boolean }) {
  return (
    <svg viewBox="0 0 48 48" className="object-svg">
      <rect x="10" y="4" width="28" height="40" rx="1" fill="#0a1520" stroke="#3050a0" strokeWidth="2" opacity="0.9" />
      <rect x="13" y="7" width="22" height="34" rx="0.5" fill="#080818" opacity="0.9" />
      <rect x="18" y="12" width="12" height="24" fill="none" stroke="#2040a0" strokeWidth="1" opacity="0.5" />
      <circle cx="30" cy="24" r="1.5" fill={locked ? "#ff3060" : "#30ff60"} opacity="0.9" />
      {locked && <rect x="20" y="20" width="8" height="8" fill="none" stroke="#ff3060" strokeWidth="1" opacity="0.6" />}
    </svg>
  );
}

function TableIcon({ hasKey }: { hasKey: boolean }) {
  return (
    <svg viewBox="0 0 48 48" className="object-svg">
      <rect x="4" y="26" width="40" height="4" rx="1" fill="#0a1520" stroke="#3050a0" strokeWidth="1" opacity="0.9" />
      <rect x="8" y="30" width="3" height="14" fill="#0a1520" stroke="#3050a0" strokeWidth="0.8" opacity="0.7" />
      <rect x="37" y="30" width="3" height="14" fill="#0a1520" stroke="#3050a0" strokeWidth="0.8" opacity="0.7" />
      <rect x="14" y="20" width="8" height="6" rx="1" fill="#1a2030" stroke="#4060a0" strokeWidth="0.5" opacity="0.7" />
      <rect x="26" y="18" width="10" height="8" rx="1" fill="#1a2030" stroke="#4060a0" strokeWidth="0.5" opacity="0.7" />
      {hasKey && (
        <rect x="12" y="22" width="6" height="4" rx="0.5" fill="#5070a0" opacity="0.8">
          <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2s" repeatCount="indefinite" />
        </rect>
      )}
      <circle cx="34" cy="22" r="2" fill="#3070ff" opacity="0.8">
        <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

function ConsoleIcon({ hasPowerCell, hasAuthKey, active }: { hasPowerCell: boolean; hasAuthKey: boolean; active: boolean }) {
  return (
    <svg viewBox="0 0 48 48" className="object-svg">
      <rect x="6" y="14" width="36" height="28" rx="2" fill="#0a1520" stroke="#3050a0" strokeWidth="1.5" opacity="0.9" />
      <rect x="10" y="18" width="28" height="10" rx="1" fill="#080818" opacity="0.8" />
      {active ? (
        <rect x="12" y="20" width="24" height="6" fill="#103020" opacity="0.8" />
      ) : (
        <rect x="12" y="20" width="24" height="6" fill="#200a0a" opacity="0.6" />
      )}
      <circle cx="14" cy="34" r="2" fill={active ? "#30ff60" : "#ff4030"} opacity="0.8" />
      <circle cx="24" cy="34" r="2" fill={active ? "#30a0ff" : "#403030"} opacity="0.7" />
      <circle cx="34" cy="34" r="2" fill={active ? "#30ff60" : "#403030"} opacity="0.7" />
      {!active && (
        <>
          {!hasPowerCell && (
            <circle cx="20" cy="28" r="3" fill="none" stroke="#ff4030" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
          )}
          {!hasAuthKey && (
            <rect x="28" y="25" width="6" height="6" rx="0.5" fill="none" stroke="#ff4030" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
          )}
        </>
      )}
    </svg>
  );
}

function ProjectorIcon() {
  return (
    <svg viewBox="0 0 48 48" className="object-svg">
      <ellipse cx="24" cy="40" rx="16" ry="4" fill="#103040" stroke="#3070a0" strokeWidth="1" opacity="0.8" />
      <ellipse cx="24" cy="40" rx="10" ry="2.5" fill="#2050a0" opacity="0.5" />
      <ellipse cx="24" cy="40" rx="6" ry="1.5" fill="#4080ff" opacity="0.4" />
      <path d="M18 40 L20 18 Q24 14 28 18 L30 40" fill="#3070ff" opacity="0.15" />
      <circle cx="24" cy="16" r="1.5" fill="#a0d0ff" opacity="0.6" />
    </svg>
  );
}

type GameRoomProps = {
  objects: InteractiveObject[];
  investigatedObjects: string[];
  hasPowerCell: boolean;
  hasAuthKey: boolean;
  powerRestored: boolean;
  labUnlocked: boolean;
  onInteract: (object: InteractiveObject) => void;
  echoIntensity: "idle" | "speaking" | "distressed" | "thinking";
};

export function GameRoom({
  objects,
  investigatedObjects,
  hasPowerCell,
  hasAuthKey,
  powerRestored,
  labUnlocked,
  onInteract,
  echoIntensity,
}: GameRoomProps) {
  return (
    <div className="game-room">
      <div className="room-floor" />
      <div className="room-back-wall" />
      <div className="room-side-walls" />
      <div className="room-ceiling" />
      <div className="room-fog" />
      <div className="room-particles" />

      {/* ECHO projection */}
      <div className="room-echo-position">
        <EchoCharacter intensity={echoIntensity} glitch={echoIntensity === "distressed"} />
      </div>

      {/* Interactive objects */}
      {objects.map((obj) => (
        <RoomObject
          key={obj.id}
          object={obj}
          onInteract={onInteract}
          investigated={investigatedObjects.includes(obj.id)}
          hasPowerCell={hasPowerCell}
          hasAuthKey={hasAuthKey}
          powerRestored={powerRestored}
          labUnlocked={labUnlocked}
        />
      ))}

      {/* Ambient light effects */}
      <div className="room-light room-light-left" />
      <div className="room-light room-light-right" />
      {powerRestored && <div className="room-light room-light-restored" />}
    </div>
  );
}
