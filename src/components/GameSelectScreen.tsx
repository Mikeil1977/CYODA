import { getInventoryCatalog } from "../engine/inventoryDetails";
import type { StoryData } from "../types/conversation";

type GameSelectScreenProps = {
  devMode: boolean;
  onAdventure: () => void;
  onLeave: () => void;
  onPuzzle: () => void;
  onQuickQuestions: () => void;
  storyItems: StoryData["items"];
};

function MikeItemLookup({ storyItems }: Pick<GameSelectScreenProps, "storyItems">) {
  const catalog = getInventoryCatalog(storyItems);

  if (catalog.length === 0) {
    return null;
  }

  return (
    <aside className="mike-item-lookup" aria-label="Mike item lookup">
      <h3>Mike item lookup</h3>
      <ul>
        {catalog.map((item) => (
          <li key={item.key}>
            <strong>{item.label}</strong>
            {item.signalCue ? <span>{item.signalCue}</span> : null}
            {item.conversationPrompt ? <small>{item.conversationPrompt}</small> : null}
          </li>
        ))}
      </ul>
    </aside>
  );
}

export function GameSelectScreen({
  devMode,
  onAdventure,
  onLeave,
  onPuzzle,
  onQuickQuestions,
  storyItems,
}: GameSelectScreenProps) {
  return (
    <main className="app">
      <section className="card landing-card">
        <h1>Choose your path</h1>
        <p className="sub landing-origin">You found the URL on Mike's T-shirt.</p>
        <p className="sub">A few ways to find out whether you and this guy might click.</p>

        <div className="choices landing-actions game-actions">
          <button type="button" onClick={onAdventure}>Choose your own adventure</button>
          <button type="button" className="secondary-button" onClick={onQuickQuestions}>Quick questions</button>
          <button type="button" className="secondary-button" onClick={onPuzzle}>Puzzle</button>
          <button type="button" className="secondary-button" onClick={onLeave}>Leave</button>
        </div>

        {devMode ? <MikeItemLookup storyItems={storyItems} /> : null}
      </section>
    </main>
  );
}
