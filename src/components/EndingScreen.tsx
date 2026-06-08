import type { EndingTemplate, Names, StoryData, StoryState } from "../types/conversation";
import {
  getInventoryDetails,
  getInventoryHandoffLine,
  getInventoryKey,
  getInventoryReadout,
} from "../engine/inventoryDetails";
import { fill, getEndingReflection } from "../engine/storyEngine";
import { DebugPanel } from "./StoryScreen";

type EndingScreenProps = {
  devMode: boolean;
  ending: EndingTemplate;
  names: Names;
  previousStepsCount: number;
  state: StoryState;
  storyItems: StoryData["items"];
  onBack: () => void;
  onReset: () => void;
};

function InventoryHandoff({ names, state, storyItems }: Pick<EndingScreenProps, "names" | "state" | "storyItems">) {
  const hasInventory = state.inventory.length > 0;
  const handoffLine = getInventoryHandoffLine({
    subjectName: names.subjectName,
    storyItems,
    inventory: state.inventory,
  });

  return (
    <section className="ending-handoff" aria-label="Collected inventory handoff">
      <h3>You are carrying</h3>
      {hasInventory ? (
        <>
          <p className="handoff-intro">If this made you curious, come and tell {names.subjectName} you found:</p>
          <ul className="inventory-list">
            {state.inventory.map((entry) => <li key={getInventoryKey(entry)}>{getInventoryDetails(storyItems, entry).label}</li>)}
          </ul>
        </>
      ) : (
        <p>You are not carrying much. That is allowed. Some evenings are mainly weather.</p>
      )}
      <div className="approach-line" aria-label="Suggested approach line">
        <h4>A line to take to the bar</h4>
        <p>{handoffLine}</p>
      </div>
    </section>
  );
}

function MikeReadout({ state, storyItems }: Pick<EndingScreenProps, "state" | "storyItems">) {
  const readout = getInventoryReadout(storyItems, state.inventory);

  if (readout.length === 0) {
    return null;
  }

  return (
    <section className="mike-readout" aria-label="Mike-facing item readout">
      <h3>Mike readout</h3>
      <ul>
        {readout.map((item) => (
          <li key={item.key}>
            <strong>{item.label}</strong>
            {item.signalCue ? <span>{item.signalCue}</span> : null}
            {item.conversationPrompt ? <small>{item.conversationPrompt}</small> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function EndingScreen({
  devMode,
  ending,
  names,
  previousStepsCount,
  state,
  storyItems,
  onBack,
  onReset,
}: EndingScreenProps) {
  const reflection = getEndingReflection(state);
  const showRelationshipReflection = ending.reflectionType !== "inventory";

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

        <InventoryHandoff names={names} state={state} storyItems={storyItems} />

        {showRelationshipReflection ? (
          <section className="ending-reflection" aria-label="Ending reflection">
          <p className="reflection-lede">{fill(reflection.reached, names)}</p>

          <h3>What seemed to work</h3>
          <ul>
            {reflection.worked.map((item) => <li key={item}>{fill(item, names)}</li>)}
          </ul>

          <h3>Where things cooled</h3>
          <ul>
            {reflection.cooled.map((item) => <li key={item}>{fill(item, names)}</li>)}
          </ul>

          <h3>Likely outcome</h3>
          <p>{fill(reflection.outcome, names)}</p>
          </section>
        ) : null}

        <button onClick={onReset}>Play again</button>

        {devMode ? <MikeReadout state={state} storyItems={storyItems} /> : null}
        {devMode ? <DebugPanel names={names} state={state} storyItems={storyItems} /> : null}
      </section>
    </main>
  );
}
