type ObjectivePanelProps = {
  objective: string;
};

export function ObjectivePanel({ objective }: ObjectivePanelProps) {
  return (
    <div className="objective-panel">
      <div className="objective-header">
        <span className="objective-icon" />
        <span className="objective-label">OBJECTIVE</span>
      </div>
      <p className="objective-text">{objective}</p>
    </div>
  );
}
