type MemoryUpdatedScreenProps = {
  trust: number;
  curiosity: number;
  choicesCount: number;
  cluesCount: number;
  onContinue: () => void;
};

export function MemoryUpdatedScreen({
  trust,
  curiosity,
  choicesCount,
  cluesCount,
  onContinue,
}: MemoryUpdatedScreenProps) {
  return (
    <div className="memory-updated-screen">
      <div className="memory-updated-bg" />

      <div className="memory-updated-content">
        <h2 className="memory-updated-title">MEMORY UPDATED</h2>
        <div className="memory-updated-divider" />
        <p className="memory-updated-message">ECHO will remember this.</p>

        <div className="memory-updated-stats">
          <div className="memory-updated-stat">
            <span className="memory-updated-stat-value">{trust > 0 ? "+" : ""}{trust}</span>
            <span className="memory-updated-stat-label">TRUST</span>
          </div>
          <div className="memory-updated-stat">
            <span className="memory-updated-stat-value">{curiosity}</span>
            <span className="memory-updated-stat-label">CURIOSITY</span>
          </div>
          <div className="memory-updated-stat">
            <span className="memory-updated-stat-value">{choicesCount}</span>
            <span className="memory-updated-stat-label">CHOICES</span>
          </div>
          <div className="memory-updated-stat">
            <span className="memory-updated-stat-value">{cluesCount}</span>
            <span className="memory-updated-stat-label">CLUES</span>
          </div>
        </div>

        <p className="memory-updated-hint">
          The laboratory awaits. ECHO's story continues...
        </p>

        <button className="memory-updated-btn" onClick={onContinue}>
          RETURN TO FACILITY
        </button>
      </div>
    </div>
  );
}
