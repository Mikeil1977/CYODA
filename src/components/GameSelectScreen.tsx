type GameSelectScreenProps = {
  onLeave: () => void;
  onPuzzle: () => void;
  onQuickQuestions: () => void;
};

export function GameSelectScreen({ onLeave, onPuzzle, onQuickQuestions }: GameSelectScreenProps) {
  return (
    <main className="app">
      <section className="card landing-card">
        <h1>Choose your path</h1>
        <p className="sub">A few ways to find out whether you and this guy might click.</p>

        <div className="choices landing-actions game-actions">
          <button type="button" onClick={onQuickQuestions}>Quick questions</button>
          <button type="button" onClick={onPuzzle}>Puzzle</button>
          <div className="disabled-game" aria-label="Choose your own adventure coming soon">
            <button type="button" disabled>Choose your own adventure</button>
            <span>Coming soon</span>
          </div>
          <button type="button" className="secondary-button" onClick={onLeave}>Leave</button>
        </div>
      </section>
    </main>
  );
}
