import type { Choice, Names, Node, StoryState } from "../types/conversation";
import { fill, getScoreEntries } from "../engine/storyEngine";

type DebugPanelProps = {
  names: Names;
  state: StoryState;
};

export function DebugPanel({ names, state }: DebugPanelProps) {
  const scoreEntries = getScoreEntries(state.scores);

  return (
    <aside className="debug-panel" aria-label="Developer story state">
      <h3>Debug</h3>
      <dl className="debug-grid">
        <dt>conversationState</dt>
        <dd>{state.conversationState}</dd>
        <dt>current node</dt>
        <dd>{state.nodeId}</dd>
        <dt>ending</dt>
        <dd>{state.endingId ?? "none"}</dd>
      </dl>

      <h4>Scores</h4>
      {scoreEntries.length > 0 ? (
        <dl className="debug-grid">
          {scoreEntries.map(([key, value]) => (
            <div key={key}>
              <dt>{key}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="debug-empty">No scores yet.</p>
      )}

      <h4>Red Flags</h4>
      {state.redFlags.length > 0 ? (
        <ul className="debug-list">
          {state.redFlags.map((flag, index) => <li key={`${flag}-${index}`}>{flag}</li>)}
        </ul>
      ) : (
        <p className="debug-empty">None.</p>
      )}

      <h4>Selected Path</h4>
      {state.history.length > 0 ? (
        <ol className="debug-history">
          {state.history.map((item, index) => (
            <li key={`${item.nodeId}-${item.choiceId}-${index}`}>
              <strong>{item.nodeId}</strong>
              <span>{fill(item.label, names)}</span>
              <code>{item.type}</code>
              <pre>{JSON.stringify(item.effects ?? {}, null, 2)}</pre>
            </li>
          ))}
        </ol>
      ) : (
        <p className="debug-empty">No choices selected yet.</p>
      )}
    </aside>
  );
}

type StoryScreenProps = {
  devMode: boolean;
  names: Names;
  node: Node;
  previousStepsCount: number;
  state: StoryState;
  onBack: () => void;
  onChoice: (choice: Choice) => void;
};

export function StoryScreen({ devMode, names, node, previousStepsCount, state, onBack, onChoice }: StoryScreenProps) {
  return (
    <main className="app">
      <section className="card">
        {devMode && previousStepsCount > 0 ? (
          <div className="dev-tools" aria-label="Developer navigation">
            <button type="button" className="secondary-button" onClick={onBack}>Back</button>
            <span>{previousStepsCount} step{previousStepsCount === 1 ? "" : "s"}</span>
          </div>
        ) : null}

        <h2>{node.title}</h2>
        {node.text.map((line) => <p key={line}>{fill(line, names)}</p>)}
        <div className="choices">
          {node.choices.map((choice) => (
            <button key={choice.id} onClick={() => onChoice(choice)}>{fill(choice.label, names)}</button>
          ))}
        </div>

        {devMode ? <DebugPanel names={names} state={state} /> : null}
      </section>
    </main>
  );
}
