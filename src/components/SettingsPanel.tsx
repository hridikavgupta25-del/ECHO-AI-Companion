import { useState } from "react";
import { gameAudio } from "../game/audio";

type SettingsPanelProps = {
  open: boolean;
  onClose: () => void;
  onRestart: () => void;
};

export function SettingsPanel({ open, onClose, onRestart }: SettingsPanelProps) {
  const [confirmRestart, setConfirmRestart] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);

  if (!open) return null;

  const toggleAudio = () => {
    const next = !audioEnabled;
    setAudioEnabled(next);
    gameAudio.setEnabled(next);
    if (next) gameAudio.playClick();
  };

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <span className="settings-title">SYSTEM PAUSED</span>
          <button className="settings-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="settings-body">
          <div className="settings-section">
            <h3 className="settings-section-title">DISPLAY</h3>
            <div className="settings-row">
              <span>Scanline Effects</span>
              <span className="settings-status settings-status-on">
                ENABLED
              </span>
            </div>
            <div className="settings-row">
              <span>Particle Density</span>
              <span className="settings-status settings-status-on">
                NORMAL
              </span>
            </div>
            <div className="settings-row">
              <span>Holographic Glow</span>
              <span className="settings-status settings-status-on">
                ENABLED
              </span>
            </div>
          </div>

          <div className="settings-section">
            <h3 className="settings-section-title">AUDIO</h3>
            <button
              className="settings-row settings-row-btn"
              onClick={toggleAudio}
            >
              <span>Sound Effects</span>
              <span
                className={`settings-status ${
                  audioEnabled ? "settings-status-on" : "settings-status-off"
                }`}
              >
                {audioEnabled ? "ENABLED" : "DISABLED"}
              </span>
            </button>
          </div>

          <div className="settings-section">
            <h3 className="settings-section-title">SESSION</h3>
            {!confirmRestart ? (
              <button
                className="settings-restart-btn"
                onClick={() => setConfirmRestart(true)}
              >
                RESTART GAME
              </button>
            ) : (
              <div className="settings-confirm">
                <p>Are you sure? All progress will be lost.</p>
                <div className="settings-confirm-btns">
                  <button
                    className="settings-confirm-yes"
                    onClick={onRestart}
                  >
                    YES, RESTART
                  </button>
                  <button
                    className="settings-confirm-no"
                    onClick={() => setConfirmRestart(false)}
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
