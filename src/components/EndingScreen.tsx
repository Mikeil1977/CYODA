import type { EndingTemplate, Names, StoryState } from "../types/conversation";
import { fill } from "../engine/storyEngine";
import { DebugPanel } from "./StoryScreen";

type EndingScreenProps = {
  devMode: boolean;
  ending: EndingTemplate;
  names: Names;
  previousStepsCount: number;
  state: StoryState;
  onBack: () => void;
  onReset: () => void;
};

export function EndingScreen({ devMode, ending, names, previousStepsCount, state, onBack, onReset }: EndingScreenProps) {
  return (
    <main className="app">
      <section className="card">
        {devMode && previousStepsCount > 0 ? (
          <div className="dev-tools" aria-label="Developer navigation">
            <button type="button" className="secondary-button" onClick={onBack}>Back</button>
            <span>{previousStepsCount} step{previousStepsCount === 1 ? "" : "s"}</span>
          </div>
        ) : null}

        <h2>Result: {ending.title}</h2>
        <p>{fill(ending.summary, names)}</p>
        <button onClick={onReset}>Play again</button>

        {devMode ? <DebugPanel names={names} state={state} /> : null}
      </section>
    </main>
  );
}
