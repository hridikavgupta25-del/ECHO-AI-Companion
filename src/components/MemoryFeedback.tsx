import { useEffect, useState } from "react";
import { gameAudio } from "../game/audio";

type MemoryFeedbackProps = {
  message: string;
  onDone: () => void;
};

export function MemoryFeedback({ message, onDone }: MemoryFeedbackProps) {
  const [phase, setPhase] = useState<"entering" | "visible" | "exiting">(
    "entering",
  );

  useEffect(() => {
    gameAudio.playMemoryUpdate();
    const t1 = setTimeout(() => setPhase("visible"), 400);
    const t2 = setTimeout(() => setPhase("exiting"), 2800);
    const t3 = setTimeout(() => onDone(), 3400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onDone]);

  return (
    <div className={`memory-feedback memory-feedback-${phase}`}>
      <div className="memory-feedback-box">
        <div className="memory-feedback-icon">◈</div>
        <div className="memory-feedback-title">MEMORY UPDATED</div>
        <div className="memory-feedback-divider" />
        <div className="memory-feedback-message">{message}</div>
      </div>
    </div>
  );
}
