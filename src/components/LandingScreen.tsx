import type { Names } from "../types/conversation";

type LandingScreenProps = {
  devMode: boolean;
  names: Names;
  onLeave: () => void;
  onNamesChange: (names: Names) => void;
  onStart: () => void;
};

export function LandingScreen({ devMode, names, onLeave, onNamesChange, onStart }: LandingScreenProps) {
  return (
    <main className="app">
      <section className="card landing-card">
        <h1>A choose-your-own dating adventure</h1>
        <p className="sub landing-origin">You found the URL on Mike's t&#8209;shirt.</p>
        <p>Instead of dating websites and first-or-zero dates, this is a tiny story to see if we might click.</p>

        <div className="landing-fields">
          <label>
            Your name
            <input
              value={names.playerName}
              autoComplete="given-name"
              onChange={(e) => onNamesChange({ ...names, playerName: e.target.value })}
            />
          </label>
          <label>
            Friend's name
            <input
              value={names.friendName}
              onChange={(e) => onNamesChange({ ...names, friendName: e.target.value })}
            />
          </label>
        </div>

        <div className="choices landing-actions">
          <button type="button" onClick={onStart}>I'm interested</button>
          <button type="button" className="secondary-button" onClick={onLeave}>Leave</button>
        </div>

        {devMode ? (
          <div className="dev-name-fields" aria-label="Developer name controls">
            <p className="meta">Dev mode: Mike's name can be changed for testing.</p>
            <label>
              Person at bar
              <input value={names.subjectName} onChange={(e) => onNamesChange({ ...names, subjectName: e.target.value })} />
            </label>
          </div>
        ) : null}
      </section>
    </main>
  );
}
