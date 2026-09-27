import { useEffect, useState } from "react";
import type { DialogueNode, DialogueChoice } from "../game/types";
import { gameAudio } from "../game/audio";

type DialoguePanelProps = {
  node: DialogueNode | null;
  onChoice: (choice: DialogueChoice) => void;
  onContinue: () => void;
  echoActive: boolean;
};

export function DialoguePanel({
  node,
  onChoice,
  onContinue,
  echoActive: _echoActive,
}: DialoguePanelProps) {
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showChoices, setShowChoices] = useState(false);

  useEffect(() => {
    if (!node || node.text === "") {
      setDisplayText("");
      setShowChoices(false);
      return;
    }

    setDisplayText("");
    setShowChoices(false);
    setIsTyping(true);

    let index = 0;
    const fullText = node.text;
    const speed = node.speaker === "system" ? 15 : 28;

    const interval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayText(fullText.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        if (node.choices) {
          setShowChoices(true);
        }
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [node]);

  if (!node || node.text === "") return null;

  const skipTyping = () => {
    if (isTyping) {
      setDisplayText(node.text);
      setIsTyping(false);
      if (node.choices) {
        setShowChoices(true);
      }
    }
  };

  const speakerLabel =
    node.speaker === "echo"
      ? "ECHO"
      : node.speaker === "system"
        ? "SYSTEM"
        : "";

  const speakerClass = node.speaker === "system" ? "system" : "echo";

  const showContinueButton = !isTyping && !node.choices;

  return (
    <div className="dialogue-panel" onClick={skipTyping}>
      {node.speaker !== "narration" && (
        <div className={`dialogue-speaker ${speakerClass}`}>
          {speakerLabel}
        </div>
      )}
      <div className="dialogue-text-container">
        <p
          className={`dialogue-text ${node.speaker === "system" ? "system-text" : ""}`}
        >
          {displayText}
          {isTyping && <span className="dialogue-cursor" />}
        </p>
        {showContinueButton && (
          <button
            className="dialogue-continue-btn"
            onClick={(e) => {
              e.stopPropagation();
              onContinue();
            }}
          >
            CONTINUE →
          </button>
        )}
      </div>

      {showChoices && node.choices && (
        <div className="dialogue-choices">
          {node.choices.map((choice, i) => (
            <button
              key={i}
              className="dialogue-choice-btn"
              style={{ animationDelay: `${i * 0.1}s` }}
              onMouseEnter={() => gameAudio.playHover()}
              onClick={(e) => {
                e.stopPropagation();
                onChoice(choice);
              }}
            >
              <span className="dialogue-choice-marker">▸</span>
              {choice.text}
            </button>
          ))}
        </div>
      )}

      {isTyping && <div className="dialogue-skip-hint">Click to skip</div>}
    </div>
  );
}
