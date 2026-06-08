import {
  getInventoryCatalog,
  getInventoryDetails,
  getInventoryHandoffLine,
  getInventoryKey,
  getInventoryReadout,
} from "./inventoryDetails";
import type { StoryData, StoryState } from "../types/conversation";

function assertDeepEqual(actual: unknown, expected: unknown, label: string) {
  const actualJson = JSON.stringify(actual);
  const expectedJson = JSON.stringify(expected);

  if (actualJson !== expectedJson) {
    throw new Error(`${label}: expected ${expectedJson}, received ${actualJson}`);
  }
}

const storyItems: StoryData["items"] = {
  rain_wet_excuse: {
    id: "rain_wet_excuse",
    label: "a rain-wet excuse",
    variants: {
      chose_the_stairs: {
        id: "chose_the_stairs",
        label: "a rain-wet excuse that chose the stairs",
        signalCue: "Openness to a small, low-stakes risk.",
        conversationPrompt: "Ask what made the pub feel more interesting than the sensible plan.",
      },
    },
  },
  unnecessary_but_revealing_advice: {
    id: "unnecessary_but_revealing_advice",
    label: "unnecessary but revealing advice",
    variants: {
      puzzle_way_out: {
        id: "puzzle_way_out",
        label: "advice with a puzzle and a fire exit",
        signalCue: "Playfulness balanced with care for the other person.",
        conversationPrompt: "Ask how much puzzle is charming before it becomes homework.",
      },
    },
  },
};

const entry: StoryState["inventory"][number] = {
  itemId: "rain_wet_excuse",
  variantId: "chose_the_stairs",
};
const laterEntry: StoryState["inventory"][number] = {
  itemId: "unnecessary_but_revealing_advice",
  variantId: "puzzle_way_out",
};

assertDeepEqual(getInventoryKey(entry), "rain_wet_excuse:chose_the_stairs", "inventory key");
assertDeepEqual(
  getInventoryDetails(storyItems, entry),
  {
    label: "a rain-wet excuse that chose the stairs",
    signalCue: "Openness to a small, low-stakes risk.",
    conversationPrompt: "Ask what made the pub feel more interesting than the sensible plan.",
  },
  "variant details include public label and dev-only context",
);

assertDeepEqual(
  getInventoryHandoffLine({
    subjectName: "Mike",
    storyItems,
    inventory: [entry, laterEntry],
  }),
  'If this made you curious, come and tell Mike: "I found advice with a puzzle and a fire exit."',
  "handoff line uses the latest collected item",
);

assertDeepEqual(
  getInventoryHandoffLine({
    subjectName: "Mike",
    storyItems,
    inventory: [],
  }),
  "If this made you curious, come and tell Mike the weather won.",
  "empty inventory still gives a speakable handoff",
);

assertDeepEqual(
  getInventoryReadout(storyItems, [entry]),
  [
    {
      key: "rain_wet_excuse:chose_the_stairs",
      label: "a rain-wet excuse that chose the stairs",
      signalCue: "Openness to a small, low-stakes risk.",
      conversationPrompt: "Ask what made the pub feel more interesting than the sensible plan.",
    },
  ],
  "inventory readout gives Mike the item, hidden signal, and opening question",
);

assertDeepEqual(
  getInventoryCatalog(storyItems).map((item) => item.key),
  [
    "rain_wet_excuse:chose_the_stairs",
    "unnecessary_but_revealing_advice:puzzle_way_out",
  ],
  "inventory catalog lists every variant in story item order",
);
