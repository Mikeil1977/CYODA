import { createInitialStoryState, getNextStoryState } from "./storyEngine";
import type { Choice, StoryData } from "../types/conversation";

function assertDeepEqual(actual: unknown, expected: unknown, label: string) {
  const actualJson = JSON.stringify(actual);
  const expectedJson = JSON.stringify(expected);

  if (actualJson !== expectedJson) {
    throw new Error(`${label}: expected ${expectedJson}, received ${actualJson}`);
  }
}

const collectRainExcuse: Choice = {
  id: "collect_rain_excuse",
  label: "Pocket the excuse",
  nextId: "ending_done",
  type: "score",
  effects: {
    collectItems: [{ itemId: "rain_wet_excuse", variantId: "went_inside" }],
  },
};

const story: StoryData = {
  startNodeId: "start",
  items: {
    rain_wet_excuse: {
      id: "rain_wet_excuse",
      label: "a rain-wet excuse",
      variants: {
        went_inside: {
          id: "went_inside",
          label: "a rain-wet excuse that chose the stairs",
          signalCue: "Openness to a small, low-stakes risk.",
        },
      },
    },
  },
  nodes: {
    start: {
      id: "start",
      title: "Start",
      text: ["It is raining."],
      choices: [collectRainExcuse],
    },
  },
  endings: {
    ending_done: {
      id: "ending_done",
      title: "Done",
      summary: "You have finished.",
    },
  },
};

const initialState = createInitialStoryState(story);
assertDeepEqual(initialState.inventory, [], "initial inventory");

const firstCollection = getNextStoryState(initialState, collectRainExcuse);
assertDeepEqual(
  firstCollection.inventory,
  [{ itemId: "rain_wet_excuse", variantId: "went_inside" }],
  "first variant inventory collection",
);

const duplicateCollection = getNextStoryState(firstCollection, collectRainExcuse);
assertDeepEqual(
  duplicateCollection.inventory,
  [{ itemId: "rain_wet_excuse", variantId: "went_inside" }],
  "duplicate variant inventory collection",
);
