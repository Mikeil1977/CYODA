import type { StoryData, StoryState } from "../types/conversation";

export function getInventoryKey(entry: StoryState["inventory"][number]) {
  return `${entry.itemId}:${entry.variantId}`;
}

export function getInventoryDetails(storyItems: StoryData["items"], entry: StoryState["inventory"][number]) {
  const item = storyItems?.[entry.itemId];
  const variant = item?.variants?.[entry.variantId];

  return {
    label: variant?.label ?? item?.label ?? `${entry.itemId.replaceAll("_", " ")} (${entry.variantId})`,
    signalCue: variant?.signalCue,
    conversationPrompt: variant?.conversationPrompt,
  };
}

export function getInventoryReadout(storyItems: StoryData["items"], inventory: StoryState["inventory"]) {
  return inventory.map((entry) => ({
    key: getInventoryKey(entry),
    ...getInventoryDetails(storyItems, entry),
  }));
}

export function getInventoryCatalog(storyItems: StoryData["items"]) {
  return Object.values(storyItems ?? {}).flatMap((item) =>
    Object.keys(item.variants ?? {}).map((variantId) => {
      const entry: StoryState["inventory"][number] = {
        itemId: item.id,
        variantId,
      };

      return {
        key: getInventoryKey(entry),
        ...getInventoryDetails(storyItems, entry),
      };
    }),
  );
}

type InventoryHandoffInput = {
  subjectName: string;
  storyItems: StoryData["items"];
  inventory: StoryState["inventory"];
};

export function getInventoryHandoffLine({ subjectName, storyItems, inventory }: InventoryHandoffInput) {
  const handoffItem = inventory[inventory.length - 1];

  if (!handoffItem) {
    return `If this made you curious, come and tell ${subjectName} the weather won.`;
  }

  return `If this made you curious, come and tell ${subjectName}: "I found ${
    getInventoryDetails(storyItems, handoffItem).label
  }."`;
}
