export const compatibilityDimensions = [
  "economicFairness",
  "personalFreedom",
  "socialResponsibility",
  "institutionalTrust",
  "privacyAndCivilLiberties",
  "environmentalPriority",
  "pragmatism",
  "empathy",
  "traditionVsChange",
  "conflictStyle",
] as const;

export type CompatibilityDimension = (typeof compatibilityDimensions)[number];

export type CompatibilityProfile = Record<CompatibilityDimension, number>;

export type CompatibilityWeights = Record<CompatibilityDimension, number>;

export type CompatibilityQuestion = {
  id: string;
  example?: string;
  prompt: string;
  dimensions: CompatibilityDimension[];
  reverseScore?: boolean;
};

export const dimensionLabels: Record<CompatibilityDimension, string> = {
  economicFairness: "Money and fairness",
  personalFreedom: "Personal freedom",
  socialResponsibility: "Shared responsibility",
  institutionalTrust: "Rules and accountability",
  privacyAndCivilLiberties: "Privacy and personal rights",
  environmentalPriority: "Environment",
  pragmatism: "Practicality",
  empathy: "Empathy",
  traditionVsChange: "Tradition and change",
  conflictStyle: "Conflict style",
};

export const myCompatibilityProfile: CompatibilityProfile = {
  economicFairness: 100,
  personalFreedom: 100,
  socialResponsibility: 100,
  institutionalTrust: 100,
  privacyAndCivilLiberties: 100,
  environmentalPriority: 100,
  pragmatism: 100,
  empathy: 100,
  traditionVsChange: 100,
  conflictStyle: 100,
};

export const compatibilityDimensionWeights: CompatibilityWeights = {
  economicFairness: 1,
  personalFreedom: 1,
  socialResponsibility: 1,
  institutionalTrust: 1,
  privacyAndCivilLiberties: 1,
  environmentalPriority: 1,
  pragmatism: 1,
  empathy: 1,
  traditionVsChange: 1,
  conflictStyle: 1,
};

export const compatibilityQuestions: CompatibilityQuestion[] = [
  {
    id: "safety_net",
    example: "For example, someone who loses their job or gets ill should not immediately lose their home or be unable to eat.",
    prompt: "People should have a basic safety net when life goes wrong, even if everyone has to contribute more.",
    dimensions: ["economicFairness"],
  },
  {
    id: "lifestyle_choices",
    example: "For example, adults choosing how to dress, who to love, what faith to follow, or how to organise their home life.",
    prompt: "Adults should generally be free to live how they choose, even when other people disapprove.",
    dimensions: ["personalFreedom"],
  },
  {
    id: "privacy_security",
    example: "For example, being safer does not automatically mean everyone should have their messages, location, or private life monitored.",
    prompt: "People deserve privacy even when others say giving it up would make things safer.",
    dimensions: ["privacyAndCivilLiberties"],
  },
  {
    id: "children_starting_points",
    example: "For example, two children may both try hard, but one may have more support, money, confidence, or stability at home.",
    prompt: "Children should learn that effort matters, but adults should not pretend every child starts from the same place.",
    dimensions: ["economicFairness", "empathy"],
  },
  {
    id: "traditions_and_change",
    example: "For example, family habits can be meaningful, but they should not keep hurting people just because they are familiar.",
    prompt: "Traditions can be valuable, but they should not stop people changing things that no longer work.",
    dimensions: ["traditionVsChange", "pragmatism"],
  },
  {
    id: "environment_priority",
    example: "For example, choosing cleaner options, reducing waste, or accepting some cost now to avoid bigger harm later.",
    prompt: "Protecting the environment should matter even when it is inconvenient.",
    dimensions: ["environmentalPriority"],
  },
  {
    id: "circumstances_before_judgement",
    example: "For example, being late, short-tempered, or struggling with money can look different once you know what else is going on.",
    prompt: "Before judging someone's choices, it matters to understand what they were dealing with.",
    dimensions: ["empathy"],
  },
  {
    id: "institutions_and_accountability",
    example: "For example, schools, workplaces, courts, and services need rules, but bad rules should be challenged.",
    prompt: "Rules and systems can be useful, but they should be questioned when they stop working.",
    dimensions: ["institutionalTrust", "pragmatism"],
  },
  {
    id: "freedom_for_unpopular_views",
    example: "For example, someone may disagree with gender transition but still believe trans people should have legal rights, safety, privacy, and dignity.",
    prompt: "Personal freedom matters most when it protects people you disagree with.",
    dimensions: ["personalFreedom", "privacyAndCivilLiberties"],
  },
  {
    id: "community_responsibility",
    example: "For example, checking on a neighbour, keeping noise down late at night, or accepting small inconveniences when they protect someone more vulnerable.",
    prompt: "Communities work best when people accept some responsibility for one another.",
    dimensions: ["socialResponsibility"],
  },
  {
    id: "individual_effort",
    example: "For example, hard work matters, but so do health, luck, family support, discrimination, timing, and money.",
    prompt: "People's outcomes are shaped by both effort and circumstances.",
    dimensions: ["economicFairness"],
  },
  {
    id: "gradual_change",
    example: "For example, some problems need careful step-by-step change, while others keep causing harm if everyone waits too long.",
    prompt: "It is usually better to change things gradually than to push for rapid change.",
    dimensions: ["traditionVsChange"],
    reverseScore: true,
  },
  {
    id: "parenting_boundaries",
    example: "For example, bedtime can still be bedtime, but a child can be heard when they are upset, scared, or confused.",
    prompt: "Children need clear boundaries, but they should also be listened to.",
    dimensions: ["conflictStyle", "empathy"],
  },
  {
    id: "limits_on_surveillance",
    example: "For example, cameras, tracking, or message access can solve some problems but also create new ways to misuse power.",
    prompt: "There should be strong limits on surveillance, even if surveillance might make some wrongdoing easier to catch.",
    dimensions: ["privacyAndCivilLiberties"],
  },
  {
    id: "compromise",
    example: "For example, this is about reasonable needs and preferences, not pretending false facts are half true or compromising on safety.",
    prompt: "When both people have reasonable needs, compromise is usually better than one person getting everything their own way.",
    dimensions: ["conflictStyle"],
  },
  {
    id: "fairness_not_sameness",
    example: "For example, giving extra help to someone with a disability can be fair even though not everyone gets the same help.",
    prompt: "Fairness sometimes means treating people differently because their situations are different.",
    dimensions: ["empathy", "socialResponsibility"],
  },
  {
    id: "parenting_explains_rules",
    example: "For example, a child may still have to stop, but explaining the reason helps them learn rather than just obey.",
    prompt: "A good parent explains the reason for a rule instead of just saying, 'because I said so'.",
    dimensions: ["personalFreedom", "traditionVsChange"],
  },
  {
    id: "repair_not_shame",
    example: "For example, if they break something, the useful lesson is apologising and fixing it, not being made to feel worthless.",
    prompt: "When a child messes up, helping them repair it matters more than making them feel ashamed.",
    dimensions: ["empathy", "conflictStyle"],
  },
  {
    id: "systems_that_harm",
    example: "For example, a process can be efficient for most people but still need changing if it repeatedly harms a smaller group.",
    prompt: "When a system causes real harm, it should be changed even if it works well for some people.",
    dimensions: ["economicFairness", "pragmatism"],
  },
  {
    id: "rights_and_consequences",
    example: "For example, a choice can be personally important and still worth thinking through for how it affects other people.",
    prompt: "A good decision considers both personal rights and the effect on other people.",
    dimensions: ["personalFreedom", "socialResponsibility", "pragmatism"],
  },
];
