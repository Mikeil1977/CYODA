const beerMatClues = [
  "Infinity on its end.",
  "The first and last numbers of the beast.",
  "Gold Rings.",
  "67th prime.",
  "Henry VIII’s wives.",
  "Boron.",
];

type PuzzleScreenProps = {
  onBack: () => void;
};

export function PuzzleScreen({ onBack }: PuzzleScreenProps) {
  return (
    <main className="app">
      <section className="card">
        <h2>Digital beer mat note</h2>
        <p>This is a digital version of a beer mat puzzle.</p>

        <div className="puzzle-list" aria-label="Beer mat clues">
          {beerMatClues.map((clue) => <p key={clue}>{clue}</p>)}
        </div>

        <button type="button" className="secondary-button" onClick={onBack}>Back to games</button>
      </section>
    </main>
  );
}
