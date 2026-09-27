import { useEffect, useState } from "react";
import { gameAudio } from "../game/audio";

type TitleScreenProps = {
  onStart: () => void;
  onContinue?: () => void | null;
};

export function TitleScreen({ onStart, onContinue }: TitleScreenProps) {
  const [titleVisible, setTitleVisible] = useState(false);
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setTitleVisible(true), 400);
    const t2 = setTimeout(() => setSubtitleVisible(true), 1800);
    const t3 = setTimeout(() => setButtonVisible(true), 3000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const handleBegin = () => {
    gameAudio.resume();
    gameAudio.playSelect();
    onStart();
  };

  const handleContinue = () => {
    gameAudio.resume();
    gameAudio.playSelect();
    onContinue?.();
  };

  return (
    <div className="title-screen">
      <div className="title-bg-grid" />
      <div className="title-bg-fog" />
      <div className="title-bg-particles" />

      <div className="title-content">
        <h1 className={`title-main ${titleVisible ? "visible" : ""}`}>
          ECHO
        </h1>
        <p className={`title-subtitle ${subtitleVisible ? "visible" : ""}`}>
          IT DOESN'T JUST REMEMBER THE STORY.
          <br />
          <span className="title-subtitle-highlight">IT REMEMBERS YOU.</span>
        </p>
        <div className={`title-buttons ${buttonVisible ? "visible" : ""}`}>
          {onContinue && (
            <button
              className="title-button title-button-secondary visible"
              onClick={handleContinue}
              disabled={!buttonVisible}
              onMouseEnter={() => gameAudio.playHover()}
            >
              <span className="title-button-text">CONTINUE</span>
              <span className="title-button-glow" />
            </button>
          )}
          <button
            className={`title-button ${buttonVisible ? "visible" : ""}`}
            onClick={handleBegin}
            disabled={!buttonVisible}
            onMouseEnter={() => gameAudio.playHover()}
          >
            <span className="title-button-text">
              {onContinue ? "NEW GAME" : "BEGIN"}
            </span>
            <span className="title-button-glow" />
          </button>
        </div>
      </div>

      <div className="title-corner title-corner-tl" />
      <div className="title-corner title-corner-tr" />
      <div className="title-corner title-corner-bl" />
      <div className="title-corner title-corner-br" />
    </div>
  );
}
