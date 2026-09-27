import { useEffect, useState } from "react";
import type { InteractiveObject } from "../game/types";
import { gameAudio } from "../game/audio";

type InvestigationPanelProps = {
  object: InteractiveObject;
  onComplete: () => void;
};

export function InvestigationPanel({
  object,
  onComplete,
}: InvestigationPanelProps) {
  const [phase, setPhase] = useState<"description" | "echo_reaction" | "follow_up">(
    "description",
  );
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showClue, setShowClue] = useState(false);

  const currentText =
    phase === "description"
      ? object.description
      : phase === "echo_reaction"
        ? object.echoReaction
        : object.followUpEcho;

  useEffect(() => {
    setDisplayText("");
    setIsTyping(true);
    setShowClue(false);
    let index = 0;
    const speed = phase === "description" ? 20 : 28;

    const interval = setInterval(() => {
      if (index < currentText.length) {
        setDisplayText(currentText.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        if (phase === "description" && object.discoveredClue) {
          setTimeout(() => {
            setShowClue(true);
            gameAudio.playScan();
          }, 400);
        }
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [phase, currentText, object.discoveredClue]);

  const skip = () => {
    if (isTyping) {
      setDisplayText(currentText);
      setIsTyping(false);
      if (phase === "description" && object.discoveredClue) {
        setTimeout(() => setShowClue(true), 200);
      }
    }
  };

  const handleNext = () => {
    gameAudio.playClick();
    if (phase === "description") {
      setPhase("echo_reaction");
    } else if (phase === "echo_reaction") {
      setPhase("follow_up");
    } else {
      onComplete();
    }
  };

  return (
    <div className="investigation-overlay" onClick={skip}>
      <div className="investigation-panel" onClick={(e) => e.stopPropagation()}>
        <div className="investigation-header">
          <span className="investigation-label">SCANNING</span>
          <span className="investigation-name">{object.name}</span>
        </div>

        {phase === "description" && (
          <div className="investigation-description">
            <p className="investigation-text">
              {displayText}
              {isTyping && <span className="dialogue-cursor" />}
            </p>

            {showClue && object.discoveredClue && (
              <div className="investigation-clue">
                <span className="investigation-clue-icon">◈</span>
                <div className="investigation-clue-content">
                  <span className="investigation-clue-label">CLUE DISCOVERED</span>
                  <span className="investigation-clue-text">{object.clueLabel || object.discoveredClue}</span>
                </div>
              </div>
            )}

            {!isTyping && (
              <button className="investigation-btn" onClick={handleNext}>
                <span className="investigation-btn-icon">◈</span>
                ANALYZE WITH ECHO
              </button>
            )}
          </div>
        )}

        {phase === "echo_reaction" && (
          <div className="investigation-echo-section">
            <div className="investigation-echo-speaker">ECHO</div>
            <p className="dialogue-text">
              {displayText}
              {isTyping && <span className="dialogue-cursor" />}
            </p>
            {!isTyping && (
              <button className="investigation-btn" onClick={handleNext}>
                <span className="investigation-btn-icon">▸</span>
                {object.followUpPlayer}
              </button>
            )}
          </div>
        )}

        {phase === "follow_up" && (
          <div className="investigation-echo-section">
            <div className="investigation-player-speaker">PLAYER</div>
            <p className="investigation-player-text">{object.followUpPlayer}</p>
            <div
              className="investigation-echo-speaker"
              style={{ marginTop: "1rem" }}
            >
              ECHO
            </div>
            <p className="dialogue-text">
              {displayText}
              {isTyping && <span className="dialogue-cursor" />}
            </p>
            {!isTyping && (
              <button
                className="investigation-btn investigation-btn-close"
                onClick={handleNext}
              >
                CLOSE
              </button>
            )}
          </div>
        )}

        {isTyping && <div className="dialogue-skip-hint">Click to skip</div>}
      </div>
    </div>
  );
}
