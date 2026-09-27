type MemoryPanelProps = {
  trust: number;
  curiosity: number;
  investigatedCount: number;
  cluesCount: number;
};

export function MemoryPanel({
  trust,
  curiosity,
  investigatedCount,
  cluesCount,
}: MemoryPanelProps) {
  const trustPercent = Math.max(0, Math.min(100, 50 + trust * 8));
  const curiosityPercent = Math.max(0, Math.min(100, curiosity * 10));

  const trustLabel =
    trust > 5 ? "ALLIED" : trust > 0 ? "WARM" : trust > -5 ? "NEUTRAL" : "WARY";
  const curiosityLabel =
    curiosity > 5 ? "DRIVEN" : curiosity > 2 ? "CURIOUS" : curiosity > 0 ? "INTRIGUED" : "PASSIVE";

  return (
    <div className="memory-panel">
      <div className="memory-header">
        <span className="memory-icon" />
        <span className="memory-label">MEMORY MATRIX</span>
      </div>

      <div className="memory-stat">
        <div className="memory-stat-row">
          <span className="memory-stat-name">TRUST</span>
          <span className="memory-stat-value">{trustLabel}</span>
        </div>
        <div className="memory-bar-container">
          <div
            className="memory-bar memory-bar-trust"
            style={{ width: `${trustPercent}%` }}
          />
        </div>
      </div>

      <div className="memory-stat">
        <div className="memory-stat-row">
          <span className="memory-stat-name">CURIOSITY</span>
          <span className="memory-stat-value">{curiosityLabel}</span>
        </div>
        <div className="memory-bar-container">
          <div
            className="memory-bar memory-bar-curiosity"
            style={{ width: `${curiosityPercent}%` }}
          />
        </div>
      </div>

      <div className="memory-counters">
        <div className="memory-counter">
          <span className="memory-counter-num">{investigatedCount}</span>
          <span className="memory-counter-label">SCANNED</span>
        </div>
        <div className="memory-counter">
          <span className="memory-counter-num">{cluesCount}</span>
          <span className="memory-counter-label">CLUES</span>
        </div>
      </div>
    </div>
  );
}
