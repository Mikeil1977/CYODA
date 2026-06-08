import { absurdThirtySixAdventure } from "./absurdThirtySixAdventure";

function assert(condition: boolean, label: string) {
  if (!condition) {
    throw new Error(label);
  }
}

const itemIds = Object.keys(absurdThirtySixAdventure.items ?? {});
const nodeIds = Object.keys(absurdThirtySixAdventure.nodes);
const endingIds = Object.keys(absurdThirtySixAdventure.endings);
const requiredFrictionNodes = [
  "not_yet_scene",
  "sarah_spotlight",
  "jill_private_detail",
  "late_reply_oracle",
  "wrong_pint_scene",
];

assert(absurdThirtySixAdventure.startNodeId === "union_street_rain", "starts at Union Street rain");
assert(nodeIds.length >= 8, "prototype has at least eight scenes");
assert(itemIds.length === 14, "prototype defines the planned fourteen collectible item families");
assert(
  nodeIds.some((nodeId) => absurdThirtySixAdventure.nodes[nodeId].questionCue),
  "prototype includes dev-only question cues",
);
for (const nodeId of requiredFrictionNodes) {
  assert(nodeIds.includes(nodeId), `prototype includes friction scene ${nodeId}`);
}

let choiceSignalCueCount = 0;
let collectedVariantCount = 0;
const publicCopy: string[] = [];
const publicLeakTerms = [
  "red flag",
  "narciss",
  "manipulat",
  "diagnos",
  "relationship readiness",
  "control risk",
  "pressure/control",
  "entitlement",
  "resentment",
  "score",
];

function collectPublicCopy(...items: Array<string | undefined>) {
  items.forEach((item) => {
    if (item) {
      publicCopy.push(item);
    }
  });
}

for (const node of Object.values(absurdThirtySixAdventure.nodes)) {
  collectPublicCopy(node.title, ...node.text);
  for (const choice of node.choices) {
    collectPublicCopy(choice.label, choice.response);
    const pointsAtEnding = choice.nextId.startsWith("ending_");
    const targetExists = pointsAtEnding
      ? endingIds.includes(choice.nextId)
      : Object.prototype.hasOwnProperty.call(absurdThirtySixAdventure.nodes, choice.nextId);

    assert(targetExists, `choice ${choice.id} points at an existing node or ending`);

    if (choice.signalCue) {
      choiceSignalCueCount += 1;
    }

    for (const item of choice.effects?.collectItems ?? []) {
      collectedVariantCount += 1;
      assert(Boolean(choice.signalCue), `collecting choice ${choice.id} includes a dev-only signal cue`);
      const storyItem = absurdThirtySixAdventure.items?.[item.itemId];
      assert(Boolean(storyItem), `collected item ${item.itemId} is defined`);
      if (storyItem) {
        const variant = storyItem.variants?.[item.variantId];
        assert(Boolean(variant), `variant ${item.itemId}.${item.variantId} is defined`);
        assert(Boolean(variant?.signalCue), `variant ${item.itemId}.${item.variantId} includes signal cue`);
        assert(Boolean(variant?.conversationPrompt), `variant ${item.itemId}.${item.variantId} includes conversation prompt`);
      }
    }
  }
}

for (const item of Object.values(absurdThirtySixAdventure.items ?? {})) {
  collectPublicCopy(item.label, item.description);
  for (const variant of Object.values(item.variants ?? {})) {
    collectPublicCopy(variant.label, variant.description);
  }
}

for (const ending of Object.values(absurdThirtySixAdventure.endings)) {
  collectPublicCopy(ending.title, ending.summary);
}

for (const copy of publicCopy) {
  const lowered = copy.toLowerCase();
  for (const term of publicLeakTerms) {
    assert(!lowered.includes(term), `public copy avoids diagnostic term "${term}" in "${copy}"`);
  }
}

assert(choiceSignalCueCount >= 12, "prototype includes dev-only signal cues on meaningful choices");
assert(collectedVariantCount >= 30, "prototype includes enough answer-specific collected variants");
