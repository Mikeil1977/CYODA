import type { Choice, Names, Node, StoryData, StoryState } from "../types/conversation";
import { fill, getScoreEntries } from "../engine/storyEngine";
import { getInventoryDetails, getInventoryKey } from "../engine/inventoryDetails";

type DebugPanelProps = {
  names: Names;
  state: StoryState;
  storyItems: StoryData["items"];
};

function InventorySummary({ state, storyItems }: Pick<DebugPanelProps, "state" | "storyItems">) {
  if (state.inventory.length === 0) {
    return null;
  }

  return (
    <aside className="inventory-panel" aria-label="Collected items">
      <h3>You are carrying</h3>
      <ul className="inventory-list">
        {state.inventory.map((entry) => (
          <li key={getInventoryKey(entry)}>{getInventoryDetails(storyItems, entry).label}</li>
        ))}
      </ul>
    </aside>
  );
}

export function DebugPanel({ names, state, storyItems }: DebugPanelProps) {
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

      <h4>Inventory</h4>
      {state.inventory.length > 0 ? (
        <ul className="debug-list">
          {state.inventory.map((entry) => {
            const details = getInventoryDetails(storyItems, entry);

            return (
              <li key={getInventoryKey(entry)}>
                <span>{details.label}</span>
                {details.signalCue ? <small className="debug-signal-cue">{details.signalCue}</small> : null}
                {details.conversationPrompt ? (
                  <small className="debug-conversation-prompt">{details.conversationPrompt}</small>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="debug-empty">Nothing collected.</p>
      )}

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
              {item.signalCue ? <small className="debug-signal-cue">{item.signalCue}</small> : null}
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
  storyItems: StoryData["items"];
  onBack: () => void;
  onChoice: (choice: Choice) => void;
};

export function StoryScreen({
  devMode,
  names,
  node,
  previousStepsCount,
  state,
  storyItems,
  onBack,
  onChoice,
}: StoryScreenProps) {
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
        {devMode && node.questionCue ? <p className="dev-question-cue">{node.questionCue}</p> : null}
        {node.text.map((line) => <p key={line}>{fill(line, names)}</p>)}
        <InventorySummary state={state} storyItems={storyItems} />
        <div className="choices">
          {node.choices.map((choice) => (
            <button key={choice.id} onClick={() => onChoice(choice)}>
              <span>{fill(choice.label, names)}</span>
              {devMode && choice.signalCue ? (
                <small className="choice-signal-cue">{choice.signalCue}</small>
              ) : null}
            </button>
          ))}
        </div>

        {devMode ? <DebugPanel names={names} state={state} storyItems={storyItems} /> : null}
      </section>
    </main>
  );
}
